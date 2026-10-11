import type { AnalyticsService } from '../services/analytics.service.js';
import type { InsightService } from '../services/insight.service.js';
import type { RuleRepository } from '../db/repositories/rule.repository.js';
import type { ChainRepository } from '../db/repositories/chain.repository.js';
import type { CalibrationRepository } from '../db/repositories/calibration.repository.js';
import type { SynapseManager } from '../synapses/synapse-manager.js';
import type { TradeRepository } from '../db/repositories/trade.repository.js';
import type { PaperService } from '../paper/paper.service.js';
export interface DashboardServices {
    analytics: AnalyticsService;
    insight: InsightService;
    ruleRepo: RuleRepository;
    chainRepo: ChainRepository;
    calRepo: CalibrationRepository;
    synapseManager: SynapseManager;
    tradeRepo: TradeRepository;
    paper?: PaperService;
}
export declare function renderDashboard(template: string, services: DashboardServices): string;
