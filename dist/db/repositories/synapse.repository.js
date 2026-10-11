export class SynapseRepository {
    db;
    stmts;
    constructor(db) {
        this.db = db;
        this.stmts = {
            upsert: db.prepare(`
        INSERT INTO synapses (id, fingerprint, weight, wins, losses, activations, total_profit, last_activated)
        VALUES (@id, @fingerprint, @weight, @wins, @losses, @activations, @total_profit, @last_activated)
        ON CONFLICT(id) DO UPDATE SET
          weight = @weight, wins = @wins, losses = @losses,
          activations = @activations, total_profit = @total_profit,
          last_activated = @last_activated
      `),
            getById: db.prepare('SELECT * FROM synapses WHERE id = ?'),
            getAll: db.prepare('SELECT * FROM synapses ORDER BY weight DESC'),
            count: db.prepare('SELECT COUNT(*) as count FROM synapses'),
            updateWeight: db.prepare(`UPDATE synapses SET weight = ?, last_activated = datetime('now') WHERE id = ?`),
            deleteById: db.prepare('DELETE FROM synapses WHERE id = ?'),
            getByMinWeight: db.prepare('SELECT * FROM synapses WHERE weight >= ? ORDER BY weight DESC'),
            getStrongest: db.prepare('SELECT * FROM synapses ORDER BY weight DESC LIMIT ?'),
        };
    }
    upsert(synapse) {
        this.stmts['upsert'].run(synapse);
    }
    getById(id) {
        return this.stmts['getById'].get(id);
    }
    getAll() {
        return this.stmts['getAll'].all();
    }
    count() {
        const row = this.stmts['count'].get();
        return row.count;
    }
    updateWeight(id, weight) {
        this.stmts['updateWeight'].run(weight, id);
    }
    delete(id) {
        this.stmts['deleteById'].run(id);
    }
    getByMinWeight(minWeight) {
        return this.stmts['getByMinWeight'].all(minWeight);
    }
    getStrongest(limit = 20) {
        return this.stmts['getStrongest'].all(limit);
    }
}
//# sourceMappingURL=synapse.repository.js.map