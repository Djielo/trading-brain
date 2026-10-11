import type { TradeRepository } from '../db/repositories/trade.repository.js';
import type { RuleRepository } from '../db/repositories/rule.repository.js';
import type { ChainRepository } from '../db/repositories/chain.repository.js';
import type { CalibrationRepository } from '../db/repositories/calibration.repository.js';
import type { SynapseManager } from '../synapses/synapse-manager.js';
import type { WeightedGraph } from '../graph/weighted-graph.js';
import type { CalibrationConfig, LearningConfig } from '../types/config.types.js';
import { BaseLearningEngine } from '@timmeck/brain-core';
export declare class LearningEngine extends BaseLearningEngine {
    private learningConfig;
    private cal;
    private tradeRepo;
    private ruleRepo;
    private chainRepo;
    private calRepo;
    private synapseManager;
    private graph;
    private lastPatternExtraction;
    private lastDecay;
    constructor(learningConfig: LearningConfig, cal: CalibrationConfig, tradeRepo: TradeRepository, ruleRepo: RuleRepository, chainRepo: ChainRepository, calRepo: CalibrationRepository, synapseManager: SynapseManager, graph: WeightedGraph);
    getCalibration(): CalibrationConfig;
    runCycle(): void;
    /** Manual trigger for a full learning cycle */
    runManual(): {
        rules: number;
        calibration: CalibrationConfig;
    };
}
