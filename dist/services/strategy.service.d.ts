import type { SynapseManager } from '../synapses/synapse-manager.js';
import type { WeightedGraph } from '../graph/weighted-graph.js';
import type { CalibrationConfig } from '../types/config.types.js';
export interface DCAMultiplierResult {
    multiplier: number;
    reason: string;
}
export interface GridParamsResult {
    spacingMultiplier: number;
    reason: string;
}
export declare class StrategyService {
    private synapseManager;
    private graph;
    private cal;
    private tradeCount;
    constructor(synapseManager: SynapseManager, graph: WeightedGraph, cal: CalibrationConfig, tradeCount: () => number);
    updateCalibration(cal: CalibrationConfig): void;
    /**
     * Brain-recommended DCA multiplier based on regime success.
     * Ported from tradingBrain.js getDCAMultiplier().
     */
    getDCAMultiplier(regime: string, rsi: number, volatility: number): DCAMultiplierResult;
    /**
     * Brain-recommended grid spacing based on volatility history.
     * Ported from tradingBrain.js getGridParams().
     */
    getGridParams(regime: string, volatility: number, _pair: string): GridParamsResult;
}
