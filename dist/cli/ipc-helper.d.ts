import { IpcClient } from '@timmeck/brain-core';
export declare function withIpc<T>(fn: (client: IpcClient) => Promise<T>): Promise<T>;
