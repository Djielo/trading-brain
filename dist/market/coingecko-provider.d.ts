/**
 * CoinGecko Provider — REST Crypto Prices (default, kostenlos)
 *
 * Kein API-Key nötig. Rate limit: ~30 req/min (free tier).
 * OHLCV nur 1-day/7-day granularity.
 */
import type { OHLCVCandle } from '../paper/types.js';
import type { MarketDataProvider } from './market-data-provider.js';
export declare class CoinGeckoProvider implements MarketDataProvider {
    readonly name = "coingecko";
    readonly assetTypes: readonly ["crypto"];
    readonly supportsStreaming = false;
    private readonly log;
    private consecutiveErrors;
    isAvailable(): Promise<boolean>;
    fetchPrices(symbols: string[]): Promise<Map<string, number>>;
    fetchOHLCV(symbol: string, _timeframe?: string, _limit?: number): Promise<OHLCVCandle[]>;
}
