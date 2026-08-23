import * as binance from './binance';
import * as strategy from './strategy';
import * as db from './database';
import * as api from './api';
import * as auth from './auth';

export default {
    // HTTP API
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // CORS headers (allow frontend)
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        };
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        let response;
        try {
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
                case '/api/login':
                    response = await api.handleLogin(env, request);
                    break;
                case '/api/logout':
                    response = await api.handleLogout(env, request);
                    break;
                case '/api/admin/reset-history':
                    response = await api.handleResetHistory(env, request);
                    break;
                case '/api/admin/reset-credentials':
                    response = await api.handleResetCredentials(env, request);
                    break;
                default:
                    response = api.notFound();
            }
        } catch (err) {
            console.error('API error:', err);
            response = new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
        }

        // Add CORS headers to response
        const newHeaders = new Headers(response.headers);
        for (const [key, value] of Object.entries(corsHeaders)) {
            newHeaders.set(key, value);
        }
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
        });
    },

    // Cron trigger (every minute)
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

/**
 * Main business logic: check for new closed candle, evaluate pending trade, generate new signal.
 */
async function processNewCandle(env) {
    const symbol = env.SYMBOL;
    const timeframe = env.TIMEFRAME;

    // 1. Fetch closed candles from Binance
    const allCandles = await binance.fetchClosedCandles(symbol, timeframe, env.CANDLE_LIMIT || 10);
    if (allCandles.length === 0) {
        console.log('No closed candles available');
        return;
    }

    // 2. Get latest closed candle (max openTime)
    const latestCandle = allCandles[allCandles.length - 1];
    if (!latestCandle) return;

    // 3. Get bot state
    const state = await db.getBotState(env);
    const lastProcessed = state.last_closed_candle_time;

    // 4. If latest candle already processed, exit
    if (latestCandle.openTime <= lastProcessed) {
        console.log('No new candle since last process');
        return;
    }

    // 5. Process new candle(s): we will process only the latest one (or all new?)
    // For safety, we process all candles that are newer than lastProcessed.
    // But we need to evaluate only once per candle. We'll loop from lastProcessed+1 to latest.
    // However, we might have missed multiple candles if cron was down; we process them in order.
    const newCandles = allCandles.filter(c => c.openTime > lastProcessed);
    console.log(`Processing ${newCandles.length} new candles`);

    // We'll iterate through each new candle chronologically.
    // For each candle, we evaluate pending trade (if any) and then generate new signal.
    // We need to keep state updated between candles.
    let currentState = state;
    for (const candle of newCandles) {
        // Evaluate pending trade using this candle
        if (currentState.pending_trade === 1 && currentState.last_prediction_direction) {
            const predictedColor = currentState.last_prediction_direction === 'BUY' ? 'green' : 'red';
            const actualColor = candle.color;
            const result = strategy.evaluateTrade(predictedColor, actualColor);
            const isWin = result === 'WIN';

            // Update wins/losses
            if (isWin) {
                currentState.wins++;
                currentState.consecutive_losses = 0;
            } else {
                currentState.losses++;
                currentState.consecutive_losses++;
                // Switch strategy if consecutive_losses >= 1
                if (currentState.consecutive_losses >= 1) {
                    currentState.current_strategy = strategy.switchStrategy(currentState.current_strategy);
                    currentState.consecutive_losses = 0;
                }
            }

            // Update the pending signal in DB with result
            if (currentState.pending_signal_id) {
                const resultPrice = candle.close;
                await db.evaluateSignal(env, currentState.pending_signal_id, result, resultPrice, candle.openTime);
            }

            // Clear pending trade flag
            currentState.pending_trade = 0;
            currentState.last_prediction_direction = null;
            currentState.pending_signal_id = null;
        }

        // After evaluation, generate a new signal using the most recent 6 closed candles
        // We need the latest 6 closed candles (including the one just processed)
        const currentCandles = allCandles.slice(-6); // take last 6 (most recent) – these are closed
        if (currentCandles.length >= 6) {
            // c1 = first element (oldest), c4 = fourth element (index 3)
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
            } else {
                console.log('No prediction generated (c1/c4 combination not recognized)');
            }
        } else {
            console.log('Not enough closed candles for prediction');
        }

        // Update last processed candle time
        currentState.last_closed_candle_time = candle.openTime;
    }

    // Save final state
    await db.updateBotState(env, currentState);
    console.log('State updated');
}
