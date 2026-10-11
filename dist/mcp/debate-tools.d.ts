import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { IpcClient } from '@timmeck/brain-core';
import type { IpcRouter } from '../ipc/router.js';
export declare function registerDebateTools(server: McpServer, ipc: IpcClient): void;
export declare function registerDebateToolsDirect(server: McpServer, router: IpcRouter): void;
