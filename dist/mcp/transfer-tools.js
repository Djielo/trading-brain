import { z } from 'zod';
function textResult(data) {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return { content: [{ type: 'text', text }] };
}
export function registerTransferTools(server, ipc) {
    registerTransferToolsWithCaller(server, (method, params) => ipc.request(method, params));
}
export function registerTransferToolsDirect(server, router) {
    registerTransferToolsWithCaller(server, (method, params) => router.handle(method, params));
}
function registerTransferToolsWithCaller(server, call) {
    server.tool('trading_transfer_status', 'Get cross-domain knowledge transfer status for Trading Brain: analogies, transfers, rules, effectiveness.', {}, async () => {
        const status = await call('transfer.status', {});
        const lines = [
            'Transfer Engine Status (Trading):',
            `  Analogies: ${status.totalAnalogies} | Transfers: ${status.totalTransfers} (pending: ${status.pendingTransfers})`,
            `  Avg effectiveness: ${(status.avgEffectiveness * 100).toFixed(0)}% | Rules: ${status.activeRules}/${status.totalRules} active`,
        ];
        if (status.recentAnalogies?.length > 0) {
            lines.push('', 'Recent Analogies:');
            for (const a of status.recentAnalogies.slice(0, 5)) {
                lines.push(`  [${(a.similarity * 100).toFixed(0)}%] ${a.narrative}`);
            }
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_transfer_analogies', 'Find cross-domain analogies relevant to trading — patterns similar across Brain domains.', { limit: z.number().optional().describe('Max analogies (default: 20)') }, async (params) => {
        const analogies = await call('transfer.analogies', { limit: params.limit ?? 20 });
        if (!analogies?.length)
            return textResult('No analogies discovered yet.');
        const lines = analogies.map((a) => `[${(a.similarity * 100).toFixed(0)}%] ${a.source_brain} ↔ ${a.target_brain}: ${a.narrative}`);
        return textResult(lines.join('\n'));
    });
    server.tool('trading_transfer_rules', 'List cross-domain rules affecting Trading Brain.', {}, async () => {
        const rules = await call('transfer.rules', {});
        if (!rules?.length)
            return textResult('No cross-domain rules configured.');
        const lines = rules.map((r) => `[${r.enabled ? 'ON' : 'OFF'}] "${r.name}" ${r.source_brain}:${r.source_event} → ${r.target_brain}:${r.action} (fired ${r.fire_count}x)`);
        return textResult(lines.join('\n'));
    });
}
//# sourceMappingURL=transfer-tools.js.map