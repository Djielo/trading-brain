import type Database from 'better-sqlite3';
export interface SignalComboRecord {
    id: number;
    fingerprint: string;
    signals_json: string;
    regime: string | null;
    created_at: string;
}
export declare class SignalRepository {
    private db;
    private stmts;
    constructor(db: Database.Database);
    create(fingerprint: string, signalsJson: string, regime?: string): number;
    getByFingerprint(fingerprint: string): SignalComboRecord[];
    getAll(): SignalComboRecord[];
    count(): number;
}
