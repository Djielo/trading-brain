import type { SynapseRepository, SynapseRecord } from '../db/repositories/synapse.repository.js';
import type { CalibrationConfig } from '../types/config.types.js';
export declare class SynapseManager {
    private repo;
    private cal;
    private cache;
    private logger;
    constructor(repo: SynapseRepository, cal: CalibrationConfig);
    private loadCache;
    updateCalibration(cal: CalibrationConfig): void;
    getOrCreate(fingerprint: string): Omit<SynapseRecord, 'created_at'>;
    get(id: string): Omit<SynapseRecord, 'created_at'> | undefined;
    getByFingerprint(fingerprint: string): Omit<SynapseRecord, 'created_at'> | undefined;
    recordWin(fingerprint: string, profitPct: number): Omit<SynapseRecord, 'created_at'>;
    recordLoss(fingerprint: string, profitPct: number): Omit<SynapseRecord, 'created_at'>;
    runDecay(): number;
    getAll(): Omit<SynapseRecord, 'created_at'>[];
    count(): number;
    getStrongest(limit?: number): Omit<SynapseRecord, 'created_at'>[];
    getAvgWeight(): number;
    clear(): void;
}
