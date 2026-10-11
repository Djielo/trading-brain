import { z } from 'zod';
function textResult(data) {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return { content: [{ type: 'text', text }] };
}
export function registerAttentionTools(server, ipc) {
    registerAttentionToolsWithCaller(server, (method, params) => ipc.request(method, params));
}
export function registerAttentionToolsDirect(server, router) {
    registerAttentionToolsWithCaller(server, (method, params) => router.handle(method, params));
}
function registerAttentionToolsWithCaller(server, call) {
    server.tool('trading_focus_status', 'Get Trading Brain attention status: current work context, top topics, urgent topics, engine weights.', {}, async () => {
        const status = await call('attention.status', {});
        const lines = [
            `Attention Status:`,
            `  Current context: ${status.currentContext}`,
            `  Total events: ${status.totalEvents}`,
            '',
        ];
        if (status.urgentTopics?.length > 0) {
            lines.push(`URGENT: ${status.urgentTopics.join(', ')}`, '');
        }
        if (status.topTopics?.length > 0) {
            lines.push('Top Topics:');
            for (const t of status.topTopics) {
                lines.push(`  ${t.topic} — score: ${t.score.toFixed(2)} (urgency: ${t.urgency.toFixed(1)})`);
            }
        }
        lines.push('', 'Engine Weights:');
        for (const [engine, weight] of Object.entries(status.engineWeights || {}).sort((a, b) => b[1] - a[1])) {
            lines.push(`  ${engine}: ${weight.toFixed(1)}`);
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_focus_set', 'Direct Trading Brain attention to a specific topic (e.g., "trade_signals", "anomaly_detection").', {
        topic: z.string().describe('Topic to focus on'),
        intensity: z.number().optional().describe('Focus intensity 0-3 (default: 2)'),
    }, async (params) => {
        await call('attention.focus', { topic: params.topic, intensity: params.intensity ?? 2.0 });
        return textResult(`Focus set on "${params.topic}".`);
    });
    server.tool('trading_focus_history', 'Get Trading Brain focus timeline and context switch history.', { limit: z.number().optional().describe('Max entries (default: 30)') }, async (params) => {
        const timeline = await call('attention.timeline', { limit: params.limit ?? 30 });
        const context = await call('attention.context', {});
        const lines = [`Current Context: ${context.context}`, ''];
        if (context.history?.length > 0) {
            lines.push('Context Switches:');
            for (const sw of context.history) {
                const time = new Date(sw.timestamp).toLocaleTimeString();
                lines.push(`  [${time}] ${sw.from} → ${sw.to}`);
            }
            lines.push('');
        }
        if (timeline?.length > 0) {
            lines.push('Focus Timeline:');
            for (const e of timeline) {
                const time = new Date(e.timestamp).toLocaleTimeString();
                lines.push(`  [${time}] ${e.topic} (${e.score?.toFixed?.(2) ?? e.score}) [${e.context}]`);
            }
        }
        return textResult(lines.join('\n'));
    });
}
//# sourceMappingURL=attention-tools.js.map