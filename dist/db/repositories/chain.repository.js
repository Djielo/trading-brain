export class ChainRepository {
    db;
    stmts;
    constructor(db) {
        this.db = db;
        this.stmts = {
            create: db.prepare(`
        INSERT INTO chains (pair, type, length, fingerprints_json, total_profit)
        VALUES (@pair, @type, @length, @fingerprints_json, @total_profit)
      `),
            getAll: db.prepare('SELECT * FROM chains ORDER BY created_at DESC'),
            getRecent: db.prepare('SELECT * FROM chains ORDER BY created_at DESC LIMIT ?'),
            getByPair: db.prepare('SELECT * FROM chains WHERE pair = ? ORDER BY created_at DESC'),
            getByType: db.prepare('SELECT * FROM chains WHERE type = ? ORDER BY created_at DESC'),
            count: db.prepare('SELECT COUNT(*) as count FROM chains'),
            deleteOldest: db.prepare('DELETE FROM chains WHERE id IN (SELECT id FROM chains ORDER BY created_at ASC LIMIT ?)'),
        };
    }
    create(data) {
        const result = this.stmts['create'].run({
            pair: data.pair,
            type: data.type,
            length: data.length,
            fingerprints_json: JSON.stringify(data.fingerprints),
            total_profit: data.total_profit,
        });
        return result.lastInsertRowid;
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
    getByType(type) {
        return this.stmts['getByType'].all(type);
    }
    count() {
        const row = this.stmts['count'].get();
        return row.count;
    }
    pruneOldest(keepCount) {
        const total = this.count();
        if (total > keepCount) {
            this.stmts['deleteOldest'].run(total - keepCount);
        }
    }
}
//# sourceMappingURL=chain.repository.js.map