import { z } from 'zod';
function textResult(data) {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return { content: [{ type: 'text', text }] };
}
export function registerReasoningTools(server, ipc) {
    registerReasoningToolsWithCaller(server, (method, params) => ipc.request(method, params));
}
export function registerReasoningToolsDirect(server, router) {
    registerReasoningToolsWithCaller(server, (method, params) => router.handle(method, params));
}
function registerReasoningToolsWithCaller(server, call) {
    server.tool('trading_reasoning_status', 'Get Trading Brain reasoning engine status: rules, chains, confidence, domains.', {}, async () => {
        const status = await call('reasoning.status', {});
        const lines = [
            '# Trading Reasoning Status',
            '',
            `**Rules:** ${status.ruleCount} | **Chains:** ${status.chainCount} | **Recent (24h):** ${status.recentChains}`,
            `**Avg Confidence:** ${status.avgConfidence?.toFixed(3) ?? 'N/A'}`,
            `**Domains:** ${status.domains?.join(', ') || 'none'}`,
        ];
        return textResult(lines.join('\n'));
    });
    server.tool('trading_reason', 'Forward-chaining inference on Trading Brain knowledge: find logical chains from trading patterns.', { query: z.string().describe('Topic to reason about (e.g., "trade signals", "loss patterns")') }, async (params) => {
        const chain = await call('reasoning.infer', params);
        if (!chain)
            return textResult('No inference chain found.');
        const lines = [
            `# Trading Inference (${chain.steps?.length ?? 0} steps)`,
            '',
            `**Conclusion:** ${chain.conclusion}`,
            `**Confidence:** ${chain.final_confidence?.toFixed(3)}`,
        ];
        for (const step of (chain.steps ?? [])) {
            lines.push(`- ${step.antecedent} → ${step.consequent} (conf=${step.confidence?.toFixed(3)})`);
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_explain_why', 'Abductive reasoning on Trading Brain: explain why a trading observation occurred.', { observation: z.string().describe('Observation to explain (e.g., "loss streak", "signal failure")') }, async (params) => {
        const explanations = await call('reasoning.abduce', params);
        if (!explanations?.length)
            return textResult('No explanations found.');
        const lines = [`# Trading Explanations (${explanations.length})`, ''];
        for (const e of explanations) {
            lines.push(`- **${e.antecedent}** → ${e.consequent} (score=${e.score?.toFixed(3)})`);
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_what_if', 'Counterfactual: what if a trading event never happened — show downstream effects.', { event: z.string().describe('Event type (e.g., "trade:loss", "signal:breakout")') }, async (params) => {
        const result = await call('reasoning.counterfactual', params);
        return textResult(`# Trading What-If\n\n${result.narrative}\n\n**Affected:** ${result.affected_effects?.length ?? 0} effects`);
    });
}
//# sourceMappingURL=reasoning-tools.js.map