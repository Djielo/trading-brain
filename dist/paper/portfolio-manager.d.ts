import type { PaperConfig, PaperPosition, PaperClosedTrade } from './types.js';
import type { PaperRepository } from '../db/repositories/paper.repository.js';
export declare class PortfolioManager {
    private config;
    private repo;
    private logger;
    constructor(config: PaperConfig, repo: PaperRepository);
    getBalance(): {
        balance: number;
        equity: number;
    };
    getOpenPositions(): PaperPosition[];
    hasPosition(symbol: string): boolean;
    canOpenPosition(): boolean;
    /**
     * Calculate position size: maxPositionPct% of equity.
     */
    calcPositionSize(): number;
    openPosition(pos: PaperPosition): number;
    closePosition(position: PaperPosition, exitPrice: number, exitReason: string): PaperClosedTrade;
    /**
     * Mark-to-market: update all positions with current prices.
     */
    updatePositionPrices(prices: Map<string, number>): void;
    getPerformanceSummary(): {
        totalPnl: number;
        winRate: number;
        totalTrades: number;
        avgHoldTime: number;
    };
    calcEquity(balance: number): number;
}
