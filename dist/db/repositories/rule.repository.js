export class RuleRepository {
    db;
    stmts;
    constructor(db) {
        this.db = db;
        this.stmts = {
            create: db.prepare(`
        INSERT INTO rules (pattern, confidence, sample_count, win_rate, avg_profit)
        VALUES (@pattern, @confidence, @sample_count, @win_rate, @avg_profit)
      `),
            getAll: db.prepare('SELECT * FROM rules ORDER BY confidence DESC'),
            getById: db.prepare('SELECT * FROM rules WHERE id = ?'),
            count: db.prepare('SELECT COUNT(*) as count FROM rules'),
            deleteAll: db.prepare('DELETE FROM rules'),
            deleteById: db.prepare('DELETE FROM rules WHERE id = ?'),
        };
    }
    create(data) {
        const result = this.stmts['create'].run(data);
        return result.lastInsertRowid;
    }
    getAll() {
        return this.stmts['getAll'].all();
    }
    getById(id) {
        return this.stmts['getById'].get(id);
    }
    count() {
        const row = this.stmts['count'].get();
        return row.count;
    }
    deleteAll() {
        this.stmts['deleteAll'].run();
    }
    delete(id) {
        this.stmts['deleteById'].run(id);
    }
    replaceAll(rules) {
        const tx = this.db.transaction(() => {
            this.stmts['deleteAll'].run();
            for (const rule of rules) {
                this.stmts['create'].run(rule);
            }
        });
        tx();
    }
}
//# sourceMappingURL=rule.repository.js.map