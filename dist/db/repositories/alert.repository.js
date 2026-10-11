export class AlertRepository {
    db;
    stmts;
    constructor(db) {
        this.db = db;
        this.stmts = {
            create: db.prepare(`
        INSERT INTO alerts (name, condition_type, condition_json, webhook_url, cooldown_minutes)
        VALUES (@name, @condition_type, @condition_json, @webhook_url, @cooldown_minutes)
      `),
            getById: db.prepare('SELECT * FROM alerts WHERE id = ?'),
            getAll: db.prepare('SELECT * FROM alerts ORDER BY created_at DESC'),
            getActive: db.prepare('SELECT * FROM alerts WHERE active = 1 ORDER BY created_at DESC'),
            update: db.prepare(`
        UPDATE alerts
        SET name = COALESCE(@name, name),
            condition_type = COALESCE(@condition_type, condition_type),
            condition_json = COALESCE(@condition_json, condition_json),
            active = COALESCE(@active, active),
            webhook_url = COALESCE(@webhook_url, webhook_url),
            cooldown_minutes = COALESCE(@cooldown_minutes, cooldown_minutes),
            updated_at = datetime('now')
        WHERE id = @id
      `),
            delete: db.prepare('DELETE FROM alerts WHERE id = ?'),
            recordTrigger: db.prepare(`
        INSERT INTO alert_history (alert_id, trade_id, message, data_json)
        VALUES (@alert_id, @trade_id, @message, @data_json)
      `),
            updateTriggerMeta: db.prepare(`
        UPDATE alerts
        SET last_triggered_at = datetime('now'),
            trigger_count = trigger_count + 1,
            updated_at = datetime('now')
        WHERE id = ?
      `),
            getHistory: db.prepare('SELECT * FROM alert_history WHERE alert_id = ? ORDER BY created_at DESC LIMIT ?'),
        };
    }
    create(data) {
        const result = this.stmts['create'].run({
            name: data.name,
            condition_type: data.condition_type,
            condition_json: data.condition_json,
            webhook_url: data.webhook_url ?? null,
            cooldown_minutes: data.cooldown_minutes ?? 0,
        });
        return result.lastInsertRowid;
    }
    getById(id) {
        return this.stmts['getById'].get(id);
    }
    getAll() {
        return this.stmts['getAll'].all();
    }
    getActive() {
        return this.stmts['getActive'].all();
    }
    update(id, data) {
        this.stmts['update'].run({
            id,
            name: data.name ?? null,
            condition_type: data.condition_type ?? null,
            condition_json: data.condition_json ?? null,
            active: data.active !== undefined ? (data.active ? 1 : 0) : null,
            webhook_url: data.webhook_url !== undefined ? data.webhook_url : null,
            cooldown_minutes: data.cooldown_minutes ?? null,
        });
    }
    delete(id) {
        this.stmts['delete'].run(id);
    }
    recordTrigger(alertId, tradeId, message, data) {
        const result = this.stmts['recordTrigger'].run({
            alert_id: alertId,
            trade_id: tradeId,
            message,
            data_json: data ? JSON.stringify(data) : null,
        });
        this.stmts['updateTriggerMeta'].run(alertId);
        return result.lastInsertRowid;
    }
    getHistory(alertId, limit = 50) {
        return this.stmts['getHistory'].all(alertId, limit);
    }
}
//# sourceMappingURL=alert.repository.js.map