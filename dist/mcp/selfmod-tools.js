import { z } from 'zod';
function textResult(data) {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return { content: [{ type: 'text', text }] };
}
export function registerSelfmodTools(server, ipc) {
    registerSelfmodToolsWithCaller(server, (method, params) => ipc.request(method, params));
}
export function registerSelfmodToolsDirect(server, router) {
    registerSelfmodToolsWithCaller(server, (method, params) => router.handle(method, params));
}
function registerSelfmodToolsWithCaller(server, call) {
    server.tool('trading_selfmod_status', 'Get the trading-brain self-modification engine status — counts of proposed, testing, ready, applied, failed modifications.', {}, async () => {
        const status = await call('selfmod.status');
        const byStatus = status.byStatus || {};
        const lines = [
            '## Trading-Brain Self-Modification Status',
            `**Total:** ${status.totalModifications}`,
            '',
            `- Proposed: ${byStatus.proposed || 0}`,
            `- Testing: ${byStatus.testing || 0}`,
            `- Ready: ${byStatus.ready || 0}`,
            `- Applied: ${byStatus.applied || 0}`,
            `- Rejected: ${byStatus.rejected || 0}`,
            `- Failed: ${byStatus.failed || 0}`,
            `- Rolled back: ${byStatus.rolled_back || 0}`,
            '',
            `Last: ${status.lastModification || 'none'}`,
            `Root: ${status.projectRoot || 'not set'}`,
        ];
        return textResult(lines.join('\n'));
    });
    server.tool('trading_selfmod_pending', 'List all pending trading-brain self-modifications waiting for review — shows proposed and ready-for-approval code changes.', {}, async () => {
        const pending = await call('selfmod.pending');
        if (pending.length === 0)
            return textResult('No pending self-modifications.');
        const lines = ['## Pending Self-Modifications', ''];
        for (const mod of pending) {
            lines.push(`### #${mod.id}: ${mod.title} [${mod.status}]`);
            lines.push(`Problem: ${mod.problem_description}`);
            lines.push(`Files: ${mod.target_files.join(', ')}`);
            lines.push(`Test: ${mod.test_result} | Tokens: ${mod.tokens_used} | Time: ${mod.generation_time_ms}ms`);
            lines.push('');
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_selfmod_approve', 'Approve a trading-brain self-modification and apply the code changes — only works for modifications with status "ready".', { id: z.number().describe('ID of the modification to approve') }, async ({ id }) => {
        const result = await call('selfmod.approve', { id });
        return textResult(`Modification #${id} ${result.status === 'applied' ? 'approved and applied successfully!' : 'status: ' + result.status}`);
    });
    server.tool('trading_selfmod_history', 'Get the history of all trading-brain self-modifications — shows what changes the trading-brain has proposed, tested, applied, and rejected.', { limit: z.number().optional().default(10).describe('Number of modifications to return') }, async ({ limit }) => {
        const history = await call('selfmod.list', { limit });
        if (history.length === 0)
            return textResult('No self-modification history yet.');
        const lines = ['## Self-Modification History', ''];
        for (const mod of history) {
            const badge = mod.status === 'applied' ? '✓' : mod.status === 'failed' ? '✗' : mod.status === 'rejected' ? '✗' : '○';
            lines.push(`${badge} **#${mod.id}** ${mod.title} [${mod.status}] — ${mod.source_engine} | ${mod.tokens_used} tokens`);
        }
        return textResult(lines.join('\n'));
    });
}
//# sourceMappingURL=selfmod-tools.js.map