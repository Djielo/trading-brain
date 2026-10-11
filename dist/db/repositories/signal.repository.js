export class SignalRepository {
    db;
    stmts;
    constructor(db) {
        this.db = db;
        this.stmts = {
            create: db.prepare(`
        INSERT INTO signal_combos (fingerprint, signals_json, regime)
        VALUES (@fingerprint, @signals_json, @regime)
      `),
            getByFingerprint: db.prepare('SELECT * FROM signal_combos WHERE fingerprint = ? ORDER BY created_at DESC'),
            getAll: db.prepare('SELECT * FROM signal_combos ORDER BY created_at DESC'),
            count: db.prepare('SELECT COUNT(*) as count FROM signal_combos'),
        };
    }
    create(fingerprint, signalsJson, regime) {
        const result = this.stmts['create'].run({
            fingerprint,
            signals_json: signalsJson,
            regime: regime ?? null,
        });
        return result.lastInsertRowid;
    }
    getByFingerprint(fingerprint) {
        return this.stmts['getByFingerprint'].all(fingerprint);
    }
    getAll() {
        return this.stmts['getAll'].all();
    }
    count() {
        const row = this.stmts['count'].get();
        return row.count;
    }
}
//# sourceMappingURL=signal.repository.js.map