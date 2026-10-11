import type { PaperConfig, PaperPosition, IndicatorResult } from './types.js';
import type { SignalService } from '../services/signal.service.js';
export interface EntrySignal {
    symbol: string;
    price: number;
    indicators: IndicatorResult;
    fingerprint: string;
    confidence: number;
    score: number;
    regime: string;
    signalsJson: string;
}
export interface ExitSignal {
    position: PaperPosition;
    reason: string;
    currentPrice: number;
}
export declare class DecisionEngine {
    private config;
    private signalService;
    private logger;
    constructor(config: PaperConfig, signalService: SignalService);
    /**
     * Detect market regime from indicators.
     */
    detectRegime(indicators: IndicatorResult): string;
    /**
     * Check all positions for exit conditions.
     */
    checkExits(positions: PaperPosition[], prices: Map<string, number>): ExitSignal[];
    /**
     * Check which symbols qualify for entry.
     */
    checkEntries(symbols: string[], prices: Map<string, number>, indicatorMap: Map<string, IndicatorResult>, openSymbols: Set<string>): EntrySignal[];
    private getExitReason;
    private shouldEnter;
    private calcScore;
}
