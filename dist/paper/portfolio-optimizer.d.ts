import type Database from 'better-sqlite3';
export interface PortfolioOptimizerConfig {
    maxPositionPct?: number;
    maxConcentrationPct?: number;
    minDiversification?: number;
    kellyFraction?: number;
    rebalanceThresholdPct?: number;
}
export interface PositionSizeRecommendation {
    symbol: string;
    recommendedSize: number;
    reason: string;
    kellyPct: number;
    concentrationPct: number;
    diversificationOk: boolean;
}
export interface PortfolioHealth {
    totalEquity: number;
    positionCount: number;
    largestPositionPct: number;
    smallestPositionPct: number;
    diversificationScore: number;
    concentrationRisk: 'low' | 'medium' | 'high';
    recommendations: string[];
}
export declare function runPortfolioOptimizerMigration(db: Database.Database): void;
export declare class PortfolioOptimizer {
    private readonly db;
    private readonly config;
    private readonly stmtInsertSnapshot;
    private readonly stmtGetSnapshots;
    constructor(db: Database.Database, config?: PortfolioOptimizerConfig);
    /** Calculate optimal position size using Kelly criterion */
    calcPositionSize(equity: number, symbol: string, winRate: number, avgWin: number, avgLoss: number, existingPositions: Array<{
        symbol: string;
        usdtAmount: number;
    }>): PositionSizeRecommendation;
    /** Assess overall portfolio health */
    checkHealth(equity: number, positions: Array<{
        symbol: string;
        usdtAmount: number;
    }>): PortfolioHealth;
    /** Get snapshot history */
    getHistory(limit?: number): unknown[];
    /** Check if a position needs rebalancing */
    needsRebalance(currentPct: number, targetPct: number): boolean;
}
