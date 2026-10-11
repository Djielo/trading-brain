import type { IpcRouter } from '../ipc/router.js';
export declare class McpHttpServer {
    private inner;
    constructor(port: number, router: IpcRouter);
    start(): void;
    stop(): void;
    getClientCount(): number;
}
