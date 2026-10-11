import { z } from 'zod';
function textResult(data) {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return { content: [{ type: 'text', text }] };
}
/** Register responder tools using IPC client (for stdio MCP transport) */
export function registerResponderTools(server, ipc) {
    registerResponderToolsWithCaller(server, (method, params) => ipc.request(method, params));
}
/** Register responder tools using router directly (for HTTP MCP transport inside daemon) */
export function registerResponderToolsDirect(server, router) {
    registerResponderToolsWithCaller(server, (method, params) => router.handle(method, params));
}
function registerResponderToolsWithCaller(server, call) {
    server.tool('trading_responder_status', 'Get the AutoResponder status — shows how many anomalies Trading Brain has automatically responded to, success rate, and recent actions.', {}, async () => {
        const result = await call('responder.status');
        const lines = [
            `AutoResponder Status`,
            `  Enabled: ${result.enabled}`,
            `  Total Responses: ${result.total_responses}`,
            `  Successful: ${result.successful}`,
            `  Reverted: ${result.reverted}`,
            `  Success Rate: ${((result.success_rate ?? 0) * 100).toFixed(1)}%`,
            `  Rules: ${result.rules_count}`,
        ];
        if (result.recent?.length > 0) {
            lines.push('', 'Recent Actions:');
            for (const r of result.recent) {
                lines.push(`  [${r.action}] ${r.description}`);
            }
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_responder_history', 'Get history of automatic responses Trading Brain has taken in reaction to anomalies.', {
        limit: z.number().optional().describe('Max entries to return (default: 20)'),
    }, async (params) => {
        const result = await call('responder.history', { limit: params.limit ?? 20 });
        if (!result?.length)
            return textResult('No auto-responses recorded yet.');
        const lines = result.map((r) => `[${new Date(r.timestamp).toISOString().substring(0, 19)}] ${r.action}: ${r.description}${r.reverted ? ' (REVERTED)' : ''}`);
        return textResult(lines.join('\n'));
    });
    server.tool('trading_responder_rules', 'List the active response rules that Trading Brain uses to automatically react to anomalies.', {}, async () => {
        const result = await call('responder.rules');
        if (!result?.length)
            return textResult('No response rules configured.');
        const lines = result.map((r, i) => `${i + 1}. [${r.action}] ${r.description}\n   Pattern: /${r.metric_pattern}/ | Min Severity: ${r.min_severity}${r.strategy ? ` | Strategy: ${r.strategy}.${r.parameter}` : ''}`);
        return textResult(lines.join('\n\n'));
    });
}
//# sourceMappingURL=responder-tools.js.map