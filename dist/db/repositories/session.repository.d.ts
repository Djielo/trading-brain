import type Database from 'better-sqlite3';
import type { SessionRecord, SessionRepoInterface } from '../../types/memory.types.js';
type CreateSessionData = Omit<SessionRecord, 'id' | 'project_id' | 'embedding'>;
export declare class SessionRepository implements SessionRepoInterface {
    private db;
    private stmts;
    constructor(db: Database.Database);
    create(data: CreateSessionData): number;
    getById(id: number): SessionRecord | undefined;
    findBySessionId(sessionId: string): SessionRecord | undefined;
    findByProject(_projectId: number, limit?: number): SessionRecord[];
    findRecent(limit?: number): SessionRecord[];
    update(id: number, data: Partial<SessionRecord>): void;
    search(query: string, limit?: number): SessionRecord[];
    countAll(): number;
    findLast(): SessionRecord | undefined;
}
export {};
