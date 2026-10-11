import type { PaperEngine } from './paper-engine.js';
import type { PaperRepository } from '../db/repositories/paper.repository.js';
import type { PaperConfig, PaperStatus, PaperPosition, PaperClosedTrade } from './types.js';
export declare class PaperService {
    private engine;
    private repo;
    private config;
    constructor(engine: PaperEngine, repo: PaperRepository, config: PaperConfig);
    getStatus(): PaperStatus;
    getPortfolio(): {
        balance: number;
        equity: number;
        positions: PaperPosition[];
    };
    getHistory(limit?: number): PaperClosedTrade[];
    runManualCycle(): Promise<{
        entries: number;
        exits: number;
    }>;
    pause(): {
        paused: boolean;
    };
    resume(): {
        paused: boolean;
    };
    reset(): {
        success: boolean;
        balance: number;
    };
}
