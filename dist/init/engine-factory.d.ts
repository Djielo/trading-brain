/**
 * Intelligence engines factory — extracted from TradingCore.start() (Sessions 55-76).
 * Pure extraction, no logic changes.
 */
import type Database from 'better-sqlite3';
import type { Services } from '../ipc/router.js';
import type { ResearchOrchestrator, AutonomousResearchScheduler, ThoughtStream, LLMService, GoalEngine, ParameterRegistry, CrossBrainNotifier } from '@timmeck/brain-core';
import type { PaperEngine } from '../paper/paper-engine.js';
export interface IntelligenceDeps {
    db: Database.Database;
    services: Services;
    orchestrator: ResearchOrchestrator;
    researchScheduler: AutonomousResearchScheduler;
    thoughtStream: ThoughtStream;
    llmService: LLMService;
    goalEngine: GoalEngine;
    parameterRegistry: ParameterRegistry;
    paperEngine: PaperEngine | null;
    notifier: CrossBrainNotifier | null;
}
export declare function createIntelligenceEngines(deps: IntelligenceDeps): void;
