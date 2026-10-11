import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { IpcClient } from '@timmeck/brain-core';
import type { IpcRouter } from '../ipc/router.js';
/** Register narrative tools using IPC client (for stdio MCP transport) */
export declare function registerNarrativeTools(server: McpServer, ipc: IpcClient): void;
/** Register narrative tools using router directly (for HTTP MCP transport inside daemon) */
export declare function registerNarrativeToolsDirect(server: McpServer, router: IpcRouter): void;
