import type Database from 'better-sqlite3';
import type { PaperPosition, PaperClosedTrade, OHLCVCandle } from '../../paper/types.js';
interface BalanceRow {
    id: number;
    balance: number;
    equity: number;
    event: string;
    created_at: string;
}
export declare class PaperRepository {
    private db;
    private stmts;
    constructor(db: Database.Database);
    getBalance(): {
        balance: number;
        equity: number;
    };
    updateBalance(balance: number, equity: number, event: string): void;
    getBalanceHistory(limit?: number): BalanceRow[];
    createPosition(pos: PaperPosition): number;
    getOpenPositions(): PaperPosition[];
    getPositionBySymbol(symbol: string): PaperPosition | undefined;
    updatePositionPrice(id: number, currentPrice: number, pnlPct: number, highWaterMark: number): void;
    deletePosition(id: number): void;
    countPositions(): number;
    createTrade(trade: PaperClosedTrade): number;
    getRecentTrades(limit?: number): PaperClosedTrade[];
    countTrades(): number;
    getWinRate(): {
        total: number;
        wins: number;
        rate: number;
    };
    getTotalPnl(): number;
    savePrices(symbol: string, candles: OHLCVCandle[]): void;
    getPrices(symbol: string): OHLCVCandle[];
    getRecentPrices(symbol: string, limit: number): OHLCVCandle[];
    pruneOldPrices(beforeTimestamp: number): void;
    countPrices(symbol: string): number;
    reset(startingBalance: number): void;
    private rowToPosition;
}
export {};
