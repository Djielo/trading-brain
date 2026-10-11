import { BaseApiServer } from '@timmeck/brain-core';
import { getEventBus } from '../utils/events.js';
export class ApiServer extends BaseApiServer {
    statsTimer = null;
    start() {
        super.start();
        this.setupSSE();
    }
    stop() {
        if (this.statsTimer) {
            clearInterval(this.statsTimer);
            this.statsTimer = null;
        }
        super.stop();
    }
    setupSSE() {
        const bus = getEventBus();
        const eventNames = [
            'trade:recorded', 'synapse:updated', 'rule:learned',
            'chain:detected', 'insight:created', 'calibration:updated',
        ];
        for (const eventName of eventNames) {
            bus.on(eventName, (data) => {
                this.broadcastSSE({ type: 'event', event: eventName, data });
            });
        }
        this.statsTimer = setInterval(() => {
            if (this.sseClients.size > 0) {
                try {
                    const summary = this.options.router.handle('analytics.summary', {});
                    this.broadcastSSE({ type: 'stats_update', stats: summary });
                }
                catch { /* ignore */ }
            }
        }, 30_000);
    }
}
//# sourceMappingURL=server.js.map