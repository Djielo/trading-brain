/**
 * CCXT WebSocket Provider — Echtzeit-Preise von 100+ Exchanges
 *
 * ═══════════════════════════════════════════════════════════════
 *  EINRICHTEN (optional)
 * ═══════════════════════════════════════════════════════════════
 *
 *  1. ccxt ist bereits installiert (npm install ccxt)
 *  2. In .env:
 *     CCXT_EXCHANGES=binance             # Welche Exchange(s)
 *     # Optional für private API (nicht nötig für Preis-Feeds):
 *     BINANCE_API_KEY=...
 *     BINANCE_SECRET=...
 *  3. Trading Brain registriert CCXT automatisch beim Start.
 *
 *  Unterstützte Exchanges (Auswahl):
 *  - binance, coinbase, kraken, okx, bybit, bitget, gate
 *  - Alle 100+ CCXT Pro Exchanges
 *
 *  Ohne CCXT: CoinGecko REST Polling (15-Min OHLCV).
 *  Mit CCXT: Echtzeit Ticker + 1h Candles via WebSocket.
 * ═══════════════════════════════════════════════════════════════
 */
import type { OHLCVCandle } from '../paper/types.js';
import type { MarketDataProvider, PriceUpdate } from './market-data-provider.js';
export interface CCXTProviderConfig {
    /** Exchange ID (e.g. 'binance', 'coinbase'). Default: 'binance' */
    exchangeId?: string;
    /** API key (optional, not needed for public data) */
    apiKey?: string;
    /** API secret (optional) */
    secret?: string;
    /** Sandbox mode. Default: false */
    sandbox?: boolean;
}
export declare class CCXTProvider implements MarketDataProvider {
    readonly name: string;
    readonly assetTypes: readonly ["crypto"];
    readonly supportsStreaming = true;
    private readonly exchangeId;
    private readonly config;
    private readonly log;
    private exchange;
    private streaming;
    private stopRequested;
    constructor(config?: CCXTProviderConfig);
    isAvailable(): Promise<boolean>;
    fetchPrices(symbols: string[]): Promise<Map<string, number>>;
    fetchOHLCV(symbol: string, timeframe?: string, limit?: number): Promise<OHLCVCandle[]>;
    startStreaming(symbols: string[], onPrice: (update: PriceUpdate) => void): Promise<void>;
    stopStreaming(): Promise<void>;
    shutdown(): Promise<void>;
    private getExchange;
    private watchSymbol;
    /** Convert our symbol (e.g. 'bitcoin') to CCXT format (e.g. 'BTC/USDT') */
    private toCCXTSymbol;
    /** Convert CCXT symbol back to our format */
    private fromCCXTSymbol;
}
