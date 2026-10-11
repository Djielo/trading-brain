export class InsightRepository {
    db;
    stmts;
    constructor(db) {
        this.db = db;
        this.stmts = {
            create: db.prepare(`
        INSERT INTO insights (type, severity, title, description, data_json)
        VALUES (@type, @severity, @title, @description, @data_json)
      `),
            getAll: db.prepare('SELECT * FROM insights ORDER BY created_at DESC'),
            getRecent: db.prepare('SELECT * FROM insights ORDER BY created_at DESC LIMIT ?'),
            getByType: db.prepare('SELECT * FROM insights WHERE type = ? ORDER BY created_at DESC'),
            getBySeverity: db.prepare('SELECT * FROM insights WHERE severity = ? ORDER BY created_at DESC'),
            count: db.prepare('SELECT COUNT(*) as count FROM insights'),
            search: db.prepare('SELECT insights.* FROM insights_fts JOIN insights ON insights_fts.rowid = insights.id WHERE insights_fts MATCH ? LIMIT ?'),
            deleteOldest: db.prepare('DELETE FROM insights WHERE id IN (SELECT id FROM insights ORDER BY created_at ASC LIMIT ?)'),
            deleteAll: db.prepare('DELETE FROM insights'),
        };
    }
    create(data) {
        const result = this.stmts['create'].run({
            type: data.type,
            severity: data.severity,
            title: data.title,
            description: data.description,
            data_json: data.data ? JSON.stringify(data.data) : null,
        });
        return result.lastInsertRowid;
    }
    getAll() {
        return this.stmts['getAll'].all();
    }
    getRecent(limit = 10) {
        return this.stmts['getRecent'].all(limit);
    }
    getByType(type) {
        return this.stmts['getByType'].all(type);
    }
    getBySeverity(severity) {
        return this.stmts['getBySeverity'].all(severity);
    }
    count() {
        const row = this.stmts['count'].get();
        return row.count;
    }
    search(query, limit = 20) {
        return this.stmts['search'].all(query, limit);
    }
    pruneOldest(keepCount) {
        const total = this.count();
        if (total > keepCount) {
            this.stmts['deleteOldest'].run(total - keepCount);
        }
    }
    deleteAll() {
        this.stmts['deleteAll'].run();
    }
}
//# sourceMappingURL=insight.repository.js.map