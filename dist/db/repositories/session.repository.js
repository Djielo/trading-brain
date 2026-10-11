export class SessionRepository {
    db;
    stmts;
    constructor(db) {
        this.db = db;
        this.stmts = {
            create: this.db.prepare(`
        INSERT INTO sessions (session_id, started_at, ended_at, summary, goals, outcome, metadata)
        VALUES (@session_id, @started_at, @ended_at, @summary, @goals, @outcome, @metadata)
      `),
            getById: this.db.prepare('SELECT * FROM sessions WHERE id = ?'),
            findBySessionId: this.db.prepare('SELECT * FROM sessions WHERE session_id = ?'),
            findRecent: this.db.prepare('SELECT * FROM sessions ORDER BY started_at DESC LIMIT ?'),
            update: this.db.prepare(`
        UPDATE sessions
        SET summary = COALESCE(@summary, summary),
            ended_at = COALESCE(@ended_at, ended_at),
            outcome = COALESCE(@outcome, outcome),
            goals = COALESCE(@goals, goals),
            metadata = COALESCE(@metadata, metadata)
        WHERE id = @id
      `),
            search: this.db.prepare(`
        SELECT s.* FROM sessions s
        JOIN sessions_fts ON s.id = sessions_fts.rowid
        WHERE sessions_fts MATCH ?
        ORDER BY rank
        LIMIT ?
      `),
            countAll: this.db.prepare('SELECT COUNT(*) as count FROM sessions'),
            findLast: this.db.prepare('SELECT * FROM sessions ORDER BY started_at DESC LIMIT 1'),
        };
    }
    create(data) {
        const result = this.stmts.create.run({
            session_id: data.session_id,
            started_at: data.started_at ?? new Date().toISOString(),
            ended_at: data.ended_at ?? null,
            summary: data.summary ?? null,
            goals: data.goals ?? null,
            outcome: data.outcome ?? null,
            metadata: data.metadata ?? null,
        });
        return result.lastInsertRowid;
    }
    getById(id) {
        return this.stmts.getById.get(id);
    }
    findBySessionId(sessionId) {
        return this.stmts.findBySessionId.get(sessionId);
    }
    findByProject(_projectId, limit = 20) {
        // No project_id in trading-brain — return all recent
        return this.stmts.findRecent.all(limit);
    }
    findRecent(limit = 20) {
        return this.stmts.findRecent.all(limit);
    }
    update(id, data) {
        this.stmts.update.run({
            id,
            summary: data.summary ?? null,
            ended_at: data.ended_at ?? null,
            outcome: data.outcome ?? null,
            goals: data.goals ?? null,
            metadata: data.metadata ?? null,
        });
    }
    search(query, limit = 20) {
        return this.stmts.search.all(query, limit);
    }
    countAll() {
        const row = this.stmts.countAll.get();
        return row.count;
    }
    findLast() {
        return this.stmts.findLast.get();
    }
}
//# sourceMappingURL=session.repository.js.map