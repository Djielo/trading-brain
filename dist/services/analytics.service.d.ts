import type { TradeRepository } from '../db/repositories/trade.repository.js';
import type { RuleRepository } from '../db/repositories/rule.repository.js';
import type { ChainRepository } from '../db/repositories/chain.repository.js';
import type { InsightRepository } from '../db/repositories/insight.repository.js';
import type { MemoryRepository } from '../db/repositories/memory.repository.js';
import type { SessionRepository } from '../db/repositories/session.repository.js';
import type { SynapseManager } from '../synapses/synapse-manager.js';
import type { WeightedGraph } from '../graph/weighted-graph.js';
export declare class AnalyticsService {
    private tradeRepo;
    private ruleRepo;
    private chainRepo;
    private insightRepo;
    private synapseManager;
    private graph;
    private memoryRepo?;
    private sessionRepo?;
    constructor(tradeRepo: TradeRepository, ruleRepo: RuleRepository, chainRepo: ChainRepository, insightRepo: InsightRepository, synapseManager: SynapseManager, graph: WeightedGraph, memoryRepo?: MemoryRepository | undefined, sessionRepo?: SessionRepository | undefined);
    getSummary(): Record<string, unknown>;
}
