import { BaseApiServer, type ApiServerOptions } from '@timmeck/brain-core';
export type { ApiServerOptions };
export declare class ApiServer extends BaseApiServer {
    private statsTimer;
    start(): void;
    stop(): void;
    private setupSSE;
}
