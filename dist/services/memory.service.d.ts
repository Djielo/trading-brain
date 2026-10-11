import type { MemoryRepository } from '../db/repositories/memory.repository.js';
import type { SessionRepository } from '../db/repositories/session.repository.js';
import type { MemoryRecord, SessionRecord, RememberInput, RecallInput, StartSessionInput, EndSessionInput } from '../types/memory.types.js';
export declare class MemoryService {
    private memoryRepo;
    private sessionRepo;
    private logger;
    constructor(memoryRepo: MemoryRepository, sessionRepo: SessionRepository);
    remember(input: RememberInput): {
        memoryId: number;
        superseded?: number;
    };
    recall(input: RecallInput): MemoryRecord[];
    forget(memoryId: number): void;
    getPreferences(): MemoryRecord[];
    getDecisions(): MemoryRecord[];
    getGoals(): MemoryRecord[];
    getLessons(): MemoryRecord[];
    startSession(input: StartSessionInput): {
        sessionId: number;
        dbSessionId: string;
    };
    endSession(input: EndSessionInput): void;
    getSessionHistory(limit?: number): SessionRecord[];
    getCurrentSession(sessionUuid: string): SessionRecord | undefined;
    getStats(): {
        active: number;
        byCategory: Record<string, number>;
        sessions: number;
        lastSession?: string;
    };
    expireOldMemories(): number;
}
