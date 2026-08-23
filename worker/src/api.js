import * as binance from './binance';
import * as strategy from './strategy';
import * as db from './database';
import * as auth from './auth';

// Helper to get authenticated user from request
async function getAuthenticatedUser(env, request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.slice(7);
    const username = await auth.validateSession(env, token);
    return username;
}

// API handlers

export async function handleStatus(env, request) {
    const state = await db.getBotState(env);
    // Also get latest pending signal if any
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
}

export async function handleSignals(env, request) {
    // Return latest signals (including pending)
    const pending = await db.getLatestPendingSignal(env, env.SYMBOL, env.TIMEFRAME);
    const history = await db.getSignalsHistory(env, env.SYMBOL, env.TIMEFRAME, 30);
    return new Response(JSON.stringify({
        pending,
        history
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function handleHistory(env, request) {
    const history = await db.getSignalsHistory(env, env.SYMBOL, env.TIMEFRAME, 50);
    return new Response(JSON.stringify({ history }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function handleCandles(env, request) {
    // Fetch latest closed candles from Binance (via Worker)
    const candles = await binance.fetchClosedCandles(env.SYMBOL, env.TIMEFRAME, env.CANDLE_LIMIT);
    // Return last 6 closed candles (for display)
    const last6 = candles.slice(-6).map(c => ({
        openTime: c.openTime,
        open: c.open,
        close: c.close,
        color: c.color
    }));
    return new Response(JSON.stringify({ candles: last6 }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function handleLogin(env, request) {
    const { username, password } = await request.json();
    if (!username || !password) {
        return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 400 });
    }
    const user = await auth.authenticateUser(env, username, password);
    if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }
    const token = await auth.createSession(env, username);
    return new Response(JSON.stringify({ token, username }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function handleLogout(env, request) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        await auth.deleteSession(env, token);
    }
    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function handleResetHistory(env, request) {
    const username = await getAuthenticatedUser(env, request);
    if (!username) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    // Optionally check if user is admin (we only have one user)
    await db.resetBot(env);
    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function handleResetCredentials(env, request) {
    // Requires master password
    const { masterPassword, newUsername, newPassword } = await request.json();
    if (!masterPassword || !newUsername || !newPassword) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }
    try {
        await auth.resetCredentials(env, masterPassword, newUsername, newPassword);
        return new Response(JSON.stringify({ success: true, username: newUsername }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }
}

// 404 handler
export function notFound() {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
}
