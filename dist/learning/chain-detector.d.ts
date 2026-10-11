import type { TradeRecord } from '../db/repositories/trade.repository.js';
export interface DetectedChain {
    pair: string;
    type: 'winning_streak' | 'losing_streak';
    length: number;
    fingerprints: string[];
    total_profit: number;
}
/**
 * Detect winning/losing streaks from recent trade outcomes.
 * Ported from tradingBrain.js _detectChain().
 *
 * @param recentTrades - Last N trades (should be ~10)
 * @param latestTrade - The most recent trade
 * @param minLength - Minimum consecutive trades for a chain (default: 3)
 */
export declare function detectChain(recentTrades: TradeRecord[], latestTrade: TradeRecord, minLength?: number): DetectedChain | null;
