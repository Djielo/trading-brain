import { z } from 'zod';
function textResult(data) {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return { content: [{ type: 'text', text }] };
}
export function registerEvolutionTools(server, ipc) {
    registerEvolutionToolsWithCaller(server, (method, params) => ipc.request(method, params));
}
export function registerEvolutionToolsDirect(server, router) {
    registerEvolutionToolsWithCaller(server, (method, params) => router.handle(method, params));
}
function registerEvolutionToolsWithCaller(server, call) {
    server.tool('trading_evolution_status', 'Get Trading Brain evolution engine status: generation, population, best fitness, champion.', {}, async () => {
        const status = await call('evolution.status', {});
        const lines = [
            '# Trading Evolution Status',
            '',
            `**Generation:** ${status.currentGeneration} | **Population:** ${status.populationSize} | **Initialized:** ${status.isInitialized}`,
            `**Best Fitness:** ${status.bestFitness?.toFixed(3) ?? 'N/A'} | **Avg Fitness:** ${status.avgFitness?.toFixed(3) ?? 'N/A'}`,
        ];
        if (status.champion) {
            lines.push('', `**Champion:** fitness=${status.champion.fitness?.toFixed(3)}, gen=${status.champion.generation}`);
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_evolution_history', 'Get Trading Brain evolution generation history.', { limit: z.number().optional() }, async (params) => {
        const history = await call('evolution.history', params);
        if (!history?.length)
            return textResult('No evolution history yet.');
        const lines = ['# Trading Evolution History', '', '| Gen | Best | Avg | Diversity |', '|-----|------|-----|-----------|'];
        for (const g of history) {
            lines.push(`| ${g.generation} | ${g.bestFitness.toFixed(3)} | ${g.avgFitness.toFixed(3)} | ${g.diversity.toFixed(3)} |`);
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_evolution_best', 'Get the best-performing individual from Trading Brain evolution.', {}, async () => {
        const best = await call('evolution.best', {});
        if (!best)
            return textResult('No individuals yet.');
        const lines = [`# Trading Champion (Gen ${best.generation})`, '', `**Fitness:** ${best.fitness.toFixed(3)} | **Mutations:** ${best.mutationCount}`];
        for (const [key, val] of Object.entries(best.genome)) {
            lines.push(`- \`${key}\`: ${val.toFixed(4)}`);
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_evolution_run', 'Manually trigger a Trading Brain evolution generation.', {}, async () => {
        const gen = await call('evolution.run', {});
        return textResult(`# Trading Gen #${gen.generation}\nBest: ${gen.bestFitness.toFixed(3)} | Avg: ${gen.avgFitness.toFixed(3)} | Diversity: ${gen.diversity.toFixed(3)}`);
    });
}
//# sourceMappingURL=evolution-tools.js.map