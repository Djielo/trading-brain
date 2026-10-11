import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { IpcClient } from '@timmeck/brain-core';
import type { IpcRouter } from '../ipc/router.js';
/** Register prediction tools using IPC client (for stdio MCP transport) */
export declare function registerPredictionTools(server: McpServer, ipc: IpcClient): void;
/** Register prediction tools using router directly (for HTTP MCP transport inside daemon) */
export declare function registerPredictionToolsDirect(server: McpServer, router: IpcRouter): void;
