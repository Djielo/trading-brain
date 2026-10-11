export interface SignalInput {
    rsi14?: number;
    macd?: number;
    trendScore?: number;
    volatility?: number;
    regime?: string;
}
export interface DecomposedNode {
    id: string;
    type: string;
    label: string;
}
export declare function classifyRSI(rsi: number): string;
export declare function classifyMACD(macd: number, trendScore: number): string;
export declare function classifyTrend(trendScore: number): string;
export declare function classifyVolatility(volatility: number): string;
/**
 * Create a signal fingerprint string from input signals.
 * Format: rsi_class|macd_class|trend_class|vol_class[|regime]
 */
export declare function fingerprint(signals: SignalInput): string;
/**
 * Compare two fingerprints for similarity (0-1).
 */
export declare function fingerprintSimilarity(fp1: string, fp2: string): number;
/**
 * Decompose a fingerprint into individual graph node IDs for the weighted graph.
 */
export declare function decomposeFingerprint(fp: string, regime?: string, pair?: string, botType?: string): DecomposedNode[];
