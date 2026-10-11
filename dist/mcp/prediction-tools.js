import { z } from 'zod';
function textResult(data) {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return { content: [{ type: 'text', text }] };
}
/** Register prediction tools using IPC client (for stdio MCP transport) */
export function registerPredictionTools(server, ipc) {
    registerPredictionToolsWithCaller(server, (method, params) => ipc.request(method, params));
}
/** Register prediction tools using router directly (for HTTP MCP transport inside daemon) */
export function registerPredictionToolsDirect(server, router) {
    registerPredictionToolsWithCaller(server, (method, params) => router.handle(method, params));
}
function registerPredictionToolsWithCaller(server, call) {
    server.tool('trading_predict', 'Generate a trading prediction for a specific metric. Uses Holt-Winters / EWMA with auto-calibration. Predicts win rates, PnL trends, signal counts.', {
        metric: z.string().describe('Metric name (e.g. "trade_win_rate", "trade_pnl", "signal_count")'),
        domain: z.enum(['error', 'trade', 'engagement', 'metric', 'custom']).optional().describe('Prediction domain (default: trade)'),
        reasoning: z.string().optional().describe('Human-readable reason for the prediction'),
    }, async (params) => {
        const result = await call('predict.make', {
            domain: params.domain ?? 'trade',
            metric: params.metric,
            reasoning: params.reasoning,
        });
        if (!result)
            return textResult('Not enough data to generate prediction (need ≥ 2 data points).');
        const lines = [
            `Trading Prediction: ${result.metric}`,
            `  Direction: ${result.predicted_direction}`,
            `  Value: ${result.predicted_value?.toFixed?.(4) ?? result.predicted_value}`,
            `  Confidence: ${((result.confidence ?? 0) * 100).toFixed(1)}%`,
            `  Method: ${result.method}`,
            `  Horizon: ${((result.horizon_ms ?? 0) / 60_000).toFixed(0)} min`,
            `  ID: ${result.prediction_id}`,
        ];
        return textResult(lines.join('\n'));
    });
    server.tool('trading_prediction_accuracy', 'Get trading prediction accuracy statistics: hit rate, mean error, calibration. Shows how good the trading brain is at forecasting.', {
        domain: z.enum(['error', 'trade', 'engagement', 'metric', 'custom']).optional().describe('Filter by domain'),
    }, async (params) => {
        const accuracy = await call('predict.accuracy', { domain: params.domain });
        if (!accuracy?.length)
            return textResult('No resolved predictions yet.');
        const lines = ['Trading Prediction Accuracy:\n'];
        for (const a of accuracy) {
            lines.push(`  ${a.domain}: ${((a.accuracy_rate ?? 0) * 100).toFixed(1)}% accuracy (${a.correct}/${a.total - (a.expired ?? 0)} resolved)`);
            lines.push(`    Direction: ${((a.direction_accuracy ?? 0) * 100).toFixed(1)}% | MAE: ${(a.mean_absolute_error ?? 0).toFixed(4)} | Calibration: ${((a.calibration_score ?? 0) * 100).toFixed(1)}%`);
        }
        return textResult(lines.join('\n'));
    });
    server.tool('trading_predictions_list', 'List recent trading predictions with status (pending/correct/wrong/partial/expired).', {
        domain: z.enum(['error', 'trade', 'engagement', 'metric', 'custom']).optional(),
        status: z.enum(['pending', 'correct', 'wrong', 'expired', 'partial']).optional(),
        limit: z.number().optional().describe('Max results (default: 20)'),
    }, async (params) => {
        const predictions = await call('predict.list', {
            domain: params.domain,
            status: params.status,
            limit: params.limit ?? 20,
        });
        if (!predictions?.length)
            return textResult('No predictions yet.');
        const lines = [`Trading Predictions (${predictions.length}):\n`];
        for (const p of predictions) {
            const tag = p.status === 'correct' ? 'OK' : p.status === 'wrong' ? 'WRONG' : p.status === 'partial' ? 'PARTIAL' : p.status === 'expired' ? 'EXPIRED' : 'PENDING';
            lines.push(`  [${tag}] ${p.metric}: ${p.predicted_direction} to ${p.predicted_value?.toFixed?.(4) ?? p.predicted_value} (${((p.confidence ?? 0) * 100).toFixed(0)}%)`);
            if (p.actual_value != null)
                lines.push(`    Actual: ${p.actual_value?.toFixed?.(4) ?? p.actual_value} | Error: ${((p.error ?? 0) * 100).toFixed(1)}%`);
        }
        return textResult(lines.join('\n'));
    });
}
//# sourceMappingURL=prediction-tools.js.map