import { DashboardServer } from '@timmeck/brain-core';
import { getEventBus } from '../utils/events.js';
export { DashboardServer };
export const TRADING_EVENT_NAMES = [
    'trade:recorded', 'synapse:updated',
    'rule:learned', 'chain:detected',
    'insight:created', 'calibration:updated',
];
export function createTradingDashboardServer(options) {
    return new DashboardServer({
        ...options,
        eventNames: TRADING_EVENT_NAMES,
        getEventBus: () => getEventBus(),
    });
}
//# sourceMappingURL=server.js.map