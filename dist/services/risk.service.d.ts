import type { TradeRepository } from '../db/repositories/trade.repository.js';
import type { SignalService } from './signal.service.js';
import type { SynapseManager } from '../synapses/synapse-manager.js';
export interface KellyResult {
    kellyFraction: number;
    halfKelly: number;
    brainAdjusted: number;
    sampleSize: number;
    winRate: number;
    avgWin: number;
    avgLoss: number;
    recommendation: 'aggressive' | 'normal' | 'conservative' | 'avoid';
}
export interface PositionSizeResult {
    sizePct: number;
    kellyRaw: number;
    confidence: number;
    reason: string;
}
export interface RiskMetrics {
    maxDrawdownPct: number;
    currentDrawdownPct: number;
    consecutiveLosses: number;
    maxConsecutiveLosses: number;
    riskRewardRatio: number;
    expectancy: number;
}
export declare class RiskService {
    private tradeRepo;
    private signalService;
    private synapseManager;
    private logger;
    constructor(tradeRepo: TradeRepository, signalService: SignalService, synapseManager: SynapseManager);
    /**
     * Calculate Kelly Criterion fraction for position sizing.
     * K = W - (1-W)/R where W = win rate, R = avg win / avg loss ratio.
     */
    getKellyFraction(pair?: string, regime?: string): KellyResult;
    /**
     * Get a recommended position size based on Kelly Criterion and signal confidence.
     * Caps at 25% of capital per position.
     */
    getPositionSize(capitalPct: number, signals: {
        fingerprint: string;
        confidence?: number;
    }, regime?: string): PositionSizeResult;
    /**
     * Get risk metrics for overall portfolio or a specific pair.
     */
    getRiskMetrics(pair?: string): RiskMetrics;
    private getFilteredTrades;
}
