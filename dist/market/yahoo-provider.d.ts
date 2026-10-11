/**
 * Yahoo Finance Provider — REST Stock Prices (default, kostenlos)
 *
 * Kein API-Key nötig. Rate limit: casual use OK.
 */
import type { OHLCVCandle } from '../paper/types.js';
import type { MarketDataProvider } from './market-data-provider.js';
export declare class YahooProvider implements MarketDataProvider {
    readonly name = "yahoo";
    readonly assetTypes: readonly ["stock"];
    readonly supportsStreaming = false;
    private readonly log;
    /** Track which symbols returned stale prices */
    private staleSymbols;
    /** Check if last fetched price for a symbol was stale */
    isStale(symbol: string): boolean;
    /** Get all currently stale symbols */
    getStaleSymbols(): string[];
    isAvailable(): Promise<boolean>;
    fetchPrices(symbols: string[]): Promise<Map<string, number>>;
    fetchOHLCV(symbol: string, _timeframe?: string, _limit?: number): Promise<OHLCVCandle[]>;
    private delay;
}
