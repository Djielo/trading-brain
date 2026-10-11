import type Database from 'better-sqlite3';
export interface GraphNodeRecord {
    id: string;
    type: string;
    label: string;
    activation: number;
    total_activations: number;
}
export interface GraphEdgeRecord {
    id: string;
    source: string;
    target: string;
    weight: number;
    activations: number;
    last_activated: string;
}
export declare class GraphRepository {
    private db;
    private stmts;
    constructor(db: Database.Database);
    upsertNode(node: GraphNodeRecord): void;
    upsertEdge(edge: GraphEdgeRecord): void;
    getAllNodes(): GraphNodeRecord[];
    getAllEdges(): GraphEdgeRecord[];
    getNode(id: string): GraphNodeRecord | undefined;
    getEdge(id: string): GraphEdgeRecord | undefined;
    getEdgesFrom(nodeId: string): GraphEdgeRecord[];
    getEdgesFor(nodeId: string): GraphEdgeRecord[];
    nodeCount(): number;
    edgeCount(): number;
    updateEdgeWeight(id: string, weight: number): void;
    clearAll(): void;
}
