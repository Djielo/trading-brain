import type { AlertRepository, AlertRecord, AlertHistoryRecord } from '../db/repositories/alert.repository.js';
import type { SignalService } from './signal.service.js';
import type { TradeRecord } from '../db/repositories/trade.repository.js';
export type ConditionType = 'confidence_above' | 'confidence_below' | 'win_streak' | 'loss_streak' | 'drawdown';
export interface CreateAlertInput {
    name: string;
    conditionType: ConditionType;
    conditionJson: Record<string, unknown>;
    webhookUrl?: string;
    cooldownMinutes?: number;
}
export interface AlertCheckContext {
    confidence?: number;
    winStreak?: number;
    lossStreak?: number;
    drawdownPct?: number;
    pair?: string;
}
export declare class AlertService {
    private alertRepo;
    private signalService;
    private logger;
    constructor(alertRepo: AlertRepository, signalService: SignalService);
    createAlert(input: CreateAlertInput): number;
    getAlerts(): AlertRecord[];
    getAllAlerts(): AlertRecord[];
    deleteAlert(id: number): void;
    checkAlerts(trade: TradeRecord, context: AlertCheckContext): AlertRecord[];
    getAlertHistory(alertId: number, limit?: number): AlertHistoryRecord[];
    private evaluateCondition;
    private buildMessage;
    private fireWebhook;
}
