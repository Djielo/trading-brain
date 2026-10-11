import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { IpcClient } from '@timmeck/brain-core';
import type { IpcRouter } from '../ipc/router.js';
/** Register advanced research tools using IPC client (for stdio MCP transport) */
export declare function registerAdvancedResearchTools(server: McpServer, ipc: IpcClient): void;
/** Register advanced research tools using router directly (for HTTP MCP transport inside daemon) */
export declare function registerAdvancedResearchToolsDirect(server: McpServer, router: IpcRouter): void;
