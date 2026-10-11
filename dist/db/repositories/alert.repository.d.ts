import type Database from 'better-sqlite3';
export interface AlertRecord {
    id: number;
    name: string;
    condition_type: string;
    condition_json: string;
    active: number;
    webhook_url: string | null;
    last_triggered_at: string | null;
    trigger_count: number;
    cooldown_minutes: number;
    created_at: string;
    updated_at: string;
}
export interface AlertHistoryRecord {
    id: number;
    alert_id: number;
    trade_id: number | null;
    message: string;
    data_json: string | null;
    created_at: string;
}
export interface CreateAlertData {
    name: string;
    condition_type: string;
    condition_json: string;
    webhook_url?: string;
    cooldown_minutes?: number;
}
export interface UpdateAlertData {
    name?: string;
    condition_type?: string;
    condition_json?: string;
    active?: boolean;
    webhook_url?: string | null;
    cooldown_minutes?: number;
}
export declare class AlertRepository {
    private db;
    private stmts;
    constructor(db: Database.Database);
    create(data: CreateAlertData): number;
    getById(id: number): AlertRecord | undefined;
    getAll(): AlertRecord[];
    getActive(): AlertRecord[];
    update(id: number, data: UpdateAlertData): void;
    delete(id: number): void;
    recordTrigger(alertId: number, tradeId: number | null, message: string, data?: unknown): number;
    getHistory(alertId: number, limit?: number): AlertHistoryRecord[];
}
