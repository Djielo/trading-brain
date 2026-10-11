import type Database from 'better-sqlite3';
export interface ChainRecord {
    id: number;
    pair: string;
    type: string;
    length: number;
    fingerprints_json: string;
    total_profit: number;
    created_at: string;
}
export declare class ChainRepository {
    private db;
    private stmts;
    constructor(db: Database.Database);
    create(data: {
        pair: string;
        type: string;
        length: number;
        fingerprints: string[];
        total_profit: number;
    }): number;
    getAll(): ChainRecord[];
    getRecent(limit?: number): ChainRecord[];
    getByPair(pair: string): ChainRecord[];
    getByType(type: string): ChainRecord[];
    count(): number;
    pruneOldest(keepCount: number): void;
}
