import type Database from 'better-sqlite3';
export interface SynapseRecord {
    id: string;
    fingerprint: string;
    weight: number;
    wins: number;
    losses: number;
    activations: number;
    total_profit: number;
    last_activated: string;
    created_at: string;
}
export declare class SynapseRepository {
    private db;
    private stmts;
    constructor(db: Database.Database);
    upsert(synapse: Omit<SynapseRecord, 'created_at'>): void;
    getById(id: string): SynapseRecord | undefined;
    getAll(): SynapseRecord[];
    count(): number;
    updateWeight(id: string, weight: number): void;
    delete(id: string): void;
    getByMinWeight(minWeight: number): SynapseRecord[];
    getStrongest(limit?: number): SynapseRecord[];
}
