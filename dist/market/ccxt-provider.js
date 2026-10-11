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
import { getLogger } from '../utils/logger.js';
export class CCXTProvider {
    name;
    assetTypes = ['crypto'];
    supportsStreaming = true;
    exchangeId;
    config;
    log = getLogger();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exchange = null;
    streaming = false;
    stopRequested = false;
    constructor(config = {}) {
        this.exchangeId = config.exchangeId ?? process.env.CCXT_EXCHANGE ?? 'binance';
        this.name = `ccxt-${this.exchangeId}`;
        this.config = config;
    }
    async isAvailable() {
        try {
            const exchange = await this.getExchange();
            if (!exchange)
                return false;
            await exchange.loadMarkets();
            return true;
        }
        catch {
            return false;
        }
    }
    async fetchPrices(symbols) {
        const prices = new Map();
        try {
            const exchange = await this.getExchange();
            if (!exchange)
                return prices;
            // Convert symbols to CCXT format (e.g. 'bitcoin' → 'BTC/USDT')
            const ccxtSymbols = symbols.map(s => this.toCCXTSymbol(s)).filter(Boolean);
            for (const symbol of ccxtSymbols) {
                try {
                    const ticker = await exchange.fetchTicker(symbol);
                    if (ticker?.last) {
                        // Map back to our format
                        const ourSymbol = this.fromCCXTSymbol(symbol);
                        prices.set(ourSymbol, ticker.last);
                    }
                }
                catch {
                    // Individual symbol fetch can fail, continue
                }
            }
        }
        catch (err) {
            this.log.warn(`CCXT ${this.exchangeId} fetchPrices error: ${err.message}`);
        }
        return prices;
    }
    async fetchOHLCV(symbol, timeframe = '1h', limit = 100) {
        try {
            const exchange = await this.getExchange();
            if (!exchange)
                return [];
            const ccxtSymbol = this.toCCXTSymbol(symbol);
            if (!ccxtSymbol)
                return [];
            const ohlcv = await exchange.fetchOHLCV(ccxtSymbol, timeframe, undefined, limit);
            if (!Array.isArray(ohlcv))
                return [];
            return ohlcv.map((candle) => ({
                timestamp: candle[0],
                open: candle[1],
                high: candle[2],
                low: candle[3],
                close: candle[4],
                volume: candle[5] ?? 0,
            }));
        }
        catch (err) {
            this.log.warn(`CCXT ${this.exchangeId} OHLCV error: ${err.message}`);
            return [];
        }
    }
    async startStreaming(symbols, onPrice) {
        const exchange = await this.getExchange();
        if (!exchange || !exchange.has?.watchTicker) {
            this.log.warn(`CCXT ${this.exchangeId}: WebSocket not supported, use REST fallback`);
            return;
        }
        this.streaming = true;
        this.stopRequested = false;
        const ccxtSymbols = symbols.map(s => this.toCCXTSymbol(s)).filter(Boolean);
        // Watch each symbol in parallel
        for (const symbol of ccxtSymbols) {
            this.watchSymbol(exchange, symbol, onPrice).catch(err => {
                if (!this.stopRequested) {
                    this.log.warn(`CCXT watch ${symbol} error: ${err.message}`);
                }
            });
        }
        this.log.debug(`CCXT ${this.exchangeId} streaming ${ccxtSymbols.length} symbols`);
    }
    async stopStreaming() {
        this.stopRequested = true;
        this.streaming = false;
        if (this.exchange?.close) {
            try {
                await this.exchange.close();
            }
            catch {
                // Best effort
            }
        }
    }
    async shutdown() {
        await this.stopStreaming();
        this.exchange = null;
    }
    // ── Private ────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getExchange() {
        if (this.exchange)
            return this.exchange;
        try {
            // Dynamic import — ccxt is optional
            const ccxt = await import('ccxt');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ExchangeClass = ccxt.pro?.[this.exchangeId] ?? ccxt[this.exchangeId];
            if (!ExchangeClass) {
                this.log.warn(`CCXT exchange '${this.exchangeId}' not found`);
                return null;
            }
            this.exchange = new ExchangeClass({
                apiKey: this.config.apiKey,
                secret: this.config.secret,
                ...(this.config.sandbox ? { sandbox: true } : {}),
            });
            return this.exchange;
        }
        catch (err) {
            this.log.debug(`CCXT not available: ${err.message}`);
            return null;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async watchSymbol(exchange, symbol, onPrice) {
        while (this.streaming && !this.stopRequested) {
            try {
                const ticker = await exchange.watchTicker(symbol);
                if (ticker?.last) {
                    onPrice({
                        symbol: this.fromCCXTSymbol(symbol),
                        price: ticker.last,
                        timestamp: ticker.timestamp ?? Date.now(),
                        source: this.name,
                        bid: ticker.bid,
                        ask: ticker.ask,
                        volume24h: ticker.quoteVolume,
                    });
                }
            }
            catch (err) {
                if (this.stopRequested)
                    break;
                this.log.warn(`CCXT watch ${symbol} reconnecting: ${err.message}`);
                await new Promise(r => setTimeout(r, 5000)); // Wait 5s before reconnect
            }
        }
    }
    /** Convert our symbol (e.g. 'bitcoin') to CCXT format (e.g. 'BTC/USDT') */
    toCCXTSymbol(symbol) {
        // Common CoinGecko ID → CCXT symbol mapping
        const map = {
            'bitcoin': 'BTC/USDT',
            'ethereum': 'ETH/USDT',
            'solana': 'SOL/USDT',
            'cardano': 'ADA/USDT',
            'ripple': 'XRP/USDT',
            'dogecoin': 'DOGE/USDT',
            'polkadot': 'DOT/USDT',
            'avalanche-2': 'AVAX/USDT',
            'chainlink': 'LINK/USDT',
            'polygon': 'MATIC/USDT',
            'litecoin': 'LTC/USDT',
            'uniswap': 'UNI/USDT',
        };
        // If it's already in CCXT format (contains /), pass through
        if (symbol.includes('/'))
            return symbol;
        return map[symbol.toLowerCase()] ?? null;
    }
    /** Convert CCXT symbol back to our format */
    fromCCXTSymbol(symbol) {
        const reverseMap = {
            'BTC/USDT': 'bitcoin',
            'ETH/USDT': 'ethereum',
            'SOL/USDT': 'solana',
            'ADA/USDT': 'cardano',
            'XRP/USDT': 'ripple',
            'DOGE/USDT': 'dogecoin',
            'DOT/USDT': 'polkadot',
            'AVAX/USDT': 'avalanche-2',
            'LINK/USDT': 'chainlink',
            'MATIC/USDT': 'polygon',
            'LTC/USDT': 'litecoin',
            'UNI/USDT': 'uniswap',
        };
        return reverseMap[symbol] ?? symbol.split('/')[0]?.toLowerCase() ?? symbol;
    }
}
//# sourceMappingURL=ccxt-provider.js.map