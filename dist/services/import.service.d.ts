import type { TradeService } from './trade.service.js';
import type { SignalInput } from '../signals/fingerprint.js';
export interface ImportTradeRow {
    pair: string;
    botType: string;
    profitPct: number;
    win: boolean;
    signals: SignalInput;
    regime?: string;
    timeframe?: string;
}
export interface ImportResult {
    imported: number;
    failed: number;
    errors: string[];
}
export declare class ImportService {
    private tradeService;
    private logger;
    constructor(tradeService: TradeService);
    importTrades(trades: ImportTradeRow[]): ImportResult;
    importFromJson(jsonString: string): ImportResult;
    private validateRow;
}
