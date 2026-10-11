import type Database from 'better-sqlite3';
export interface InsightRecord {
    id: number;
    type: string;
    severity: string;
    title: string;
    description: string;
    data_json: string | null;
    created_at: string;
}
export declare class InsightRepository {
    private db;
    private stmts;
    constructor(db: Database.Database);
    create(data: {
        type: string;
        severity: string;
        title: string;
        description: string;
        data?: unknown;
    }): number;
    getAll(): InsightRecord[];
    getRecent(limit?: number): InsightRecord[];
    getByType(type: string): InsightRecord[];
    getBySeverity(severity: string): InsightRecord[];
    count(): number;
    search(query: string, limit?: number): InsightRecord[];
    pruneOldest(keepCount: number): void;
    deleteAll(): void;
}
