import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { IpcClient } from '@timmeck/brain-core';
import type { IpcRouter } from '../ipc/router.js';
export declare function registerLLMTools(server: McpServer, ipc: IpcClient): void;
export declare function registerLLMToolsDirect(server: McpServer, router: IpcRouter): void;
