import type { SynapseRecord } from '../db/repositories/synapse.repository.js';
export { timeDecayFactor } from '@timmeck/brain-core';
/**
 * Apply temporal decay to a synapse.
 * Formula: new_weight = max(0.01, weight * 0.5^(age/halfLifeMs))
 */
export declare function decaySynapse(synapse: Omit<SynapseRecord, 'created_at'>, halfLifeMs: number): boolean;
