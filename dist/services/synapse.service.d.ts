import type { SynapseManager } from '../synapses/synapse-manager.js';
import type { WeightedGraph, ActivatedNode } from '../graph/weighted-graph.js';
export declare class SynapseService {
    private synapseManager;
    private graph;
    constructor(synapseManager: SynapseManager, graph: WeightedGraph);
    explore(query: string): ActivatedNode[];
    findPath(fromId: string, toId: string): string[] | null;
    getStats(): {
        totalSynapses: number;
        avgWeight: number;
        graphNodes: number;
        graphEdges: number;
        strongest: Array<{
            id: string;
            weight: number;
            activations: number;
        }>;
    };
}
