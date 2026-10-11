import type Database from 'better-sqlite3';
import type { CalibrationConfig } from '../../types/config.types.js';
export interface CalibrationRecord {
    id: string;
    learning_rate: number;
    weaken_penalty: number;
    decay_half_life_days: number;
    pattern_extraction_interval: number;
    pattern_min_samples: number;
    pattern_wilson_threshold: number;
    wilson_z: number;
    spreading_activation_decay: number;
    spreading_activation_threshold: number;
    min_activations_for_weight: number;
    min_outcomes_for_weights: number;
    last_calibration: string;
    updated_at: string;
}
export interface CalibrationHistoryRecord {
    id: number;
    trade_count: number;
    synapse_count: number;
    learning_rate: number;
    weaken_penalty: number;
    decay_half_life_days: number;
    pattern_extraction_interval: number;
    pattern_min_samples: number;
    pattern_wilson_threshold: number;
    wilson_z: number;
    spreading_activation_decay: number;
    spreading_activation_threshold: number;
    min_activations_for_weight: number;
    min_outcomes_for_weights: number;
    created_at: string;
}
export declare class CalibrationRepository {
    private db;
    private stmts;
    constructor(db: Database.Database);
    save(cal: CalibrationConfig): void;
    get(): CalibrationConfig | null;
    saveSnapshot(cal: CalibrationConfig, tradeCount: number, synapseCount: number): void;
    getHistory(limit?: number): CalibrationHistoryRecord[];
}
