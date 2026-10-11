import type { OHLCVCandle, IndicatorResult } from './types.js';
/**
 * Wilder's smoothed RSI.
 */
export declare function calcRSI(candles: OHLCVCandle[], period?: number): number;
/**
 * MACD (12, 26, 9): line, signal, histogram.
 */
export declare function calcMACD(candles: OHLCVCandle[], fastPeriod?: number, slowPeriod?: number, signalPeriod?: number): {
    line: number;
    signal: number;
    histogram: number;
};
/**
 * Trend score: SMA(10) vs SMA(30) crossover.
 * Returns -5 to +5 range based on distance.
 */
export declare function calcTrendScore(candles: OHLCVCandle[]): number;
/**
 * ATR-based volatility as percentage of close price.
 */
export declare function calcVolatility(candles: OHLCVCandle[], period?: number): number;
/**
 * Calculate all indicators for a set of candles.
 */
export declare function calcAllIndicators(candles: OHLCVCandle[]): IndicatorResult;
