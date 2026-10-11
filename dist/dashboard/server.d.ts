import { DashboardServer } from '@timmeck/brain-core';
export { DashboardServer };
export type { DashboardServerOptions } from '@timmeck/brain-core';
export declare const TRADING_EVENT_NAMES: readonly ["trade:recorded", "synapse:updated", "rule:learned", "chain:detected", "insight:created", "calibration:updated"];
export declare function createTradingDashboardServer(options: {
    port: number;
    getDashboardHtml: () => string;
    getStats: () => unknown;
}): DashboardServer;
