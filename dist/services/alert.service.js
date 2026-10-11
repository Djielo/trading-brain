import { getLogger } from '../utils/logger.js';
import { getEventBus } from '../utils/events.js';
export class AlertService {
    alertRepo;
    signalService;
    logger = getLogger();
    constructor(alertRepo, signalService) {
        this.alertRepo = alertRepo;
        this.signalService = signalService;
    }
    createAlert(input) {
        const id = this.alertRepo.create({
            name: input.name,
            condition_type: input.conditionType,
            condition_json: JSON.stringify(input.conditionJson),
            webhook_url: input.webhookUrl,
            cooldown_minutes: input.cooldownMinutes,
        });
        this.logger.info(`Alert created: "${input.name}" (${input.conditionType}) id=${id}`);
        return id;
    }
    getAlerts() {
        return this.alertRepo.getActive();
    }
    getAllAlerts() {
        return this.alertRepo.getAll();
    }
    deleteAlert(id) {
        this.alertRepo.delete(id);
        this.logger.info(`Alert deleted: id=${id}`);
    }
    checkAlerts(trade, context) {
        const bus = getEventBus();
        const activeAlerts = this.alertRepo.getActive();
        const triggered = [];
        for (const alert of activeAlerts) {
            // Cooldown check
            if (alert.cooldown_minutes > 0 && alert.last_triggered_at) {
                const lastTriggered = new Date(alert.last_triggered_at).getTime();
                const cooldownMs = alert.cooldown_minutes * 60 * 1000;
                if (Date.now() - lastTriggered < cooldownMs) {
                    continue;
                }
            }
            const condition = JSON.parse(alert.condition_json);
            const matched = this.evaluateCondition(alert.condition_type, condition, trade, context);
            if (matched) {
                const message = this.buildMessage(alert, trade, context);
                const data = { trade, context, condition };
                this.alertRepo.recordTrigger(alert.id, trade.id, message, data);
                triggered.push(alert);
                bus.emit('alert:triggered', {
                    alertId: alert.id,
                    name: alert.name,
                    conditionType: alert.condition_type,
                });
                this.logger.info(`Alert triggered: "${alert.name}" (${alert.condition_type}) on trade #${trade.id}`);
                // Fire-and-forget webhook
                if (alert.webhook_url) {
                    this.fireWebhook(alert.webhook_url, { alert: alert.name, message, data });
                }
            }
        }
        return triggered;
    }
    getAlertHistory(alertId, limit = 50) {
        return this.alertRepo.getHistory(alertId, limit);
    }
    evaluateCondition(type, condition, trade, context) {
        switch (type) {
            case 'confidence_above': {
                const threshold = condition['threshold'];
                if (threshold === undefined || context.confidence === undefined)
                    return false;
                return context.confidence > threshold;
            }
            case 'confidence_below': {
                const threshold = condition['threshold'];
                if (threshold === undefined || context.confidence === undefined)
                    return false;
                return context.confidence < threshold;
            }
            case 'win_streak': {
                const minStreak = condition['minStreak'];
                const pair = condition['pair'];
                if (minStreak === undefined || context.winStreak === undefined)
                    return false;
                if (pair && trade.pair !== pair)
                    return false;
                return context.winStreak >= minStreak;
            }
            case 'loss_streak': {
                const minStreak = condition['minStreak'];
                const pair = condition['pair'];
                if (minStreak === undefined || context.lossStreak === undefined)
                    return false;
                if (pair && trade.pair !== pair)
                    return false;
                return context.lossStreak >= minStreak;
            }
            case 'drawdown': {
                const threshold = condition['threshold'];
                if (threshold === undefined || context.drawdownPct === undefined)
                    return false;
                return context.drawdownPct > threshold;
            }
            default:
                this.logger.info(`Unknown condition type: ${type}`);
                return false;
        }
    }
    buildMessage(alert, trade, context) {
        const parts = [`Alert "${alert.name}" triggered`];
        parts.push(`condition: ${alert.condition_type}`);
        parts.push(`pair: ${trade.pair}`);
        parts.push(`profit: ${trade.profit_pct.toFixed(2)}%`);
        if (context.confidence !== undefined)
            parts.push(`confidence: ${context.confidence.toFixed(3)}`);
        if (context.winStreak !== undefined)
            parts.push(`win streak: ${context.winStreak}`);
        if (context.lossStreak !== undefined)
            parts.push(`loss streak: ${context.lossStreak}`);
        if (context.drawdownPct !== undefined)
            parts.push(`drawdown: ${context.drawdownPct.toFixed(2)}%`);
        return parts.join(' | ');
    }
    fireWebhook(url, payload) {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }).catch((err) => {
            this.logger.info(`Webhook failed for ${url}: ${err instanceof Error ? err.message : String(err)}`);
        });
    }
}
//# sourceMappingURL=alert.service.js.map