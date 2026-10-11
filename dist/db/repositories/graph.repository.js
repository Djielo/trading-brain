export class GraphRepository {
    db;
    stmts;
    constructor(db) {
        this.db = db;
        this.stmts = {
            upsertNode: db.prepare(`
        INSERT INTO graph_nodes (id, type, label, activation, total_activations)
        VALUES (@id, @type, @label, @activation, @total_activations)
        ON CONFLICT(id) DO UPDATE SET
          activation = @activation, total_activations = @total_activations
      `),
            upsertEdge: db.prepare(`
        INSERT INTO graph_edges (id, source, target, weight, activations, last_activated)
        VALUES (@id, @source, @target, @weight, @activations, @last_activated)
        ON CONFLICT(id) DO UPDATE SET
          weight = @weight, activations = @activations, last_activated = @last_activated
      `),
            getAllNodes: db.prepare('SELECT * FROM graph_nodes'),
            getAllEdges: db.prepare('SELECT * FROM graph_edges'),
            getNode: db.prepare('SELECT * FROM graph_nodes WHERE id = ?'),
            getEdge: db.prepare('SELECT * FROM graph_edges WHERE id = ?'),
            getEdgesFrom: db.prepare('SELECT * FROM graph_edges WHERE source = ?'),
            getEdgesTo: db.prepare('SELECT * FROM graph_edges WHERE target = ?'),
            getEdgesFor: db.prepare('SELECT * FROM graph_edges WHERE source = ? OR target = ?'),
            nodeCount: db.prepare('SELECT COUNT(*) as count FROM graph_nodes'),
            edgeCount: db.prepare('SELECT COUNT(*) as count FROM graph_edges'),
            updateEdgeWeight: db.prepare(`UPDATE graph_edges SET weight = ?, activations = activations + 1, last_activated = datetime('now') WHERE id = ?`),
            deleteAllNodes: db.prepare('DELETE FROM graph_nodes'),
            deleteAllEdges: db.prepare('DELETE FROM graph_edges'),
        };
    }
    upsertNode(node) {
        this.stmts['upsertNode'].run(node);
    }
    upsertEdge(edge) {
        this.stmts['upsertEdge'].run(edge);
    }
    getAllNodes() {
        return this.stmts['getAllNodes'].all();
    }
    getAllEdges() {
        return this.stmts['getAllEdges'].all();
    }
    getNode(id) {
        return this.stmts['getNode'].get(id);
    }
    getEdge(id) {
        return this.stmts['getEdge'].get(id);
    }
    getEdgesFrom(nodeId) {
        return this.stmts['getEdgesFrom'].all(nodeId);
    }
    getEdgesFor(nodeId) {
        return this.stmts['getEdgesFor'].all(nodeId, nodeId);
    }
    nodeCount() {
        const row = this.stmts['nodeCount'].get();
        return row.count;
    }
    edgeCount() {
        const row = this.stmts['edgeCount'].get();
        return row.count;
    }
    updateEdgeWeight(id, weight) {
        this.stmts['updateEdgeWeight'].run(weight, id);
    }
    clearAll() {
        this.stmts['deleteAllEdges'].run();
        this.stmts['deleteAllNodes'].run();
    }
}
//# sourceMappingURL=graph.repository.js.map