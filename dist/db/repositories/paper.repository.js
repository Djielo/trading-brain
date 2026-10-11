export class PaperRepository {
    db;
    stmts;
    constructor(db) {
        this.db = db;
        this.stmts = {
            // Balance
            getBalance: db.prepare('SELECT * FROM paper_balance ORDER BY id DESC LIMIT 1'),
            updateBalance: db.prepare('INSERT INTO paper_balance (balance, equity, event) VALUES (?, ?, ?)'),
            getBalanceHistory: db.prepare('SELECT * FROM paper_balance ORDER BY id DESC LIMIT ?'),
            // Positions
            createPosition: db.prepare(`
        INSERT INTO paper_positions (symbol, side, entry_price, quantity, usdt_amount, current_price, high_water_mark, signals_json, fingerprint, confidence, regime)
        VALUES (@symbol, @side, @entry_price, @quantity, @usdt_amount, @current_price, @high_water_mark, @signals_json, @fingerprint, @confidence, @regime)
      `),
            getOpenPositions: db.prepare('SELECT * FROM paper_positions ORDER BY opened_at DESC'),
            getPositionBySymbol: db.prepare('SELECT * FROM paper_positions WHERE symbol = ?'),
            updatePositionPrice: db.prepare('UPDATE paper_positions SET current_price = ?, pnl_pct = ?, high_water_mark = ? WHERE id = ?'),
            deletePosition: db.prepare('DELETE FROM paper_positions WHERE id = ?'),
            countPositions: db.prepare('SELECT COUNT(*) as count FROM paper_positions'),
            // Trades
            createTrade: db.prepare(`
        INSERT INTO paper_trades (symbol, side, entry_price, exit_price, quantity, usdt_amount, pnl_usdt, pnl_pct, exit_reason, signals_json, fingerprint, confidence, regime, opened_at)
        VALUES (@symbol, @side, @entry_price, @exit_price, @quantity, @usdt_amount, @pnl_usdt, @pnl_pct, @exit_reason, @signals_json, @fingerprint, @confidence, @regime, @opened_at)
      `),
            getRecentTrades: db.prepare('SELECT * FROM paper_trades ORDER BY closed_at DESC LIMIT ?'),
            countTrades: db.prepare('SELECT COUNT(*) as count FROM paper_trades'),
            getWinRate: db.prepare('SELECT COUNT(*) as total, SUM(CASE WHEN pnl_pct > 0 THEN 1 ELSE 0 END) as wins FROM paper_trades'),
            getTotalPnl: db.prepare('SELECT COALESCE(SUM(pnl_usdt), 0) as total FROM paper_trades'),
            // Price Cache
            savePrice: db.prepare(`
        INSERT INTO paper_price_cache (symbol, timestamp, open, high, low, close, volume)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `),
            getPrices: db.prepare('SELECT * FROM paper_price_cache WHERE symbol = ? ORDER BY timestamp ASC'),
            getRecentPrices: db.prepare('SELECT * FROM paper_price_cache WHERE symbol = ? ORDER BY timestamp DESC LIMIT ?'),
            pruneOldPrices: db.prepare("DELETE FROM paper_price_cache WHERE timestamp < ?"),
            countPrices: db.prepare('SELECT COUNT(*) as count FROM paper_price_cache WHERE symbol = ?'),
            // Reset
            resetAll: db.prepare('DELETE FROM paper_positions'),
            resetTrades: db.prepare('DELETE FROM paper_trades'),
            resetBalance: db.prepare('DELETE FROM paper_balance'),
            resetPrices: db.prepare('DELETE FROM paper_price_cache'),
        };
    }
    // ─── Balance ────────────────────────────────────────────
    getBalance() {
        const row = this.stmts['getBalance'].get();
        return { balance: row?.balance ?? 10000, equity: row?.equity ?? 10000 };
    }
    updateBalance(balance, equity, event) {
        this.stmts['updateBalance'].run(balance, equity, event);
    }
    getBalanceHistory(limit = 50) {
        return this.stmts['getBalanceHistory'].all(limit);
    }
    // ─── Positions ──────────────────────────────────────────
    createPosition(pos) {
        const result = this.stmts['createPosition'].run({
            symbol: pos.symbol,
            side: pos.side,
            entry_price: pos.entryPrice,
            quantity: pos.quantity,
            usdt_amount: pos.usdtAmount,
            current_price: pos.currentPrice,
            high_water_mark: pos.highWaterMark,
            signals_json: pos.signalsJson,
            fingerprint: pos.fingerprint,
            confidence: pos.confidence,
            regime: pos.regime,
        });
        return result.lastInsertRowid;
    }
    getOpenPositions() {
        const rows = this.stmts['getOpenPositions'].all();
        return rows.map(r => this.rowToPosition(r));
    }
    getPositionBySymbol(symbol) {
        const row = this.stmts['getPositionBySymbol'].get(symbol);
        return row ? this.rowToPosition(row) : undefined;
    }
    updatePositionPrice(id, currentPrice, pnlPct, highWaterMark) {
        this.stmts['updatePositionPrice'].run(currentPrice, pnlPct, highWaterMark, id);
    }
    deletePosition(id) {
        this.stmts['deletePosition'].run(id);
    }
    countPositions() {
        return this.stmts['countPositions'].get().count;
    }
    // ─── Trades ─────────────────────────────────────────────
    createTrade(trade) {
        const result = this.stmts['createTrade'].run({
            symbol: trade.symbol,
            side: trade.side,
            entry_price: trade.entryPrice,
            exit_price: trade.exitPrice,
            quantity: trade.quantity,
            usdt_amount: trade.usdtAmount,
            pnl_usdt: trade.pnlUsdt,
            pnl_pct: trade.pnlPct,
            exit_reason: trade.exitReason,
            signals_json: trade.signalsJson,
            fingerprint: trade.fingerprint,
            confidence: trade.confidence,
            regime: trade.regime,
            opened_at: trade.openedAt,
        });
        return result.lastInsertRowid;
    }
    getRecentTrades(limit = 20) {
        const rows = this.stmts['getRecentTrades'].all(limit);
        return rows.map(r => ({
            id: r.id,
            symbol: r.symbol,
            side: r.side,
            entryPrice: r.entry_price,
            exitPrice: r.exit_price,
            quantity: r.quantity,
            usdtAmount: r.usdt_amount,
            pnlUsdt: r.pnl_usdt,
            pnlPct: r.pnl_pct,
            exitReason: r.exit_reason,
            signalsJson: r.signals_json ?? '{}',
            fingerprint: r.fingerprint ?? '',
            confidence: r.confidence,
            regime: r.regime ?? 'unknown',
            openedAt: r.opened_at,
            closedAt: r.closed_at,
        }));
    }
    countTrades() {
        return this.stmts['countTrades'].get().count;
    }
    getWinRate() {
        const row = this.stmts['getWinRate'].get();
        return {
            total: row.total,
            wins: row.wins ?? 0,
            rate: row.total > 0 ? (row.wins ?? 0) / row.total : 0,
        };
    }
    getTotalPnl() {
        return this.stmts['getTotalPnl'].get().total;
    }
    // ─── Price Cache ────────────────────────────────────────
    savePrices(symbol, candles) {
        const insert = this.stmts['savePrice'];
        const tx = this.db.transaction(() => {
            for (const c of candles) {
                insert.run(symbol, c.timestamp, c.open, c.high, c.low, c.close, c.volume);
            }
        });
        tx();
    }
    getPrices(symbol) {
        const rows = this.stmts['getPrices'].all(symbol);
        return rows;
    }
    getRecentPrices(symbol, limit) {
        const rows = this.stmts['getRecentPrices'].all(symbol, limit);
        return rows.reverse();
    }
    pruneOldPrices(beforeTimestamp) {
        this.stmts['pruneOldPrices'].run(beforeTimestamp);
    }
    countPrices(symbol) {
        return this.stmts['countPrices'].get(symbol).count;
    }
    // ─── Reset ──────────────────────────────────────────────
    reset(startingBalance) {
        const tx = this.db.transaction(() => {
            this.stmts['resetAll'].run();
            this.stmts['resetTrades'].run();
            this.stmts['resetBalance'].run();
            this.stmts['resetPrices'].run();
            this.stmts['updateBalance'].run(startingBalance, startingBalance, 'reset');
        });
        tx();
    }
    // ─── Helpers ────────────────────────────────────────────
    rowToPosition(r) {
        return {
            id: r.id,
            symbol: r.symbol,
            side: r.side,
            entryPrice: r.entry_price,
            quantity: r.quantity,
            usdtAmount: r.usdt_amount,
            currentPrice: r.current_price,
            pnlPct: r.pnl_pct,
            highWaterMark: r.high_water_mark,
            signalsJson: r.signals_json ?? '{}',
            fingerprint: r.fingerprint ?? '',
            confidence: r.confidence,
            regime: r.regime ?? 'unknown',
            openedAt: r.opened_at,
        };
    }
}
//# sourceMappingURL=paper.repository.js.map