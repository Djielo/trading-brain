export class TradeRepository {
    db;
    stmts;
    constructor(db) {
        this.db = db;
        this.stmts = {
            create: db.prepare(`
        INSERT INTO trades (fingerprint, pair, bot_type, regime, profit_pct, win, signals_json)
        VALUES (@fingerprint, @pair, @bot_type, @regime, @profit_pct, @win, @signals_json)
      `),
            getById: db.prepare('SELECT * FROM trades WHERE id = ?'),
            count: db.prepare('SELECT COUNT(*) as count FROM trades'),
            getAll: db.prepare('SELECT * FROM trades ORDER BY created_at DESC'),
            getRecent: db.prepare('SELECT * FROM trades ORDER BY created_at DESC LIMIT ?'),
            getByPair: db.prepare('SELECT * FROM trades WHERE pair = ? ORDER BY created_at DESC'),
            getByFingerprint: db.prepare('SELECT * FROM trades WHERE fingerprint = ? ORDER BY created_at DESC'),
            getByBotType: db.prepare('SELECT * FROM trades WHERE bot_type = ? ORDER BY created_at DESC'),
            getSince: db.prepare('SELECT * FROM trades WHERE created_at > ? ORDER BY created_at DESC'),
            search: db.prepare(`SELECT * FROM trades WHERE fingerprint LIKE ? OR pair LIKE ? OR bot_type LIKE ? ORDER BY created_at DESC LIMIT ?`),
        };
    }
    create(data) {
        const result = this.stmts['create'].run({
            fingerprint: data.fingerprint,
            pair: data.pair,
            bot_type: data.bot_type,
            regime: data.regime ?? null,
            profit_pct: data.profit_pct,
            win: data.win ? 1 : 0,
            signals_json: data.signals_json ?? null,
        });
        return result.lastInsertRowid;
    }
    getById(id) {
        return this.stmts['getById'].get(id);
    }
    count() {
        const row = this.stmts['count'].get();
        return row.count;
    }
    getAll() {
        return this.stmts['getAll'].all();
    }
    getRecent(limit = 10) {
        return this.stmts['getRecent'].all(limit);
    }
    getByPair(pair) {
        return this.stmts['getByPair'].all(pair);
    }
    getByFingerprint(fingerprint) {
        return this.stmts['getByFingerprint'].all(fingerprint);
    }
    getByBotType(botType) {
        return this.stmts['getByBotType'].all(botType);
    }
    getSince(dateStr) {
        return this.stmts['getSince'].all(dateStr);
    }
    search(query, limit = 50) {
        const like = `%${query}%`;
        return this.stmts['search'].all(like, like, like, limit);
    }
}
//# sourceMappingURL=trade.repository.js.map