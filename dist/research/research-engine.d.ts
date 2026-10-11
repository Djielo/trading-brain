import type { TradeRepository } from '../db/repositories/trade.repository.js';
import type { InsightRepository } from '../db/repositories/insight.repository.js';
import type { ResearchConfig } from '../types/config.types.js';
import { BaseResearchEngine } from '@timmeck/brain-core';
export declare class ResearchEngine extends BaseResearchEngine {
    private config;
    private tradeRepo;
    private insightRepo;
    constructor(config: ResearchConfig, tradeRepo: TradeRepository, insightRepo: InsightRepository);
    runCycle(): void;
    private detectTrends;
    private detectGaps;
    private detectSynergies;
    private detectPerformance;
    private detectRegimeShifts;
    /** Manual trigger */
    runManual(): number;
}
