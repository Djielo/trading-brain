import type { PaperConfig } from './types.js';
import type { TradeService } from '../services/trade.service.js';
import type { SignalService } from '../services/signal.service.js';
import type { PaperRepository } from '../db/repositories/paper.repository.js';
import type { CrossBrainNotifier } from '@timmeck/brain-core';
export declare class PaperEngine {
    private config;
    private tradeService;
    private repo;
    private priceFetcher;
    private portfolio;
    private decision;
    private timer;
    private cycleCount;
    private lastCycleAt;
    private paused;
    private running;
    private cycleInProgress;
    private logger;
    private notifier;
    constructor(config: PaperConfig, tradeService: TradeService, signalService: SignalService, repo: PaperRepository);
    start(): void;
    stop(): void;
    pause(): void;
    resume(): void;
    isPaused(): boolean;
    isRunning(): boolean;
    getCycleCount(): number;
    getLastCycleAt(): string | null;
    setNotifier(notifier: CrossBrainNotifier): void;
    runCycle(): Promise<{
        entries: number;
        exits: number;
    }>;
}
