import { z } from 'zod';
function textResult(data) {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return { content: [{ type: 'text', text }] };
}
/** Register consciousness tools using IPC client (for stdio MCP transport) */
export function registerConsciousnessTools(server, ipc) {
    registerConsciousnessToolsWithCaller(server, (method, params) => ipc.request(method, params));
}
/** Register consciousness tools using router directly (for HTTP MCP transport inside daemon) */
export function registerConsciousnessToolsDirect(server, router) {
    registerConsciousnessToolsWithCaller(server, (method, params) => router.handle(method, params));
}
function registerConsciousnessToolsWithCaller(server, call) {
    server.tool('trading_consciousness_status', 'Get Trading Brain consciousness status: total thoughts, active engines, thought breakdown, and live dashboard client count.', {}, async () => {
        const status = await call('consciousness.status', {});
        const lines = [
            'Trading Brain Consciousness Status:',
            `  Total thoughts: ${status.totalThoughts}`,
            `  Active engines: ${(status.activeEngines || []).join(', ') || 'none'}`,
            `  Dashboard clients: ${status.clients ?? 0}`,
            `  Uptime: ${Math.floor((status.uptime || 0) / 1000)}s`,
            '',
            'Thoughts by Engine:',
            ...Object.entries(status.thoughtsPerEngine || {}).map(([k, v]) => `  ${k}: ${v}`),
            '',
            'Engine Activity:',
            ...(status.engines || []).map((e) => `  ${e.engine} [${e.status}] — ${e.metrics.totalThoughts} thoughts, ${e.metrics.discoveries} discoveries`),
        ];
        return textResult(lines.join('\n'));
    });
    server.tool('trading_consciousness_thoughts', 'Get recent thoughts from Trading Brain consciousness stream. Shows what Trading Brain is thinking.', {
        engine: z.string().optional().describe('Filter by engine (e.g., "dream", "anomaly_detective")'),
        limit: z.number().optional().describe('Max results (default: 20)'),
    }, async (params) => {
        const thoughts = await call('consciousness.thoughts', {
            engine: params.engine,
            limit: params.limit ?? 20,
        });
        if (!thoughts?.length)
            return textResult('No thoughts yet. Trading Brain is quiet.');
        const lines = [`Recent Thoughts (${thoughts.length}):\n`];
        for (const t of thoughts) {
            const time = new Date(t.timestamp).toLocaleTimeString();
            lines.push(`  [${time}] ${t.engine} (${t.type}) [${t.significance}]`);
            lines.push(`    ${t.content}`);
        }
        return textResult(lines.join('\n'));
    });
}
//# sourceMappingURL=consciousness-tools.js.map