const SYMBOL = "ETHUSDT";
const TIMEFRAME = "15m";
const HISTORY_LIMIT = 100;

/*
============================================================
CORS
============================================================
*/

function corsHeaders(origin = "*") {
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json; charset=utf-8"
    };
}

function json(data, status = 200, origin = "*") {
    return new Response(JSON.stringify(data), {
        status,
        headers: corsHeaders(origin)
    });
}

/*
============================================================
COOKIE HELPERS
============================================================
*/

function getCookie(request, name) {
    const cookie = request.headers.get("Cookie") || "";

    const match = cookie.match(
        new RegExp(
            "(?:^|;\\s*)" +
            name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
            "=([^;]*)"
        )
    );

    return match ? decodeURIComponent(match[1]) : null;
}

function randomToken() {
    return crypto.randomUUID() + crypto.randomUUID();
}

function sessionCookie(token) {
    return (
        `session=${encodeURIComponent(token)}; ` +
        `HttpOnly; Secure; SameSite=None; Path=/; Max-Age=86400`
    );
}

function clearSessionCookie() {
    return (
        "session=; HttpOnly; Secure; " +
        "SameSite=None; Path=/; Max-Age=0"
    );
}

/*
============================================================
BINANCE
============================================================
*/

async function getBinanceCandles() {

    const url =
        `https://api.binance.com/api/v3/klines` +
        `?symbol=${SYMBOL}` +
        `&interval=${TIMEFRAME}` +
        `&limit=7`;

    const response = await fetch(url, {
        headers: {
            "Accept": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(
            `Binance candles request failed: ${response.status}`
        );
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length < 7) {
        throw new Error(
            "Invalid Binance candle response"
        );
    }

    /*
    Binance returns the current unfinished candle
    as the final item.

    We remove it and work only with closed candles.
    */

    const closedCandles = data.slice(0, -1);

    return closedCandles.map(candle => {

        const open = Number(candle[1]);
        const high = Number(candle[2]);
        const low = Number(candle[3]);
        const close = Number(candle[4]);
        const volume = Number(candle[5]);

        return {
            open,
            high,
            low,
            close,
            volume,

            rawTime: Number(candle[0]),
            closeTime: Number(candle[6]),

            color:
                close >= open
                    ? "green"
                    : "red"
        };
    });
}

async function getLivePrice() {

    const response = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${SYMBOL}`
    );

    if (!response.ok) {
        throw new Error(
            `Binance price request failed: ${response.status}`
        );
    }

    const data = await response.json();

    if (!data.price) {
        throw new Error(
            "Invalid Binance price response"
        );
    }

    return Number(data.price);
}

/*
============================================================
STRATEGY
============================================================

Strategy #01 — HYBRID

red + red       => SELL
green + green   => BUY
red + green     => SELL
green + red     => BUY


Strategy #02 — TURBO

red + red       => BUY
green + green   => SELL
red + green     => BUY
green + red     => SELL
============================================================
*/

function getPrediction(c1, c4, strategy) {

    if (strategy === 1) {

        if (
            c1 === "red" &&
            c4 === "red"
        ) {
            return "red";
        }

        if (
            c1 === "green" &&
            c4 === "green"
        ) {
            return "green";
        }

        if (
            c1 === "red" &&
            c4 === "green"
        ) {
            return "red";
        }

        if (
            c1 === "green" &&
            c4 === "red"
        ) {
            return "green";
        }

    } else {

        if (
            c1 === "red" &&
            c4 === "red"
        ) {
            return "green";
        }

        if (
            c1 === "green" &&
            c4 === "green"
        ) {
            return "red";
        }

        if (
            c1 === "red" &&
            c4 === "green"
        ) {
            return "green";
        }

        if (
            c1 === "green" &&
            c4 === "red"
        ) {
            return "red";
        }
    }

    return null;
}

function strategyName(strategy) {

    return strategy === 1
        ? "HYBRID"
        : "TURBO";
}

/*
============================================================
BOT STATE
============================================================
*/

async function getBotState(env) {

    let state = await env.DB.prepare(`
        SELECT *
        FROM bot_state
        WHERE symbol = ?
          AND timeframe = ?
        LIMIT 1
    `)
        .bind(
            SYMBOL,
            TIMEFRAME
        )
        .first();

    if (!state) {

        const now = Date.now();

        await env.DB.prepare(`
            INSERT INTO bot_state (
                symbol,
                timeframe,
                current_strategy,
                consecutive_losses,
                pending_trade,
                last_trade_direction,
                last_prediction,
                last_closed_candle_time,
                updated_at
            )
            VALUES (
                ?,
                ?,
                1,
                0,
                0,
                NULL,
                NULL,
                NULL,
                ?
            )
        `)
            .bind(
                SYMBOL,
                TIMEFRAME,
                now
            )
            .run();

        state = await env.DB.prepare(`
            SELECT *
            FROM bot_state
            WHERE symbol = ?
              AND timeframe = ?
            LIMIT 1
        `)
            .bind(
                SYMBOL,
                TIMEFRAME
            )
            .first();
    }

    return state;
}

async function saveBotState(env, state) {

    await env.DB.prepare(`
        UPDATE bot_state
        SET
            current_strategy = ?,
            consecutive_losses = ?,
            pending_trade = ?,
            last_trade_direction = ?,
            last_prediction = ?,
            last_closed_candle_time = ?,
            updated_at = ?
        WHERE symbol = ?
          AND timeframe = ?
    `)
        .bind(
            state.current_strategy,
            state.consecutive_losses,
            state.pending_trade,
            state.last_trade_direction,
            state.last_prediction,
            state.last_closed_candle_time,
            Date.now(),
            SYMBOL,
            TIMEFRAME
        )
        .run();
}

/*
============================================================
OPEN SIGNAL
============================================================
*/

async function getOpenSignal(env) {

    return await env.DB.prepare(`
        SELECT *
        FROM signals
        WHERE symbol = ?
          AND timeframe = ?
          AND result IS NULL
        ORDER BY candle_time DESC
        LIMIT 1
    `)
        .bind(
            SYMBOL,
            TIMEFRAME
        )
        .first();
}

/*
============================================================
EVALUATE PREVIOUS SIGNAL
============================================================
*/

async function evaluatePreviousSignal(
    env,
    latestCandle,
    state
) {

    if (
        Number(state.pending_trade) !== 1 ||
        !state.last_trade_direction
    ) {
        return null;
    }

    const previous =
        await getOpenSignal(env);

    if (!previous) {
        return null;
    }

    /*
    green = BUY
    red   = SELL

    Matching the predicted candle color
    means WIN.
    */

    const isWin =
        state.last_trade_direction ===
        latestCandle.color;

    const result =
        isWin
            ? "WIN"
            : "LOSS";

    await env.DB.prepare(`
        UPDATE signals
        SET
            result = ?,
            result_price = ?
        WHERE id = ?
    `)
        .bind(
            result,
            latestCandle.close,
            previous.id
        )
        .run();

    if (isWin) {

        state.consecutive_losses = 0;

    } else {

        state.consecutive_losses =
            Number(
                state.consecutive_losses
            ) + 1;

        /*
        Switch strategy after one loss.
        */

        if (
            state.consecutive_losses >= 1
        ) {

            state.current_strategy =
                Number(
                    state.current_strategy
                ) === 1
                    ? 2
                    : 1;

            state.consecutive_losses = 0;
        }
    }

    state.pending_trade = 0;
    state.last_trade_direction = null;
    state.last_prediction = null;

    return {
        result,
        resultPrice:
            latestCandle.close,
        previousSignalId:
            previous.id
    };
}

/*
============================================================
PROCESS NEW CANDLE
============================================================
*/

async function processNewCandle(env) {

    const candles =
        await getBinanceCandles();

    if (candles.length < 6) {
        throw new Error(
            "Not enough closed candles"
        );
    }

    const latest =
        candles[candles.length - 1];

    const state =
        await getBotState(env);

    /*
    Never process the same closed candle twice.
    */

    if (
        state.last_closed_candle_time !== null &&
        Number(
            state.last_closed_candle_time
        ) === Number(
            latest.rawTime
        )
    ) {

        return {
            processed: false,
            reason:
                "CANDLE_ALREADY_PROCESSED",
            state
        };
    }

    /*
    Evaluate previous trade.
    */

    const evaluated =
        await evaluatePreviousSignal(
            env,
            latest,
            state
        );

    /*
    Generate new prediction.
    */

    const c1 =
        candles[0];

    const c4 =
        candles[3];

    const prediction =
        getPrediction(
            c1.color,
            c4.color,
            Number(
                state.current_strategy
            )
        );

    state.last_closed_candle_time =
        latest.rawTime;

    /*
    No prediction.
    */

    if (!prediction) {

        state.pending_trade = 0;
        state.last_prediction = null;

        await saveBotState(
            env,
            state
        );

        return {
            processed: true,
            signal: "NEUTRAL",
            evaluated,
            state
        };
    }

    /*
    Convert prediction to BUY / SELL.
    */

    const signal =
        prediction === "green"
            ? "BUY"
            : "SELL";

    const strategy =
        Number(
            state.current_strategy
        );

    /*
    Save signal.
    */

    await env.DB.prepare(`
        INSERT OR IGNORE INTO signals (
            symbol,
            timeframe,
            candle_time,
            signal,
            strategy,
            strategy_name,
            entry_price,
            result,
            result_price,
            created_at
        )
        VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            NULL,
            NULL,
            ?
        )
    `)
        .bind(
            SYMBOL,
            TIMEFRAME,
            latest.rawTime,
            signal,
            strategy,
            strategyName(strategy),
            latest.close,
            Date.now()
        )
        .run();

    state.pending_trade = 1;

    state.last_trade_direction =
        prediction;

    state.last_prediction =
        prediction;

    await saveBotState(
        env,
        state
    );

    return {
        processed: true,
        signal,
        strategy,
        strategyName:
            strategyName(strategy),
        evaluated,
        candle: latest,
        state
    };
}

/*
============================================================
AUTHENTICATION
============================================================

Create these Cloudflare Worker Secrets:

BOT_USERNAME
BOT_PASSWORD
ADMIN_MASTER_PASSWORD

Never put the actual values in GitHub.
============================================================
*/

async function requireSession(
    request,
    env
) {

    const token =
        getCookie(
            request,
            "session"
        );

    if (!token) {
        return false;
    }

    const session =
        await env.DB.prepare(`
            SELECT token
            FROM sessions
            WHERE token = ?
              AND expires_at > ?
            LIMIT 1
        `)
            .bind(
                token,
                Date.now()
            )
            .first();

    return !!session;
}

/*
============================================================
LOGIN
============================================================
*/

async function login(
    request,
    env,
    origin
) {

    const body =
        await request.json();

    const username =
        String(
            body.username || ""
        );

    const password =
        String(
            body.password || ""
        );

    if (
        !env.BOT_USERNAME ||
        !env.BOT_PASSWORD
    ) {

        return json({
            ok: false,
            error:
                "BOT_USERNAME and BOT_PASSWORD are not configured."
        }, 500, origin);
    }

    if (
        username !==
        env.BOT_USERNAME ||
        password !==
        env.BOT_PASSWORD
    ) {

        return json({
            ok: false,
            error:
                "Invalid username or password."
        }, 401, origin);
    }

    const token =
        randomToken();

    const expiresAt =
        Date.now() +
        86400000;

    await env.DB.prepare(`
        INSERT INTO sessions (
            token,
            expires_at,
            created_at
        )
        VALUES (
            ?,
            ?,
            ?
        )
    `)
        .bind(
            token,
            expiresAt,
            Date.now()
        )
        .run();

    return new Response(
        JSON.stringify({
            ok: true,
            username
        }),
        {
            status: 200,

            headers: {
                ...corsHeaders(origin),
                "Set-Cookie":
                    sessionCookie(token)
            }
        }
    );
}

/*
============================================================
LOGOUT
============================================================
*/

async function logout(
    request,
    env,
    origin
) {

    const token =
        getCookie(
            request,
            "session"
        );

    if (token) {

        await env.DB.prepare(`
            DELETE FROM sessions
            WHERE token = ?
        `)
            .bind(token)
            .run();
    }

    return new Response(
        JSON.stringify({
            ok: true
        }),
        {
            status: 200,

            headers: {
                ...corsHeaders(origin),
                "Set-Cookie":
                    clearSessionCookie()
            }
        }
    );
}

/*
============================================================
API HANDLER
============================================================
*/

async function handleApi(
    request,
    env
) {

    const origin =
        request.headers.get(
            "Origin"
        ) || "*";

    const url =
        new URL(
            request.url
        );

    /*
    CORS preflight.
    */

    if (
        request.method === "OPTIONS"
    ) {

        return new Response(
            null,
            {
                status: 204,
                headers:
                    corsHeaders(
                        origin
                    )
            }
        );
    }

    /*
    LOGIN
    */

    if (
        request.method === "POST" &&
        url.pathname === "/api/login"
    ) {

        try {

            return await login(
                request,
                env,
                origin
            );

        } catch (error) {

            return json({
                ok: false,
                error:
                    error.message
            }, 400, origin);
        }
    }

    /*
    LOGOUT
    */

    if (
        request.method === "POST" &&
        url.pathname === "/api/logout"
    ) {

        return await logout(
            request,
            env,
            origin
        );
    }

    /*
    STATUS
    */

    if (
        request.method === "GET" &&
        url.pathname === "/api/status"
    ) {

        try {

            const state =
                await getBotState(
                    env
                );

            const price =
                await getLivePrice();

            const candles =
                await getBinanceCandles();

            const latestSignal =
                await env.DB.prepare(`
                    SELECT *
                    FROM signals
                    WHERE symbol = ?
                      AND timeframe = ?
                    ORDER BY candle_time DESC
                    LIMIT 1
                `)
                    .bind(
                        SYMBOL,
                        TIMEFRAME
                    )
                    .first();

            return json({

                ok: true,

                symbol:
                    SYMBOL,

                timeframe:
                    TIMEFRAME,

                price,

                strategy:
                    Number(
                        state.current_strategy
                    ),

                strategyName:
                    strategyName(
                        Number(
                            state.current_strategy
                        )
                    ),

                consecutiveLosses:
                    Number(
                        state.consecutive_losses
                    ),

                pendingTrade:
                    Number(
                        state.pending_trade
                    ) === 1,

                lastPrediction:
                    state.last_prediction,

                lastClosedCandleTime:
                    state.last_closed_candle_time,

                latestSignal,

                candles

            }, 200, origin);

        } catch (error) {

            return json({

                ok: false,

                error:
                    error.message

            }, 500, origin);
        }
    }

    /*
    HISTORY
    */

    if (
        request.method === "GET" &&
        url.pathname === "/api/history"
    ) {

        try {

            const requested =
                Number(
                    url.searchParams.get(
                        "limit"
                    ) || 100
                );

            const limit =
                Math.max(
                    1,
                    Math.min(
                        requested,
                        HISTORY_LIMIT
                    )
                );

            const rows =
                await env.DB.prepare(`
                    SELECT *
                    FROM signals
                    WHERE symbol = ?
                      AND timeframe = ?
                    ORDER BY candle_time DESC
                    LIMIT ?
                `)
                    .bind(
                        SYMBOL,
                        TIMEFRAME,
                        limit
                    )
                    .all();

            const stats =
                await env.DB.prepare(`
                    SELECT

                        SUM(
                            CASE
                                WHEN result = 'WIN'
                                THEN 1
                                ELSE 0
                            END
                        ) AS wins,

                        SUM(
                            CASE
                                WHEN result = 'LOSS'
                                THEN 1
                                ELSE 0
                            END
                        ) AS losses

                    FROM signals

                    WHERE symbol = ?
                      AND timeframe = ?
                `)
                    .bind(
                        SYMBOL,
                        TIMEFRAME
                    )
                    .first();

            return json({

                ok: true,

                signals:
                    rows.results || [],

                wins:
                    Number(
                        stats?.wins || 0
                    ),

                losses:
                    Number(
                        stats?.losses || 0
                    )

            }, 200, origin);

        } catch (error) {

            return json({

                ok: false,

                error:
                    error.message

            }, 500, origin);
        }
    }

    /*
    CANDLES
    */

    if (
        request.method === "GET" &&
        url.pathname === "/api/candles"
    ) {

        try {

            const candles =
                await getBinanceCandles();

            return json({

                ok: true,

                candles

            }, 200, origin);

        } catch (error) {

            return json({

                ok: false,

                error:
                    error.message

            }, 500, origin);
        }
    }

    /*
    MANUAL PROCESS
    */

    if (
        request.method === "POST" &&
        url.pathname === "/api/process"
    ) {

        try {

            const authenticated =
                await requireSession(
                    request,
                    env
                );

            if (!authenticated) {

                return json({
                    ok: false,
                    error:
                        "Unauthorized"
                }, 401, origin);
            }

            const result =
                await processNewCandle(
                    env
                );

            return json({

                ok: true,

                result

            }, 200, origin);

        } catch (error) {

            return json({

                ok: false,

                error:
                    error.message

            }, 500, origin);
        }
    }

    /*
    RESET HISTORY
    */

    if (
        request.method === "POST" &&
        url.pathname ===
            "/api/admin/reset-history"
    ) {

        try {

            const authenticated =
                await requireSession(
                    request,
                    env
                );

            if (!authenticated) {

                return json({
                    ok: false,
                    error:
                        "Unauthorized"
                }, 401, origin);
            }

            await env.DB.prepare(`
                DELETE FROM signals
                WHERE symbol = ?
                  AND timeframe = ?
            `)
                .bind(
                    SYMBOL,
                    TIMEFRAME
                )
                .run();

            await env.DB.prepare(`
                UPDATE bot_state
                SET
                    current_strategy = 1,
                    consecutive_losses = 0,
                    pending_trade = 0,
                    last_trade_direction = NULL,
                    last_prediction = NULL,
                    last_closed_candle_time = NULL,
                    updated_at = ?
                WHERE symbol = ?
                  AND timeframe = ?
            `)
                .bind(
                    Date.now(),
                    SYMBOL,
                    TIMEFRAME
                )
                .run();

            return json({

                ok: true,

                message:
                    "History reset successfully."

            }, 200, origin);

        } catch (error) {

            return json({

                ok: false,

                error:
                    error.message

            }, 500, origin);
        }
    }

    /*
    Unknown endpoint.
    */

    return json({

        ok: false,

        error:
            "API endpoint not found."

    }, 404, origin);
}

/*
============================================================
CRON
============================================================
*/

async function runScheduledBot(
    env
) {

    try {

        const result =
            await processNewCandle(
                env
            );

        console.log(
            "CRON RESULT:",
            JSON.stringify(
                result
            )
        );

    } catch (error) {

        console.error(
            "CRON ERROR:",
            error.stack ||
            error.message
        );
    }
}

/*
============================================================
WORKER ENTRY POINT
============================================================
*/

export default {

    async fetch(
        request,
        env
    ) {

        const url =
            new URL(
                request.url
            );

        /*
        API routes are handled by Worker.
        */

        if (
            url.pathname.startsWith(
                "/api/"
            )
        ) {

            return handleApi(
                request,
                env
            );
        }

        /*
        Everything else is served
        from index.html / static assets.

        This requires:

        "assets": {
            "directory": ".",
            "binding": "ASSETS"
        }

        in wrangler.jsonc.
        */

        return env.ASSETS.fetch(
            request
        );
    },

    async scheduled(
        event,
        env,
        ctx
    ) {

        ctx.waitUntil(
            runScheduledBot(
                env
            )
        );
    }
};
