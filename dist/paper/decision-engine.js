import { fingerprint } from '../signals/fingerprint.js';
import { getLogger } from '../utils/logger.js';
export class DecisionEngine {
    config;
    signalService;
    logger = getLogger();
    constructor(config, signalService) {
        this.config = config;
        this.signalService = signalService;
    }
    /**
     * Detect market regime from indicators.
     */
    detectRegime(indicators) {
        if (indicators.trendScore > 2)
            return 'bullish_trend';
        if (indicators.trendScore < -2)
            return 'bearish_trend';
        if (indicators.volatility > 60)
            return 'volatile';
        return 'ranging';
    }
    /**
     * Check all positions for exit conditions.
     */
    checkExits(positions, prices) {
        const exits = [];
        for (const pos of positions) {
            const currentPrice = prices.get(pos.symbol);
            if (currentPrice === undefined)
                continue;
            const pnlPct = ((currentPrice - pos.entryPrice) / pos.entryPrice) * 100;
            const reason = this.getExitReason(pos, currentPrice, pnlPct);
            if (reason) {
                exits.push({ position: pos, reason, currentPrice });
            }
        }
        return exits;
    }
    /**
     * Check which symbols qualify for entry.
     */
    checkEntries(symbols, prices, indicatorMap, openSymbols) {
        const entries = [];
        for (const symbol of symbols) {
            if (openSymbols.has(symbol))
                continue;
            const price = prices.get(symbol);
            const indicators = indicatorMap.get(symbol);
            if (!price || !indicators)
                continue;
            const regime = this.detectRegime(indicators);
            const signals = {
                rsi14: indicators.rsi14,
                macd: indicators.macd.line,
                trendScore: indicators.trendScore,
                volatility: indicators.volatility,
                regime,
            };
            const fp = fingerprint(signals);
            const confidence = this.signalService.getConfidence(signals, regime);
            const weights = this.signalService.getSignalWeights(signals, regime);
            const score = this.calcScore(weights);
            // Entry conditions
            if (!this.shouldEnter(indicators, confidence, score, regime))
                continue;
            entries.push({
                symbol,
                price,
                indicators,
                fingerprint: fp,
                confidence,
                score,
                regime,
                signalsJson: JSON.stringify(signals),
            });
        }
        // Sort by confidence descending, take best ones
        entries.sort((a, b) => b.confidence - a.confidence);
        return entries;
    }
    getExitReason(pos, currentPrice, pnlPct) {
        // Stop-Loss
        if (pnlPct <= this.config.stopLossPct) {
            return 'stop_loss';
        }
        // Take-Profit
        if (pnlPct >= this.config.takeProfitPct) {
            return 'take_profit';
        }
        // Trailing Stop: activate at +trailingStopActivation%, trail by trailingStopDistance%
        if (pnlPct >= this.config.trailingStopActivation) {
            const drawdownFromHigh = ((pos.highWaterMark - currentPrice) / pos.highWaterMark) * 100;
            if (drawdownFromHigh >= this.config.trailingStopDistance) {
                return 'trailing_stop';
            }
        }
        // Time Exit
        const openTime = new Date(pos.openedAt).getTime();
        const holdHours = (Date.now() - openTime) / 3600000;
        if (holdHours > this.config.timeExitHours) {
            return 'time_exit';
        }
        return null;
    }
    shouldEnter(indicators, confidence, score, regime) {
        // Don't enter in bearish regime
        if (regime === 'bearish_trend')
            return false;
        // Cold-start: when brain has no data, confidence is 0 — use a lower threshold
        const coldStart = confidence === 0;
        const confThreshold = coldStart ? 0.3 : this.config.confidenceThreshold;
        // Confidence threshold
        if (confidence < confThreshold) {
            // Still allow if strong technical signal
            const hasBullishDiv = indicators.rsi14 < 30 && indicators.macd.line > 0;
            const hasStrongTrend = indicators.trendScore > 2 && indicators.volatility < 60;
            if (!hasBullishDiv && !hasStrongTrend)
                return false;
        }
        // Score threshold (if brain has enough data)
        if (score > 0 && score < this.config.scoreThreshold) {
            // Allow entry if very strong technical signal
            const hasBullishDiv = indicators.rsi14 < 30 && indicators.macd.line > 0;
            if (!hasBullishDiv)
                return false;
        }
        // At least one bullish condition must be true
        const conditions = [
            indicators.rsi14 < 30 && indicators.macd.line > 0, // Bullish divergence
            indicators.trendScore > 2 && indicators.volatility < 60, // Strong trend, low vol
            indicators.rsi14 < 40 && indicators.trendScore > 1, // Low RSI + uptrend
            indicators.macd.histogram > 0 && indicators.trendScore > 0, // MACD bullish + trend
        ];
        return conditions.some(c => c);
    }
    calcScore(weights) {
        return Object.values(weights).reduce((sum, w) => sum + w, 0);
    }
}
//# sourceMappingURL=decision-engine.js.map