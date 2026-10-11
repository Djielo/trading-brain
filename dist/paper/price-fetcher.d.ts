import type { PaperConfig, OHLCVCandle } from './types.js';
import type { PaperRepository } from '../db/repositories/paper.repository.js';
export declare class PriceFetcher {
    private config;
    private repo;
    private priceCache;
    private candleCache;
    private lastOHLCVFetch;
    private readonly OHLCV_INTERVAL;
    private logger;
    /** Track which symbols have stale prices */
    private staleSymbols;
    /** Check if a symbol's price is stale */
    isStale(symbol: string): boolean;
    /** Get all symbols with stale prices */
    getStaleSymbols(): string[];
    /**
     * Prune old prices from DB. Default: 30 days retention.
     * Called at startup and periodically by trading-core retention cleanup.
     */
    pruneOldPrices(retentionDays?: number): number;
    private providerErrors;
    private providerBackoff;
    private readonly MAX_CONSECUTIVE_ERRORS;
    private readonly MAX_BACKOFF_MS;
    constructor(config: PaperConfig, repo: PaperRepository);
    /**
     * Fetch all prices (current spot + OHLCV if stale).
     */
    fetchAll(): Promise<Map<string, number>>;
    getPrice(symbol: string): number | undefined;
    getCandles(symbol: string): OHLCVCandle[];
    getAllSymbols(): string[];
    private fetchCryptoPrices;
    private fetchStockPrices;
    private fetchOHLCVData;
    private mergeCandles;
    private delay;
    private getBackoff;
    private recordProviderError;
    private recordProviderSuccess;
    private loadCacheFromDb;
}
