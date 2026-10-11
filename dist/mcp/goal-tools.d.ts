import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { IpcClient } from '@timmeck/brain-core';
import type { IpcRouter } from '../ipc/router.js';
export declare function registerGoalTools(server: McpServer, ipc: IpcClient): void;
export declare function registerGoalToolsDirect(server: McpServer, router: IpcRouter): void;
