import type { SynapseManager } from '../synapses/synapse-manager.js';
import type { WeightedGraph } from '../graph/weighted-graph.js';
import type { CalibrationConfig } from '../types/config.types.js';
import type { RuleRepository } from '../db/repositories/rule.repository.js';
import type { TradeRepository } from '../db/repositories/trade.repository.js';
import { type SignalInput } from '../signals/fingerprint.js';
export interface SignalExplanation {
    fingerprint: string;
    wilson: {
        successes: number;
        total: number;
        lowerBound: number;
        z: number;
    };
    sampleSize: number;
    accuracy: {
        wins: number;
        losses: number;
        winRate: number;
    };
    synapse: {
        weight: number;
        activations: number;
        totalProfit: number;
    } | null;
    similarSignals: Array<{
        fingerprint: string;
        similarity: number;
        weight: number;
        activations: number;
    }>;
    relatedPatterns: Array<{
        pattern: string;
        confidence: number;
        sampleCount: number;
        winRate: number;
        avgProfit: number;
    }>;
}
export declare class SignalService {
    private synapseManager;
    private graph;
    private cal;
    private tradeCount;
    private ruleRepo?;
    private tradeRepo?;
    constructor(synapseManager: SynapseManager, graph: WeightedGraph, cal: CalibrationConfig, tradeCount: () => number, ruleRepo?: RuleRepository | undefined, tradeRepo?: TradeRepository | undefined);
    updateCalibration(cal: CalibrationConfig): void;
    /**
     * Get brain-weighted signal strengths based on learned experience.
     * Ported from tradingBrain.js getSignalWeights().
     */
    getSignalWeights(signals: SignalInput, regime?: string): Record<string, number>;
    /**
     * Get Wilson Score confidence for signal pattern.
     * Ported from tradingBrain.js getConfidence().
     */
    getConfidence(signals: SignalInput, regime?: string): number;
    /**
     * Explain the confidence assessment for a specific signal fingerprint.
     * Returns Wilson Score breakdown, sample size, historical accuracy,
     * synapse connections, and related learned patterns.
     */
    explainSignal(fp: string): SignalExplanation;
}
