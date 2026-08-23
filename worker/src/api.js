import * as binance from './binance';
import * as db from './database';

export async function handleStatus(env, request) {
    try {
        const state = await db.getBotState(env);
        const pendingSignal = await db.getLatestPendingSignal(env, env.SYMBOL, env.TIMEFRAME);
        const currentPrice = await binance.fetchLivePrice(env.SYMBOL);
        return new Response(JSON.stringify({
            strategy: state.current_strategy,
            consecutive_losses: state.consecutive_losses,
            pending_trade: state.pending_trade === 1,
            last_prediction_direction: state.last_prediction_direction,
            wins: state.wins,
            losses: state.losses,
            last_closed_candle_time: state.last_closed_candle_time,
            current_price: currentPrice,
            pending_signal: pendingSignal
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error('handleStatus error:', err);
        // Return a simple error message without stack to avoid any issues
        return new Response(JSON.stringify({ error: err.message || 'Unknown error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function handleSignals(env, request) {
    try {
        const pending = await db.getLatestPendingSignal(env, env.SYMBOL, env.TIMEFRAME);
        const history = await db.getSignalsHistory(env, env.SYMBOL, env.TIMEFRAME, 30);
        return new Response(JSON.stringify({ pending, history }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message || 'Unknown error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function handleHistory(env, request) {
    try {
        const history = await db.getSignalsHistory(env, env.SYMBOL, env.TIMEFRAME, 50);
        return new Response(JSON.stringify({ history }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message || 'Unknown error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function handleCandles(env, request) {
    try {
        const candles = await binance.fetchClosedCandles(env.SYMBOL, env.TIMEFRAME, env.CANDLE_LIMIT);
        const last6 = candles.slice(-6).map(c => ({
            openTime: c.openTime,
            open: c.open,
            close: c.close,
            color: c.color
        }));
        return new Response(JSON.stringify({ candles: last6 }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message || 'Unknown error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function handleResetHistory(env, request) {
    try {
        await db.resetBot(env);
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message || 'Unknown error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
