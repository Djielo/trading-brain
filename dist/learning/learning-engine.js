import { extractPatterns } from './pattern-extractor.js';
import { calibrate } from './calibrator.js';
import { getEventBus } from '../utils/events.js';
import { BaseLearningEngine } from '@timmeck/brain-core';
export class LearningEngine extends BaseLearningEngine {
    learningConfig;
    cal;
    tradeRepo;
    ruleRepo;
    chainRepo;
    calRepo;
    synapseManager;
    graph;
    lastPatternExtraction = 0;
    lastDecay = 0;
    constructor(learningConfig, cal, tradeRepo, ruleRepo, chainRepo, calRepo, synapseManager, graph) {
        super(learningConfig);
        this.learningConfig = learningConfig;
        this.cal = cal;
        this.tradeRepo = tradeRepo;
        this.ruleRepo = ruleRepo;
        this.chainRepo = chainRepo;
        this.calRepo = calRepo;
        this.synapseManager = synapseManager;
        this.graph = graph;
    }
    getCalibration() {
        return { ...this.cal };
    }
    runCycle() {
        const bus = getEventBus();
        const outcomeCount = this.tradeRepo.count();
        // Pattern extraction
        if (outcomeCount - this.lastPatternExtraction >= this.cal.patternExtractionInterval) {
            const trades = this.tradeRepo.getAll();
            const rules = extractPatterns(trades, this.cal);
            if (rules.length > 0) {
                this.ruleRepo.replaceAll(rules);
                this.lastPatternExtraction = outcomeCount;
                this.logger.info(`Extracted ${rules.length} rules from ${trades.length} trades`);
                bus.emit('patterns:extracted', { ruleCount: rules.length });
            }
        }
        // Recalibrate every 25 trades
        if (outcomeCount > 0 && outcomeCount % 25 === 0) {
            const synapseCount = this.synapseManager.count();
            const newCal = calibrate(this.cal, outcomeCount, synapseCount);
            this.cal = newCal;
            this.synapseManager.updateCalibration(newCal);
            this.calRepo.save(newCal);
            this.calRepo.saveSnapshot(newCal, outcomeCount, synapseCount);
            this.logger.info(`Recalibrated — lr: ${newCal.learningRate}, z: ${newCal.wilsonZ}, halfLife: ${newCal.decayHalfLifeDays}d`);
            bus.emit('calibration:updated', { outcomeCount, learningRate: newCal.learningRate });
        }
        // Daily decay
        const now = Date.now();
        const dayMs = 86400000;
        if (now - this.lastDecay > dayMs) {
            const halfLifeMs = this.cal.decayHalfLifeDays * dayMs;
            const synDecayed = this.synapseManager.runDecay();
            this.graph.decayEdges(halfLifeMs);
            this.lastDecay = now;
            this.logger.info(`Decay applied — ${synDecayed} synapses, ${this.graph.getEdgeCount()} edges`);
            bus.emit('decay:applied', { synapseCount: synDecayed, edgeCount: this.graph.getEdgeCount() });
        }
        // Prune old chains
        this.chainRepo.pruneOldest(this.learningConfig.maxChains);
    }
    /** Manual trigger for a full learning cycle */
    runManual() {
        this.runCycle();
        const rules = this.ruleRepo.getAll();
        return { rules: rules.length, calibration: this.getCalibration() };
    }
}
//# sourceMappingURL=learning-engine.js.map