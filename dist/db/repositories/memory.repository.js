export class MemoryRepository {
    db;
    stmts;
    constructor(db) {
        this.db = db;
        this.stmts = {
            create: this.db.prepare(`
        INSERT INTO memories (session_id, category, key, content, importance, source, tags, expires_at, superseded_by, active)
        VALUES (@session_id, @category, @key, @content, @importance, @source, @tags, @expires_at, @superseded_by, @active)
      `),
            getById: this.db.prepare('SELECT * FROM memories WHERE id = ?'),
            findByKey: this.db.prepare('SELECT * FROM memories WHERE key = ? AND active = 1'),
            findByCategoryAll: this.db.prepare('SELECT * FROM memories WHERE category = ? AND active = 1 ORDER BY importance DESC LIMIT ?'),
            findActiveAll: this.db.prepare('SELECT * FROM memories WHERE active = 1 ORDER BY updated_at DESC LIMIT ?'),
            search: this.db.prepare(`
        SELECT m.* FROM memories m
        JOIN memories_fts ON m.id = memories_fts.rowid
        WHERE memories_fts MATCH ? AND m.active = 1
        ORDER BY rank
        LIMIT ?
      `),
            supersede: this.db.prepare("UPDATE memories SET superseded_by = ?, active = 0, updated_at = datetime('now') WHERE id = ?"),
            deactivate: this.db.prepare("UPDATE memories SET active = 0, updated_at = datetime('now') WHERE id = ?"),
            expireOld: this.db.prepare("UPDATE memories SET active = 0 WHERE expires_at IS NOT NULL AND expires_at < datetime('now') AND active = 1"),
            update: this.db.prepare(`
        UPDATE memories
        SET content = COALESCE(@content, content),
            importance = COALESCE(@importance, importance),
            tags = COALESCE(@tags, tags),
            expires_at = COALESCE(@expires_at, expires_at),
            updated_at = datetime('now')
        WHERE id = @id
      `),
            findBySession: this.db.prepare('SELECT * FROM memories WHERE session_id = ? AND active = 1 ORDER BY created_at'),
            countActive: this.db.prepare('SELECT COUNT(*) as count FROM memories WHERE active = 1'),
            countByCategory: this.db.prepare('SELECT category, COUNT(*) as count FROM memories WHERE active = 1 GROUP BY category'),
        };
    }
    create(data) {
        const result = this.stmts.create.run({
            session_id: data.session_id ?? null,
            category: data.category,
            key: data.key ?? null,
            content: data.content,
            importance: data.importance ?? 5,
            source: data.source ?? 'explicit',
            tags: data.tags ?? null,
            expires_at: data.expires_at ?? null,
            superseded_by: data.superseded_by ?? null,
            active: data.active ?? 1,
        });
        return result.lastInsertRowid;
    }
    getById(id) {
        return this.stmts.getById.get(id);
    }
    findByKey(_projectId, key) {
        return this.stmts.findByKey.get(key);
    }
    findByCategory(category, _projectId, limit = 50) {
        return this.stmts.findByCategoryAll.all(category, limit);
    }
    findActive(_projectId, limit = 50) {
        return this.stmts.findActiveAll.all(limit);
    }
    search(query, limit = 20) {
        return this.stmts.search.all(query, limit);
    }
    supersede(oldId, newId) {
        this.stmts.supersede.run(newId, oldId);
    }
    deactivate(id) {
        this.stmts.deactivate.run(id);
    }
    expireOld() {
        const result = this.stmts.expireOld.run();
        return result.changes;
    }
    update(id, data) {
        this.stmts.update.run({
            id,
            content: data.content ?? null,
            importance: data.importance ?? null,
            tags: data.tags ?? null,
            expires_at: data.expires_at ?? null,
        });
    }
    findBySession(sessionId) {
        return this.stmts.findBySession.all(sessionId);
    }
    upsertByKey(key, content, category, importance = 5, source = 'explicit', tags) {
        const existing = this.findByKey(null, key);
        const newId = this.create({
            session_id: null,
            category,
            key,
            content,
            importance,
            source: source,
            tags: tags ? JSON.stringify(tags) : null,
            expires_at: null,
            superseded_by: null,
            active: 1,
        });
        if (existing) {
            this.supersede(existing.id, newId);
            return { memoryId: newId, superseded: existing.id };
        }
        return { memoryId: newId };
    }
    countActive() {
        const row = this.stmts.countActive.get();
        return row.count;
    }
    countByCategory() {
        const rows = this.stmts.countByCategory.all();
        const result = {};
        for (const row of rows) {
            result[row.category] = row.count;
        }
        return result;
    }
}
//# sourceMappingURL=memory.repository.js.map