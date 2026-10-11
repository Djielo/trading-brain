import { getLogger, resetLogger } from '@timmeck/brain-core';
import type winston from 'winston';
export declare function createLogger(opts?: {
    level?: string;
    file?: string;
    maxSize?: number;
    maxFiles?: number;
}): winston.Logger;
export { getLogger, resetLogger };
