import type Database from 'better-sqlite3';
import { BaseEmbeddingEngine } from '@timmeck/brain-core';
export interface TradingEmbeddingConfig {
    enabled: boolean;
    modelName?: string;
    cacheDir?: string;
    sweepIntervalMs: number;
    batchSize: number;
}
/**
 * Trading-brain-specific embedding engine.
 * Extends BaseEmbeddingEngine with sweep logic for trading domain tables:
 * trades, signal_combos, rules, memories, sessions, insights.
 */
export declare class TradingEmbeddingEngine extends BaseEmbeddingEngine {
    private config;
    private db;
    private sweepTimer;
    private sweepIntervalMs;
    private batchSize;
    constructor(config: TradingEmbeddingConfig, db: Database.Database);
    /** Start background embedding sweep */
    start(): void;
    stop(): void;
    /** Compute and store embeddings for trading entries that don't have them yet */
    sweep(): Promise<{
        trades: number;
        signals: number;
        rules: number;
        memories: number;
        sessions: number;
        insights: number;
    }>;
}
