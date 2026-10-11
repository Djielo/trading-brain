import { getLogger } from '../utils/logger.js';
export class ImportService {
    tradeService;
    logger = getLogger();
    constructor(tradeService) {
        this.tradeService = tradeService;
    }
    importTrades(trades) {
        let imported = 0;
        let failed = 0;
        const errors = [];
        for (let i = 0; i < trades.length; i++) {
            const row = trades[i];
            try {
                const input = {
                    pair: row.pair,
                    botType: row.botType,
                    profitPct: row.profitPct,
                    win: row.win,
                    signals: row.signals,
                    regime: row.regime,
                };
                this.tradeService.recordOutcome(input);
                imported++;
            }
            catch (err) {
                failed++;
                const msg = `Row ${i}: ${err instanceof Error ? err.message : String(err)}`;
                errors.push(msg);
                this.logger.info(`Import error at row ${i}: ${msg}`);
            }
        }
        this.logger.info(`Import complete: ${imported} imported, ${failed} failed`);
        return { imported, failed, errors };
    }
    importFromJson(jsonString) {
        let parsed;
        try {
            parsed = JSON.parse(jsonString);
        }
        catch (err) {
            const msg = `Invalid JSON: ${err instanceof Error ? err.message : String(err)}`;
            this.logger.info(`Import failed: ${msg}`);
            return { imported: 0, failed: 0, errors: [msg] };
        }
        if (!Array.isArray(parsed)) {
            const msg = 'Expected a JSON array of trade objects';
            this.logger.info(`Import failed: ${msg}`);
            return { imported: 0, failed: 0, errors: [msg] };
        }
        const validationErrors = [];
        const validRows = [];
        for (let i = 0; i < parsed.length; i++) {
            const item = parsed[i];
            const rowErrors = this.validateRow(item, i);
            if (rowErrors.length > 0) {
                validationErrors.push(...rowErrors);
            }
            else {
                validRows.push({
                    pair: item['pair'],
                    botType: item['botType'],
                    profitPct: item['profitPct'],
                    win: item['win'],
                    signals: item['signals'],
                    regime: item['regime'],
                    timeframe: item['timeframe'],
                });
            }
        }
        if (validRows.length === 0 && validationErrors.length > 0) {
            return { imported: 0, failed: parsed.length, errors: validationErrors };
        }
        const result = this.importTrades(validRows);
        result.failed += validationErrors.length;
        result.errors.push(...validationErrors);
        return result;
    }
    validateRow(item, index) {
        const errors = [];
        if (typeof item['pair'] !== 'string')
            errors.push(`Row ${index}: missing or invalid "pair"`);
        if (typeof item['botType'] !== 'string')
            errors.push(`Row ${index}: missing or invalid "botType"`);
        if (typeof item['profitPct'] !== 'number')
            errors.push(`Row ${index}: missing or invalid "profitPct"`);
        if (typeof item['win'] !== 'boolean')
            errors.push(`Row ${index}: missing or invalid "win"`);
        if (typeof item['signals'] !== 'object' || item['signals'] === null)
            errors.push(`Row ${index}: missing or invalid "signals"`);
        return errors;
    }
}
//# sourceMappingURL=import.service.js.map