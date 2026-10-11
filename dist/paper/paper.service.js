export class PaperService {
    engine;
    repo;
    config;
    constructor(engine, repo, config) {
        this.engine = engine;
        this.repo = repo;
        this.config = config;
    }
    getStatus() {
        const { balance, equity } = this.repo.getBalance();
        const wr = this.repo.getWinRate();
        const totalPnl = this.repo.getTotalPnl();
        return {
            enabled: this.config.enabled,
            running: this.engine.isRunning(),
            paused: this.engine.isPaused(),
            cycleCount: this.engine.getCycleCount(),
            lastCycleAt: this.engine.getLastCycleAt(),
            balance,
            equity,
            startingBalance: this.config.startingBalance,
            openPositions: this.repo.countPositions(),
            closedTrades: wr.total,
            totalTrades: wr.total,
            winRate: Math.round(wr.rate * 100),
            totalPnl,
            symbols: this.config.cryptoIds.length + this.config.stockSymbols.length,
        };
    }
    getPortfolio() {
        const { balance, equity } = this.repo.getBalance();
        return {
            balance,
            equity,
            positions: this.repo.getOpenPositions(),
        };
    }
    getHistory(limit = 20) {
        return this.repo.getRecentTrades(limit);
    }
    async runManualCycle() {
        return this.engine.runCycle();
    }
    pause() {
        this.engine.pause();
        return { paused: true };
    }
    resume() {
        this.engine.resume();
        return { paused: false };
    }
    reset() {
        this.repo.reset(this.config.startingBalance);
        return { success: true, balance: this.config.startingBalance };
    }
}
//# sourceMappingURL=paper.service.js.map