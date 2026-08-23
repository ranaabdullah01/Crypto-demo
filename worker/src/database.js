// D1 database helpers

/**
 * Get bot state (ensure one row exists)
 */
export async function getBotState(env) {
    const result = await env.DB.prepare('SELECT * FROM bot_state WHERE id = 1').first();
    if (!result) {
        // Initialize state
        const now = Date.now();
        await env.DB.prepare(`
            INSERT INTO bot_state (id, symbol, timeframe, current_strategy, consecutive_losses, pending_trade, last_closed_candle_time, wins, losses, updated_at)
            VALUES (1, ?, ?, 1, 0, 0, 0, 0, 0, ?)
        `).bind(env.SYMBOL, env.TIMEFRAME, now).run();
        return await getBotState(env);
    }
    return result;
}

/**
 * Update bot state (full update)
 */
export async function updateBotState(env, state) {
    const now = Date.now();
    await env.DB.prepare(`
        UPDATE bot_state SET
            current_strategy = ?,
            consecutive_losses = ?,
            pending_trade = ?,
            last_prediction_direction = ?,
            pending_signal_id = ?,
            last_closed_candle_time = ?,
            wins = ?,
            losses = ?,
            updated_at = ?
        WHERE id = 1
    `).bind(
        state.current_strategy,
        state.consecutive_losses,
        state.pending_trade ? 1 : 0,
        state.last_prediction_direction,
        state.pending_signal_id,
        state.last_closed_candle_time,
        state.wins,
        state.losses,
        now
    ).run();
}

/**
 * Insert a new pending signal
 * Returns the inserted signal id
 */
export async function insertPendingSignal(env, symbol, timeframe, direction, strategy, created_at) {
    const result = await env.DB.prepare(`
        INSERT INTO signals (symbol, timeframe, signal_direction, strategy, created_at)
        VALUES (?, ?, ?, ?, ?)
        RETURNING id
    `).bind(symbol, timeframe, direction, strategy, created_at).first();
    return result.id;
}

/**
 * Evaluate a pending signal (update with result and result_price)
 */
export async function evaluateSignal(env, signalId, result, resultPrice, evalCandleTime) {
    const now = Date.now();
    await env.DB.prepare(`
        UPDATE signals SET
            result = ?,
            result_price = ?,
            candle_time = ?,
            updated_at = ?
        WHERE id = ?
    `).bind(result, resultPrice, evalCandleTime, now, signalId).run();
}

/**
 * Get signals history (last N)
 */
export async function getSignalsHistory(env, symbol, timeframe, limit = 50) {
    const rows = await env.DB.prepare(`
        SELECT * FROM signals
        WHERE symbol = ? AND timeframe = ? AND result IS NOT NULL
        ORDER BY candle_time DESC
        LIMIT ?
    `).bind(symbol, timeframe, limit).all();
    return rows.results;
}

/**
 * Get latest pending signal (if any)
 */
export async function getLatestPendingSignal(env, symbol, timeframe) {
    const row = await env.DB.prepare(`
        SELECT * FROM signals
        WHERE symbol = ? AND timeframe = ? AND result IS NULL
        ORDER BY created_at DESC
        LIMIT 1
    `).bind(symbol, timeframe).first();
    return row;
}

/**
 * Reset history and state
 */
export async function resetBot(env) {
    const now = Date.now();
    // Delete all signals for this symbol/timeframe
    await env.DB.prepare(`
        DELETE FROM signals WHERE symbol = ? AND timeframe = ?
    `).bind(env.SYMBOL, env.TIMEFRAME).run();
    // Reset bot state
    await env.DB.prepare(`
        UPDATE bot_state SET
            current_strategy = 1,
            consecutive_losses = 0,
            pending_trade = 0,
            last_prediction_direction = NULL,
            pending_signal_id = NULL,
            last_closed_candle_time = 0,
            wins = 0,
            losses = 0,
            updated_at = ?
        WHERE id = 1
    `).bind(now).run();
}
