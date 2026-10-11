function textResult(data) {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return { content: [{ type: 'text', text }] };
}
export function registerLLMTools(server, ipc) {
    registerLLMToolsWithCaller(server, (method, params) => ipc.request(method, params));
}
export function registerLLMToolsDirect(server, router) {
    registerLLMToolsWithCaller(server, (method, params) => router.handle(method, params));
}
function registerLLMToolsWithCaller(server, call) {
    server.tool('trading_llm_status', 'Get LLM service status: token usage, cache stats, rate limits, budget remaining', {}, async () => {
        const stats = await call('llm.status', {});
        const lines = [
            '# LLM Service Status',
            `**Model:** ${stats.model} | **Available:** ${stats.totalCalls > 0 || stats.budgetRemainingHour > 0 ? 'Yes' : 'No API Key'}`,
            '',
            '## Usage',
            `- **Total Calls:** ${stats.totalCalls} | **Total Tokens:** ${stats.totalTokens.toLocaleString()}`,
            `- **This Hour:** ${stats.callsThisHour} calls, ${stats.tokensThisHour.toLocaleString()} tokens`,
            `- **Today:** ${stats.tokensToday.toLocaleString()} tokens`,
            `- **Avg Latency:** ${Math.round(stats.averageLatencyMs)}ms`,
            '',
            '## Budget',
            `- **Hourly Remaining:** ${stats.budgetRemainingHour.toLocaleString()} tokens`,
            `- **Daily Remaining:** ${stats.budgetRemainingDay.toLocaleString()} tokens`,
            '',
            '## Cache',
            `- **Hits:** ${stats.cacheHits} | **Misses:** ${stats.cacheMisses}`,
            `- **Hit Rate:** ${(stats.cacheHitRate * 100).toFixed(1)}%`,
            '',
            '## Issues',
            `- **Rate Limit Hits:** ${stats.rateLimitHits} | **Errors:** ${stats.errors}`,
            stats.lastCallAt ? `- **Last Call:** ${new Date(stats.lastCallAt).toISOString()}` : '- *No calls yet*',
        ];
        return textResult(lines.join('\n'));
    });
    server.tool('trading_llm_usage', 'Get LLM token usage breakdown by template (explain, ask, debate, hypothesis, etc.)', {}, async () => {
        const [history, byTemplate] = await Promise.all([
            call('llm.history', { hours: 24 }),
            call('llm.byTemplate', {}),
        ]);
        const lines = ['# LLM Usage Report', ''];
        if (byTemplate?.length > 0) {
            lines.push('## By Template');
            lines.push('| Template | Calls | Tokens | Avg Tokens |');
            lines.push('|----------|-------|--------|------------|');
            for (const t of byTemplate) {
                lines.push(`| ${t.template} | ${t.calls} | ${t.tokens.toLocaleString()} | ${Math.round(t.avg_tokens)} |`);
            }
            lines.push('');
        }
        if (history?.length > 0) {
            lines.push('## Last 24h (by hour)');
            lines.push('| Hour | Calls | Tokens | Cached |');
            lines.push('|------|-------|--------|--------|');
            for (const h of history.slice(0, 12)) {
                lines.push(`| ${h.hour} | ${h.calls} | ${h.tokens.toLocaleString()} | ${h.cached} |`);
            }
        }
        return textResult(lines.join('\n'));
    });
}
//# sourceMappingURL=llm-tools.js.map