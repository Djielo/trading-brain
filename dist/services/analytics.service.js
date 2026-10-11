export class AnalyticsService {
    tradeRepo;
    ruleRepo;
    chainRepo;
    insightRepo;
    synapseManager;
    graph;
    memoryRepo;
    sessionRepo;
    constructor(tradeRepo, ruleRepo, chainRepo, insightRepo, synapseManager, graph, memoryRepo, sessionRepo) {
        this.tradeRepo = tradeRepo;
        this.ruleRepo = ruleRepo;
        this.chainRepo = chainRepo;
        this.insightRepo = insightRepo;
        this.synapseManager = synapseManager;
        this.graph = graph;
        this.memoryRepo = memoryRepo;
        this.sessionRepo = sessionRepo;
    }
    getSummary() {
        const tradeCount = this.tradeRepo.count();
        const recentTrades = this.tradeRepo.getRecent(10);
        const rules = this.ruleRepo.getAll();
        const chains = this.chainRepo.getRecent(5);
        const insights = this.insightRepo.getRecent(5);
        const wins = recentTrades.filter(t => t.win === 1).length;
        const recentWinRate = recentTrades.length > 0 ? wins / recentTrades.length : 0;
        const topRule = rules.length > 0 ? {
            pattern: rules[0].pattern,
            winRate: Math.round(rules[0].win_rate * 100),
            confidence: Math.round(rules[0].confidence * 100),
            sampleCount: rules[0].sample_count,
        } : null;
        return {
            trades: {
                total: tradeCount,
                recentWinRate: Math.round(recentWinRate * 100),
            },
            rules: {
                total: rules.length,
                topRule,
            },
            chains: {
                total: this.chainRepo.count(),
                recent: chains.map(c => ({
                    pair: c.pair,
                    type: c.type,
                    length: c.length,
                })),
            },
            insights: {
                total: this.insightRepo.count(),
                recent: insights.map(i => ({
                    type: i.type,
                    severity: i.severity,
                    title: i.title,
                })),
            },
            network: {
                synapses: this.synapseManager.count(),
                avgWeight: Number(this.synapseManager.getAvgWeight().toFixed(3)),
                graphNodes: this.graph.getNodeCount(),
                graphEdges: this.graph.getEdgeCount(),
            },
            memory: {
                active: this.memoryRepo?.countActive() ?? 0,
                byCategory: this.memoryRepo?.countByCategory() ?? {},
                sessions: this.sessionRepo?.countAll() ?? 0,
            },
        };
    }
}
//# sourceMappingURL=analytics.service.js.map