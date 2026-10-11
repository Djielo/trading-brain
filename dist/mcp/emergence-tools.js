import { z } from 'zod';
function textResult(data) {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return { content: [{ type: 'text', text }] };
}
export function registerEmergenceTools(server, ipc) {
    registerEmergenceToolsWithCaller(server, (method, params) => ipc.request(method, params));
}
export function registerEmergenceToolsDirect(server, router) {
    registerEmergenceToolsWithCaller(server, (method, params) => router.handle(method, params));
}
function registerEmergenceToolsWithCaller(server, call) {
    server.tool('trading_emergence_status', 'Get Trading Brain emergence status: emergent events, complexity metrics, surprise scores.', {}, async () => {
        const status = await call('emergence.status', {});
        const lines = ['# Trading Emergence Status', '', `**Events:** ${status.totalEvents} (${status.unpredictedCount} unpredicted)`, `**Avg Surprise:** ${(status.avgSurpriseScore * 100).toFixed(0)}%`];
        if (status.latestMetrics) {
            const m = status.latestMetrics;
            lines.push('', `K=${m.compressionComplexity.toFixed(3)} | H=${m.knowledgeEntropy.toFixed(2)}bit | \u03A6=${m.integrationPhi.toFixed(3)} | ${m.nodeCount} nodes, ${m.synapseCount} synapses`);
        }
        if (status.topEvents?.length > 0) {
            lines.push('', '## Top Events');
            for (const e of status.topEvents)
                lines.push(`- [${e.type}] ${e.title} (${(e.surpriseScore * 100).toFixed(0)}%)`);
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_emergence_detect', 'Scan for emergent patterns in Trading Brain.', {}, async () => {
        const events = await call('emergence.detect', {});
        if (!events?.length)
            return textResult('No emergent patterns detected.');
        const lines = [`# Emergent: ${events.length}\n`];
        for (const e of events) {
            lines.push(`## [${e.type}] ${e.title}`, `Surprise: ${(e.surpriseScore * 100).toFixed(0)}% | ${e.sourceEngine}`, e.description, '');
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_complexity_metrics', 'Compute Trading Brain complexity: Kolmogorov, Shannon entropy, Phi, network density.', {}, async () => {
        const m = await call('emergence.metrics', {});
        return textResult(`K=${m.compressionComplexity.toFixed(4)} | H=${m.knowledgeEntropy.toFixed(3)}bit | \u03A6=${m.integrationPhi.toFixed(4)} | density=${m.networkDensity.toFixed(5)} | ${m.nodeCount} nodes, ${m.synapseCount} synapses | diversity=${(m.knowledgeDiversity * 100).toFixed(1)}%`);
    });
    server.tool('trading_emergence_journal', 'View Trading Brain emergence journal.', { limit: z.number().optional().describe('Max events (default: 20)') }, async (params) => {
        const events = await call('emergence.events', { limit: params.limit ?? 20 });
        if (!events?.length)
            return textResult('No emergence events.');
        const lines = [`# Emergence Journal: ${events.length}\n`];
        for (const e of events) {
            lines.push(`## ${e.title}`, `${e.type} | surprise=${(e.surpriseScore * 100).toFixed(0)}% | ${e.sourceEngine}`, e.description.substring(0, 200), '');
        }
        return textResult(lines.join('\n'));
    });
}
//# sourceMappingURL=emergence-tools.js.map