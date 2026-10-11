export class CalibrationRepository {
    db;
    stmts;
    constructor(db) {
        this.db = db;
        this.stmts = {
            upsert: db.prepare(`
        INSERT INTO calibration (id, learning_rate, weaken_penalty, decay_half_life_days,
          pattern_extraction_interval, pattern_min_samples, pattern_wilson_threshold,
          wilson_z, spreading_activation_decay, spreading_activation_threshold,
          min_activations_for_weight, min_outcomes_for_weights, last_calibration, updated_at)
        VALUES ('main', @learning_rate, @weaken_penalty, @decay_half_life_days,
          @pattern_extraction_interval, @pattern_min_samples, @pattern_wilson_threshold,
          @wilson_z, @spreading_activation_decay, @spreading_activation_threshold,
          @min_activations_for_weight, @min_outcomes_for_weights, datetime('now'), datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          learning_rate = @learning_rate, weaken_penalty = @weaken_penalty,
          decay_half_life_days = @decay_half_life_days,
          pattern_extraction_interval = @pattern_extraction_interval,
          pattern_min_samples = @pattern_min_samples,
          pattern_wilson_threshold = @pattern_wilson_threshold,
          wilson_z = @wilson_z,
          spreading_activation_decay = @spreading_activation_decay,
          spreading_activation_threshold = @spreading_activation_threshold,
          min_activations_for_weight = @min_activations_for_weight,
          min_outcomes_for_weights = @min_outcomes_for_weights,
          last_calibration = datetime('now'), updated_at = datetime('now')
      `),
            get: db.prepare("SELECT * FROM calibration WHERE id = 'main'"),
            insertHistory: db.prepare(`
        INSERT INTO calibration_history (trade_count, synapse_count,
          learning_rate, weaken_penalty, decay_half_life_days,
          pattern_extraction_interval, pattern_min_samples, pattern_wilson_threshold,
          wilson_z, spreading_activation_decay, spreading_activation_threshold,
          min_activations_for_weight, min_outcomes_for_weights)
        VALUES (@trade_count, @synapse_count,
          @learning_rate, @weaken_penalty, @decay_half_life_days,
          @pattern_extraction_interval, @pattern_min_samples, @pattern_wilson_threshold,
          @wilson_z, @spreading_activation_decay, @spreading_activation_threshold,
          @min_activations_for_weight, @min_outcomes_for_weights)
      `),
            getHistory: db.prepare('SELECT * FROM calibration_history ORDER BY created_at DESC LIMIT ?'),
        };
    }
    save(cal) {
        this.stmts['upsert'].run({
            learning_rate: cal.learningRate,
            weaken_penalty: cal.weakenPenalty,
            decay_half_life_days: cal.decayHalfLifeDays,
            pattern_extraction_interval: cal.patternExtractionInterval,
            pattern_min_samples: cal.patternMinSamples,
            pattern_wilson_threshold: cal.patternWilsonThreshold,
            wilson_z: cal.wilsonZ,
            spreading_activation_decay: cal.spreadingActivationDecay,
            spreading_activation_threshold: cal.spreadingActivationThreshold,
            min_activations_for_weight: cal.minActivationsForWeight,
            min_outcomes_for_weights: cal.minOutcomesForWeights,
        });
    }
    get() {
        const row = this.stmts['get'].get();
        if (!row)
            return null;
        return {
            learningRate: row.learning_rate,
            weakenPenalty: row.weaken_penalty,
            decayHalfLifeDays: row.decay_half_life_days,
            patternExtractionInterval: row.pattern_extraction_interval,
            patternMinSamples: row.pattern_min_samples,
            patternWilsonThreshold: row.pattern_wilson_threshold,
            wilsonZ: row.wilson_z,
            spreadingActivationDecay: row.spreading_activation_decay,
            spreadingActivationThreshold: row.spreading_activation_threshold,
            minActivationsForWeight: row.min_activations_for_weight,
            minOutcomesForWeights: row.min_outcomes_for_weights,
        };
    }
    saveSnapshot(cal, tradeCount, synapseCount) {
        this.stmts['insertHistory'].run({
            trade_count: tradeCount,
            synapse_count: synapseCount,
            learning_rate: cal.learningRate,
            weaken_penalty: cal.weakenPenalty,
            decay_half_life_days: cal.decayHalfLifeDays,
            pattern_extraction_interval: cal.patternExtractionInterval,
            pattern_min_samples: cal.patternMinSamples,
            pattern_wilson_threshold: cal.patternWilsonThreshold,
            wilson_z: cal.wilsonZ,
            spreading_activation_decay: cal.spreadingActivationDecay,
            spreading_activation_threshold: cal.spreadingActivationThreshold,
            min_activations_for_weight: cal.minActivationsForWeight,
            min_outcomes_for_weights: cal.minOutcomesForWeights,
        });
    }
    getHistory(limit = 20) {
        return this.stmts['getHistory'].all(limit);
    }
}
//# sourceMappingURL=calibration.repository.js.map