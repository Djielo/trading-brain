import { z } from 'zod';
function textResult(data) {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return { content: [{ type: 'text', text }] };
}
export function registerEmotionalTools(server, ipc) {
    registerEmotionalToolsWithCaller(server, (method, params) => ipc.request(method, params));
}
function registerEmotionalToolsWithCaller(server, call) {
    server.tool('trading_emotional_status', 'Get the trading brain\'s emotional state — mood, dimensions, and overall status for trading context.', {}, async () => {
        const status = await call('emotional.status');
        const mood = status.currentMood;
        const dims = mood.dimensions;
        const lines = [
            `## Trading Brain Emotional Status`,
            `**Mood:** ${mood.mood} (score: ${(mood.score * 100).toFixed(0)}%)`,
            `**Valence:** ${mood.valence > 0 ? '+' : ''}${mood.valence.toFixed(2)} | **Arousal:** ${mood.arousal.toFixed(2)}`,
            '',
            '### Dimensions',
            ...Object.entries(dims).map(([k, v]) => `- **${k}:** ${(v * 100).toFixed(0)}%`),
            '',
            `Cycles: ${status.cycleCount} | History: ${status.historyCount} entries`,
        ];
        return textResult(lines.join('\n'));
    });
    server.tool('trading_mood_history', 'Get the trading brain\'s emotional history — track mood evolution across trading cycles.', { limit: z.number().optional().default(20).describe('Number of history entries') }, async ({ limit }) => {
        const history = await call('emotional.history', { limit });
        if (history.length === 0)
            return textResult('No emotional history yet.');
        const lines = ['## Trading Mood History', ''];
        for (const entry of history) {
            lines.push(`**Cycle ${entry.cycle_number}** — ${entry.dominant_mood} (${(entry.mood_score * 100).toFixed(0)}%) | ${entry.timestamp}`);
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_mood_influences', 'See what caused recent mood changes in the trading brain — which signals shifted emotional dimensions.', { limit: z.number().optional().default(10).describe('Number of influences') }, async ({ limit }) => {
        const influences = await call('emotional.influences', { limit });
        if (influences.length === 0)
            return textResult('No mood influences recorded yet.');
        const lines = ['## Trading Mood Influences', ''];
        for (const inf of influences) {
            const delta = inf.delta;
            const arrow = delta > 0 ? '↑' : '↓';
            lines.push(`${arrow} **${inf.dimension}** ${(inf.old_value * 100).toFixed(0)}% → ${(inf.new_value * 100).toFixed(0)}% (${delta > 0 ? '+' : ''}${(delta * 100).toFixed(1)}%) — ${inf.source_engine}`);
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_mood_advice', 'Get trading-specific behavior recommendations based on current mood — e.g. reduce risk when anxious.', {}, async () => {
        const mood = await call('emotional.mood');
        const recs = await call('emotional.recommendations');
        const lines = [
            `## Trading Mood Advice (${mood.mood})`,
            '',
            ...recs.map((r, i) => `${i + 1}. ${r}`),
        ];
        return textResult(lines.join('\n'));
    });
}
//# sourceMappingURL=emotional-tools.js.map