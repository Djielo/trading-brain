/**
 * Market Data Provider Interface — Multi-Source Price Feeds
 *
 * ═══════════════════════════════════════════════════════════════
 *  PROVIDER EINRICHTEN
 * ═══════════════════════════════════════════════════════════════
 *
 *  CoinGecko (default, REST, kostenlos):
 *    → Funktioniert out of the box, keine Konfiguration nötig.
 *    → Polling alle 60s, OHLCV alle 15min.
 *
 *  CCXT WebSocket (optional, Echtzeit):
 *    1. npm install ccxt (bereits installiert)
 *    2. In .env oder config:
 *       CCXT_EXCHANGES=binance          # Kommasepariert: binance,coinbase,kraken
 *    3. Optional für private APIs (nicht nötig für Preise):
 *       BINANCE_API_KEY=...
 *       BINANCE_SECRET=...
 *    → Trading Brain erkennt CCXT automatisch.
 *      Preise kommen per WebSocket in Echtzeit.
 *      Fallback auf CoinGecko wenn WS disconnected.
 *
 *  Yahoo Finance (default für Stocks, REST):
 *    → Funktioniert out of the box.
 *
 *  Eigenen Provider bauen:
 *    Implementiere MarketDataProvider, registriere mit
 *    marketDataService.registerProvider(new MyProvider())
 * ═══════════════════════════════════════════════════════════════
 */
export {};
//# sourceMappingURL=market-data-provider.js.map