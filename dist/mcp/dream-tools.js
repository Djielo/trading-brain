import { z } from 'zod';
function textResult(data) {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return { content: [{ type: 'text', text }] };
}
/** Register dream tools using IPC client (for stdio MCP transport) */
export function registerDreamTools(server, ipc) {
    registerDreamToolsWithCaller(server, (method, params) => ipc.request(method, params));
}
/** Register dream tools using router directly (for HTTP MCP transport inside daemon) */
export function registerDreamToolsDirect(server, router) {
    registerDreamToolsWithCaller(server, (method, params) => router.handle(method, params));
}
function registerDreamToolsWithCaller(server, call) {
    // ═══════════════════════════════════════════════════════════════════
    // Dream Mode — Offline Memory Consolidation
    // ═══════════════════════════════════════════════════════════════════
    server.tool('trading_dream_status', 'Get Trading Brain Dream Mode status: whether dreaming is active, total cycles, lifetime consolidation stats.', {}, async () => {
        const status = await call('dream.status', {});
        const lines = [
            'Trading Brain Dream Mode Status:',
            `  Running: ${status.running ? 'yes' : 'no'}`,
            `  Total cycles: ${status.totalCycles}`,
            `  Last dream: ${status.lastDreamAt ? new Date(status.lastDreamAt).toLocaleString() : 'never'}`,
            '',
            'Lifetime Totals:',
            `  Memories consolidated: ${status.totals?.memoriesConsolidated ?? 0}`,
            `  Synapses pruned: ${status.totals?.synapsesPruned ?? 0}`,
            `  Memories archived: ${status.totals?.memoriesArchived ?? 0}`,
        ];
        return textResult(lines.join('\n'));
    });
    server.tool('trading_dream_consolidate', 'Manually trigger a Trading Brain Dream Mode consolidation cycle. Replays trading memories, prunes weak synapses, compresses similar patterns.', {
        trigger: z.enum(['manual', 'idle']).optional().describe('Trigger type (default: manual)'),
    }, async (params) => {
        const report = await call('dream.consolidate', { trigger: params.trigger ?? 'manual' });
        const lines = [
            `Dream Cycle Complete (${report.cycleId}):`,
            `  Duration: ${report.duration}ms`,
            `  Trigger: ${report.trigger}`,
            '',
            'Results:',
            `  Memories replayed: ${report.replay?.memoriesReplayed ?? 0}`,
            `  Synapses strengthened: ${report.replay?.synapsesStrengthened ?? 0}`,
            `  Synapses pruned: ${report.pruning?.synapsesPruned ?? 0}`,
            `  Memories consolidated: ${report.compression?.memoriesConsolidated ?? 0}`,
            `  Memories superseded: ${report.compression?.memoriesSuperseded ?? 0}`,
            `  Compression ratio: ${(report.compression?.compressionRatio ?? 1).toFixed(2)}`,
            `  Memories decayed: ${report.decay?.memoriesDecayed ?? 0}`,
            `  Memories archived: ${report.decay?.memoriesArchived ?? 0}`,
            `  Principles discovered: ${report.principlesDiscovered ?? 0}`,
        ];
        return textResult(lines.join('\n'));
    });
    server.tool('trading_dream_history', 'Get past Trading Brain Dream Mode cycles. Shows consolidation stats per cycle.', {
        limit: z.number().optional().describe('Max results (default: 10)'),
    }, async (params) => {
        const history = await call('dream.history', { limit: params.limit ?? 10 });
        if (!history?.length)
            return textResult('No dream cycles yet.');
        const lines = [`Trading Brain Dream History (${history.length} cycles):\n`];
        for (const h of history) {
            lines.push(`  #${h.id} [${h.trigger}] ${new Date(h.timestamp).toLocaleString()}`);
            lines.push(`    Replayed: ${h.memories_replayed}, Pruned: ${h.synapses_pruned}, Consolidated: ${h.memories_consolidated}, Archived: ${h.memories_archived}`);
        }
        return textResult(lines.join('\n'));
    });
}
//# sourceMappingURL=dream-tools.js.map