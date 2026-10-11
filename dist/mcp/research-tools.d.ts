import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { IpcClient } from '@timmeck/brain-core';
import type { IpcRouter } from '../ipc/router.js';
/** Register research tools using IPC client (for stdio MCP transport) */
export declare function registerResearchTools(server: McpServer, ipc: IpcClient): void;
/** Register research tools using router directly (for HTTP MCP transport inside daemon) */
export declare function registerResearchToolsDirect(server: McpServer, router: IpcRouter): void;
