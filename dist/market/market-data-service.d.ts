/**
 * Market Data Service — Aggregiert alle Provider, Event-driven Preise
 *
 * Architektur:
 *   MarketDataService
 *     ├── CoinGeckoProvider (REST, default)
 *     ├── CCXTProvider (WebSocket, optional)
 *     ├── YahooProvider (REST, default für Stocks)
 *     └── priceStream: EventEmitter → emit('price', PriceUpdate)
 */
import type { OHLCVCandle } from '../paper/types.js';
import type { MarketDataProvider, PriceUpdate, MarketDataProviderStatus } from './market-data-provider.js';
type PriceListener = (update: PriceUpdate) => void;
export declare class MarketDataService {
    private providers;
    private priceCache;
    private ohlcvCache;
    private listeners;
    private readonly log;
    /**
     * Register a market data provider.
     *
     * Example:
     * ```typescript
     * const service = new MarketDataService();
     * service.registerProvider(new CoinGeckoProvider());
     * service.registerProvider(new CCXTProvider({ exchangeId: 'binance' }));
     * service.registerProvider(new YahooProvider());
     * ```
     */
    registerProvider(provider: MarketDataProvider): void;
    removeProvider(name: string): void;
    getProviders(): MarketDataProvider[];
    /** Subscribe to real-time price updates */
    onPrice(listener: PriceListener): () => void;
    /** Emit a price update to all listeners */
    private emitPrice;
    /**
     * Fetch prices for all symbols from best available provider.
     * Tries streaming providers first, then REST.
     */
    fetchPrices(cryptoSymbols: string[], stockSymbols: string[]): Promise<Map<string, number>>;
    /** Fetch OHLCV from best available provider, with caching */
    fetchOHLCV(symbol: string, timeframe?: string, limit?: number): Promise<OHLCVCandle[]>;
    /** Start real-time streaming from all capable providers */
    startStreaming(symbols: string[]): Promise<void>;
    /** Stop all streaming */
    stopStreaming(): Promise<void>;
    /** Get last known price for a symbol */
    getPrice(symbol: string): number | undefined;
    /** Get all cached prices */
    getAllPrices(): Map<string, number>;
    /** Get cached candles for a symbol */
    getCandles(symbol: string): OHLCVCandle[];
    /** Get status of all providers */
    getProviderStatus(): Promise<MarketDataProviderStatus[]>;
    /** Graceful shutdown */
    shutdown(): Promise<void>;
}
export {};
