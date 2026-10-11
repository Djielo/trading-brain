export class SynapseService {
    synapseManager;
    graph;
    constructor(synapseManager, graph) {
        this.synapseManager = synapseManager;
        this.graph = graph;
    }
    explore(query) {
        // Find matching node (exact or fuzzy)
        let startNode = null;
        for (const node of Object.values(this.graph.nodes)) {
            if (node.id === query || node.label === query) {
                startNode = node.id;
                break;
            }
        }
        if (!startNode) {
            const queryLower = query.toLowerCase();
            for (const node of Object.values(this.graph.nodes)) {
                if (node.label.toLowerCase().includes(queryLower) || node.id.toLowerCase().includes(queryLower)) {
                    startNode = node.id;
                    break;
                }
            }
        }
        if (!startNode)
            return [];
        return this.graph.spreadingActivation(startNode, 1.0, 0.6, 0.05, 4);
    }
    findPath(fromId, toId) {
        return this.graph.findPath(fromId, toId);
    }
    getStats() {
        const strongest = this.synapseManager.getStrongest(5).map(s => ({
            id: s.id,
            weight: s.weight,
            activations: s.activations,
        }));
        return {
            totalSynapses: this.synapseManager.count(),
            avgWeight: this.synapseManager.getAvgWeight(),
            graphNodes: this.graph.getNodeCount(),
            graphEdges: this.graph.getEdgeCount(),
            strongest,
        };
    }
}
//# sourceMappingURL=synapse.service.js.map