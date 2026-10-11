import { z } from 'zod';
function textResult(data) {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return { content: [{ type: 'text', text }] };
}
export function registerGoalTools(server, ipc) {
    registerGoalToolsWithCaller(server, (method, params) => ipc.request(method, params));
}
export function registerGoalToolsDirect(server, router) {
    registerGoalToolsWithCaller(server, (method, params) => router.handle(method, params));
}
function registerGoalToolsWithCaller(server, call) {
    server.tool('trading_goal_status', 'Get Trading Brain goal tracking status: active/achieved/failed goals.', {}, async () => {
        const status = await call('goals.status', {});
        const lines = [
            '# Trading Goal Status',
            '',
            `**Total:** ${status.totalGoals} | **Active:** ${status.activeGoals} | **Achieved:** ${status.achievedGoals} | **Failed:** ${status.failedGoals}`,
        ];
        if (status.topActive?.length > 0) {
            lines.push('', '## Active Goals');
            for (const g of status.topActive) {
                const pct = g.targetValue > 0 ? ((g.currentValue / g.targetValue) * 100).toFixed(0) : '0';
                lines.push(`- **${g.title}** — ${g.metricName}: ${g.currentValue}/${g.targetValue} (${pct}%)`);
            }
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_goal_create', 'Create a new goal for Trading Brain to track autonomously.', {
        title: z.string(), metricName: z.string(), targetValue: z.number(), deadlineCycles: z.number(),
        type: z.enum(['metric_target', 'discovery', 'quality', 'custom']).optional(),
        priority: z.number().optional(),
    }, async (params) => {
        const goal = await call('goals.create', params);
        return textResult(`# Goal Created: ${goal.title}\nMetric: ${goal.metricName}, Target: ${goal.targetValue}, Deadline: ${goal.deadlineCycles} cycles, ID: ${goal.id}`);
    });
    server.tool('trading_goal_progress', 'Get detailed progress for a Trading Brain goal with forecast.', { goalId: z.number() }, async (params) => {
        const report = await call('goals.progress', params);
        if (!report)
            return textResult('Goal not found.');
        return textResult(`# ${report.goal.title}\nProgress: ${report.progressPercent.toFixed(1)}% | Trend: ${report.trend} | Data points: ${report.dataPoints}${report.estimatedCycles !== null ? `\nEstimated completion: cycle ${report.estimatedCycles}` : ''}`);
    });
}
//# sourceMappingURL=goal-tools.js.map