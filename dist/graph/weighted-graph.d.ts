export declare const NODE_TYPES: {
    readonly SIGNAL: "signal";
    readonly REGIME: "regime";
    readonly OUTCOME: "outcome";
    readonly PAIR: "pair";
    readonly BOT_TYPE: "bot_type";
    readonly TIME: "time";
    readonly COMBO: "combo";
};
export type NodeType = typeof NODE_TYPES[keyof typeof NODE_TYPES];
export interface GraphNode {
    id: string;
    type: string;
    label: string;
    activation: number;
    totalActivations: number;
}
export interface GraphEdge {
    source: string;
    target: string;
    weight: number;
    activations: number;
    lastActivated: number;
}
export interface ActivatedNode {
    id: string;
    type: string;
    label: string;
    activation: number;
}
export declare class WeightedGraph {
    nodes: Record<string, GraphNode>;
    edges: Record<string, GraphEdge>;
    addNode(id: string, type: string, label: string): GraphNode;
    addEdge(sourceId: string, targetId: string, weight?: number): GraphEdge;
    strengthenEdge(sourceId: string, targetId: string, amount?: number): void;
    weakenEdge(sourceId: string, targetId: string, factor?: number): void;
    /**
     * Spreading Activation — BFS energy propagation through the graph.
     * Returns activated nodes sorted by activation level descending.
     */
    spreadingActivation(startNodeId: string, initialEnergy?: number, decayFactor?: number, threshold?: number, maxDepth?: number): ActivatedNode[];
    getEdgesFor(nodeId: string): GraphEdge[];
    /** Apply temporal decay to all edges */
    decayEdges(halfLifeMs: number): void;
    /** Find shortest path between two nodes using BFS */
    findPath(fromId: string, toId: string, maxDepth?: number): string[] | null;
    serialize(): {
        nodes: GraphNode[];
        edges: GraphEdge[];
    };
    deserialize(data: {
        nodes: GraphNode[];
        edges: GraphEdge[];
    }): void;
    getNodeCount(): number;
    getEdgeCount(): number;
}
