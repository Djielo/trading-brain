import type Database from 'better-sqlite3';
export interface TradeRecord {
    id: number;
    fingerprint: string;
    pair: string;
    bot_type: string;
    regime: string | null;
    profit_pct: number;
    win: number;
    signals_json: string | null;
    created_at: string;
}
export interface CreateTradeData {
    fingerprint: string;
    pair: string;
    bot_type: string;
    regime?: string;
    profit_pct: number;
    win: boolean;
    signals_json?: string;
}
export declare class TradeRepository {
    private db;
    private stmts;
    constructor(db: Database.Database);
    create(data: CreateTradeData): number;
    getById(id: number): TradeRecord | undefined;
    count(): number;
    getAll(): TradeRecord[];
    getRecent(limit?: number): TradeRecord[];
    getByPair(pair: string): TradeRecord[];
    getByFingerprint(fingerprint: string): TradeRecord[];
    getByBotType(botType: string): TradeRecord[];
    getSince(dateStr: string): TradeRecord[];
    search(query: string, limit?: number): TradeRecord[];
}
