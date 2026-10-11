import type { InsightRepository, InsightRecord } from '../db/repositories/insight.repository.js';
export declare class InsightService {
    private insightRepo;
    constructor(insightRepo: InsightRepository);
    getAll(): InsightRecord[];
    getRecent(limit?: number): InsightRecord[];
    getByType(type: string): InsightRecord[];
    getBySeverity(severity: string): InsightRecord[];
    search(query: string, limit?: number): InsightRecord[];
    count(): number;
}
