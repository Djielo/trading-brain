import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { IpcClient } from '@timmeck/brain-core';
import type { IpcRouter } from '../ipc/router.js';
/** Register responder tools using IPC client (for stdio MCP transport) */
export declare function registerResponderTools(server: McpServer, ipc: IpcClient): void;
/** Register responder tools using router directly (for HTTP MCP transport inside daemon) */
export declare function registerResponderToolsDirect(server: McpServer, router: IpcRouter): void;
