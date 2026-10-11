import type { TradeRecord } from '../db/repositories/trade.repository.js';
import type { CalibrationConfig } from '../types/config.types.js';
export interface ExtractedRule {
    pattern: string;
    confidence: number;
    sample_count: number;
    win_rate: number;
    avg_profit: number;
}
/**
 * Extract trading rules from outcome data using fingerprint grouping + Wilson Score.
 * Ported from tradingBrain.js _extractPatterns().
 */
export declare function extractPatterns(trades: TradeRecord[], cal: CalibrationConfig): ExtractedRule[];
