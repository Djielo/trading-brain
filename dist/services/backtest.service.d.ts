import type { TradeRepository } from '../db/repositories/trade.repository.js';
import type { SignalService } from './signal.service.js';
import type { SynapseManager } from '../synapses/synapse-manager.js';
import type { OHLCVCandle } from '../paper/types.js';
import type { ForgeStrategy } from '@timmeck/brain-core';
export interface BacktestOptions {
    pair?: string;
    regime?: string;
    timeframe?: string;
    botType?: string;
    fromDate?: string;
    toDate?: string;
    signalFilter?: string;
}
export interface PairRegimeStats {
    wins: number;
    losses: number;
    profitPct: number;
}
export interface EquityPoint {
    tradeIndex: number;
    cumulativePct: number;
}
export interface BacktestResult {
    totalTrades: number;
    wins: number;
    losses: number;
    winRate: number;
    totalProfitPct: number;
    avgProfitPct: number;
    avgWinPct: number;
    avgLossPct: number;
    maxDrawdownPct: number;
    profitFactor: number;
    sharpeRatio: number;
    bestTrade: number;
    worstTrade: number;
    tradesByPair: Map<string, PairRegimeStats>;
    tradesByRegime: Map<string, PairRegimeStats>;
    equityCurve: EquityPoint[];
}
export interface SignalComparison {
    fingerprint1: string;
    fingerprint2: string;
    stats1: {
        wins: number;
        losses: number;
        winRate: number;
        avgProfitPct: number;
        sampleSize: number;
    };
    stats2: {
        wins: number;
        losses: number;
        winRate: number;
        avgProfitPct: number;
        sampleSize: number;
    };
    similarity: number;
    verdict: string;
}
export interface StrategyBacktestOptions {
    strategyId: number;
    pair?: string;
    days?: number;
    initialCapital?: number;
}
export interface StrategyBacktestResult {
    strategyId: number;
    strategyName: string;
    pair: string;
    days: number;
    totalTrades: number;
    wins: number;
    losses: number;
    winRate: number;
    totalReturnPct: number;
    sharpeRatio: number;
    maxDrawdownPct: number;
    profitFactor: number;
    avgReturnPct: number;
    equityCurve: EquityPoint[];
}
export interface RankedSignal {
    fingerprint: string;
    wins: number;
    losses: number;
    winRate: number;
    avgProfitPct: number;
    sampleSize: number;
    synapseWeight: number | null;
}
export declare class BacktestService {
    private tradeRepo;
    private signalService;
    private synapseManager;
    private logger;
    constructor(tradeRepo: TradeRepository, signalService: SignalService, synapseManager: SynapseManager);
    /**
     * Run a backtest on existing historical trades in the DB.
     * Filters trades by the given options and computes performance statistics.
     */
    runBacktest(options?: BacktestOptions): BacktestResult;
    /**
     * Compare two signal fingerprint patterns head-to-head.
     */
    compareSignals(fingerprint1: string, fingerprint2: string): SignalComparison;
    /**
     * Find top N signal patterns by win rate, requiring a minimum sample size.
     */
    findBestSignals(options?: {
        minSampleSize?: number;
        topN?: number;
        pair?: string;
        regime?: string;
    }): RankedSignal[];
    private filterTrades;
    private computeSignalStats;
    /**
     * Run a strategy backtest on historical OHLCV candle data.
     * Evaluates strategy rules against each candle to simulate trades.
     */
    runStrategyBacktest(strategy: ForgeStrategy, candles: OHLCVCandle[], options?: {
        pair?: string;
        initialCapital?: number;
    }): StrategyBacktestResult;
    /** Evaluate strategy rules for entry/exit signals based on candle data. */
    private evaluateRules;
    private emptyResult;
}
