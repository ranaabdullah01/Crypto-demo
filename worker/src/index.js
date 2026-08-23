import * as binance from './binance';
import * as strategy from './strategy';
import * as db from './database';
import * as api from './api';

export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);
            const path = url.pathname;

            console.log(`Request: ${request.method} ${path}`);

            const corsHeaders = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            };
            if (request.method === 'OPTIONS') {
                return new Response(null, { headers: corsHeaders });
            }

            let response;
            switch (path) {
                case '/api/status':
                    response = await api.handleStatus(env, request);
                    break;
                case '/api/signals':
                    response = await api.handleSignals(env, request);
                    break;
                case '/api/history':
                    response = await api.handleHistory(env, request);
                    break;
                case '/api/candles':
                    response = await api.handleCandles(env, request);
                    break;
                case '/api/admin/reset-history':
                    response = await api.handleResetHistory(env, request);
                    break;
                default:
                    response = new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
            }

            const newHeaders = new Headers(response.headers);
            for (const [key, value] of Object.entries(corsHeaders)) {
                newHeaders.set(key, value);
            }
            if (!newHeaders.has('Content-Type')) {
                newHeaders.set('Content-Type', 'application/json');
            }
            return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: newHeaders
            });

        } catch (err) {
            console.error('Unhandled error in fetch:', err);
            return new Response(JSON.stringify({
                error: 'Internal server error',
                details: err.message
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    },

    async scheduled(event, env, ctx) {
        console.log('Cron trigger started');
        try {
            await processNewCandle(env);
            console.log('Cron processed successfully');
        } catch (err) {
            console.error('Cron error:', err);
        }
    }
};

async function processNewCandle(env) {
    const symbol = env.SYMBOL || 'ETHUSDT';
    const timeframe = env.TIMEFRAME || '15m';
    const limit = env.CANDLE_LIMIT || 10;

    const allCandles = await binance.fetchClosedCandles(symbol, timeframe, limit);
    if (allCandles.length === 0) {
        console.log('No closed candles available');
        return;
    }

    const latestCandle = allCandles[allCandles.length - 1];
    if (!latestCandle) return;

    const state = await db.getBotState(env);
    const lastProcessed = state.last_closed_candle_time;

    if (latestCandle.openTime <= lastProcessed) {
        console.log('No new candle since last process');
        return;
    }

    const newCandles = allCandles.filter(c => c.openTime > lastProcessed);
    console.log(`Processing ${newCandles.length} new candles`);

    let currentState = state;
    for (const candle of newCandles) {
        // Evaluate pending trade
        if (currentState.pending_trade === 1 && currentState.last_prediction_direction) {
            const predictedColor = currentState.last_prediction_direction === 'BUY' ? 'green' : 'red';
            const actualColor = candle.color;
            const result = strategy.evaluateTrade(predictedColor, actualColor);
            const isWin = result === 'WIN';

            if (isWin) {
                currentState.wins++;
                currentState.consecutive_losses = 0;
            } else {
                currentState.losses++;
                currentState.consecutive_losses++;
                if (currentState.consecutive_losses >= 1) {
                    currentState.current_strategy = strategy.switchStrategy(currentState.current_strategy);
                    currentState.consecutive_losses = 0;
                }
            }

            if (currentState.pending_signal_id) {
                await db.evaluateSignal(env, currentState.pending_signal_id, result, candle.close, candle.openTime);
            }

            currentState.pending_trade = 0;
            currentState.last_prediction_direction = null;
            currentState.pending_signal_id = null;
        }

        // Generate new signal using the last 6 closed candles
        const currentCandles = allCandles.slice(-6);
        if (currentCandles.length >= 6) {
            const c1 = currentCandles[0].color;
            const c4 = currentCandles[3].color;
            const predictedColor = strategy.getPrediction(c1, c4, currentState.current_strategy);
            if (predictedColor) {
                const direction = strategy.colorToDirection(predictedColor);
                const created_at = Date.now();
                const signalId = await db.insertPendingSignal(env, symbol, timeframe, direction, currentState.current_strategy, created_at);
                currentState.pending_trade = 1;
                currentState.last_prediction_direction = direction;
                currentState.pending_signal_id = signalId;
                console.log(`Generated new ${direction} signal (strategy ${currentState.current_strategy})`);
            }
        }

        currentState.last_closed_candle_time = candle.openTime;
    }

    await db.updateBotState(env, currentState);
    console.log('State updated');
}
