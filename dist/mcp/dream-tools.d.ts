import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { IpcClient } from '@timmeck/brain-core';
import type { IpcRouter } from '../ipc/router.js';
/** Register dream tools using IPC client (for stdio MCP transport) */
export declare function registerDreamTools(server: McpServer, ipc: IpcClient): void;
/** Register dream tools using router directly (for HTTP MCP transport inside daemon) */
export declare function registerDreamToolsDirect(server: McpServer, router: IpcRouter): void;
