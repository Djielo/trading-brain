import type { CalibrationConfig } from '../types/config.types.js';
/**
 * Adaptive Calibration — dynamically adjust learning parameters based on data volume.
 * Ported from tradingBrain.js calibrate() function.
 */
export declare function calibrate(current: CalibrationConfig, outcomeCount: number, synapseCount: number): CalibrationConfig;
