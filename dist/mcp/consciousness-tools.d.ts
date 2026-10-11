import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { IpcClient } from '@timmeck/brain-core';
import type { IpcRouter } from '../ipc/router.js';
/** Register consciousness tools using IPC client (for stdio MCP transport) */
export declare function registerConsciousnessTools(server: McpServer, ipc: IpcClient): void;
/** Register consciousness tools using router directly (for HTTP MCP transport inside daemon) */
export declare function registerConsciousnessToolsDirect(server: McpServer, router: IpcRouter): void;
