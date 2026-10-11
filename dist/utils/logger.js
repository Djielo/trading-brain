import { createLogger as coreCreateLogger, getLogger, resetLogger } from '@timmeck/brain-core';
import { getDataDir } from './paths.js';
export function createLogger(opts) {
    return coreCreateLogger({
        ...opts,
        envVar: 'TRADING_BRAIN_LOG_LEVEL',
        defaultFilename: 'trading-brain.log',
        dataDir: opts?.file ? undefined : getDataDir(),
    });
}
export { getLogger, resetLogger };
//# sourceMappingURL=logger.js.map