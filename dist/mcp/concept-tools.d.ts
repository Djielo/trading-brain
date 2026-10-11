import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { IpcClient } from '@timmeck/brain-core';
import type { IpcRouter } from '../ipc/router.js';
export declare function registerConceptTools(server: McpServer, ipc: IpcClient): void;
export declare function registerConceptToolsDirect(server: McpServer, router: IpcRouter): void;
