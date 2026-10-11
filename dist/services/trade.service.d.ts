import type { TradeRepository, TradeRecord } from '../db/repositories/trade.repository.js';
import type { SignalRepository } from '../db/repositories/signal.repository.js';
import type { ChainRepository } from '../db/repositories/chain.repository.js';
import type { SynapseManager } from '../synapses/synapse-manager.js';
import type { WeightedGraph } from '../graph/weighted-graph.js';
import type { CalibrationConfig, LearningConfig } from '../types/config.types.js';
import { type SignalInput } from '../signals/fingerprint.js';
export interface RecordOutcomeInput {
    signals: SignalInput;
    regime?: string;
    profitPct: number;
    win: boolean;
    botType: string;
    pair: string;
}
export declare class TradeService {
    private tradeRepo;
    private signalRepo;
    private chainRepo;
    private synapseManager;
    private graph;
    private cal;
    private learningConfig;
    private recentTrades;
    private logger;
    constructor(tradeRepo: TradeRepository, signalRepo: SignalRepository, chainRepo: ChainRepository, synapseManager: SynapseManager, graph: WeightedGraph, cal: CalibrationConfig, learningConfig: LearningConfig);
    updateCalibration(cal: CalibrationConfig): void;
    recordOutcome(input: RecordOutcomeInput): {
        tradeId: number;
        fingerprint: string;
        synapseWeight: number;
    };
    query(search: string, limit?: number): TradeRecord[];
    getRecent(limit?: number): TradeRecord[];
    getByPair(pair: string): TradeRecord[];
    count(): number;
}
