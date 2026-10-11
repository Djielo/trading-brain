import type Database from 'better-sqlite3';
import type { MemoryRecord, MemoryCategory, MemoryRepoInterface } from '../../types/memory.types.js';
type CreateMemoryData = Omit<MemoryRecord, 'id' | 'created_at' | 'updated_at' | 'project_id' | 'embedding'>;
export declare class MemoryRepository implements MemoryRepoInterface {
    private db;
    private stmts;
    constructor(db: Database.Database);
    create(data: CreateMemoryData): number;
    getById(id: number): MemoryRecord | undefined;
    findByKey(_projectId: number | null, key: string): MemoryRecord | undefined;
    findByCategory(category: MemoryCategory, _projectId?: number, limit?: number): MemoryRecord[];
    findActive(_projectId?: number, limit?: number): MemoryRecord[];
    search(query: string, limit?: number): MemoryRecord[];
    supersede(oldId: number, newId: number): void;
    deactivate(id: number): void;
    expireOld(): number;
    update(id: number, data: Partial<MemoryRecord>): void;
    findBySession(sessionId: number): MemoryRecord[];
    upsertByKey(key: string, content: string, category: MemoryCategory, importance?: number, source?: string, tags?: string[]): {
        memoryId: number;
        superseded?: number;
    };
    countActive(): number;
    countByCategory(): Record<string, number>;
}
export {};
