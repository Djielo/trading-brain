import type Database from 'better-sqlite3';
export interface RuleRecord {
    id: number;
    pattern: string;
    confidence: number;
    sample_count: number;
    win_rate: number;
    avg_profit: number;
    created_at: string;
    updated_at: string;
}
export declare class RuleRepository {
    private db;
    private stmts;
    constructor(db: Database.Database);
    create(data: {
        pattern: string;
        confidence: number;
        sample_count: number;
        win_rate: number;
        avg_profit: number;
    }): number;
    getAll(): RuleRecord[];
    getById(id: number): RuleRecord | undefined;
    count(): number;
    deleteAll(): void;
    delete(id: number): void;
    replaceAll(rules: {
        pattern: string;
        confidence: number;
        sample_count: number;
        win_rate: number;
        avg_profit: number;
    }[]): void;
}
