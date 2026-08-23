// Fetch public market data from Binance
const BINANCE_BASE = 'https://api.binance.com';

export async function fetchLivePrice(symbol) {
    const url = `${BINANCE_BASE}/api/v3/ticker/price?symbol=${symbol}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Binance price error: ${resp.status}`);
    const data = await resp.json();
    return parseFloat(data.price);
}

/**
 * Fetch klines and return an array of closed candle objects
 * Each object: { openTime, open, close, color }
 * 'color' is 'green' if close >= open, else 'red'
 */
export async function fetchClosedCandles(symbol, interval, limit) {
    const url = `${BINANCE_BASE}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Binance klines error: ${resp.status}`);
    const data = await resp.json();
    
    const now = Date.now();
    const candles = [];
    for (const k of data) {
        const openTime = k[0];
        const closeTime = k[6]; // close time in ms
        // Only include closed candles (close time <= now)
        if (closeTime <= now) {
            const open = parseFloat(k[1]);
            const close = parseFloat(k[4]);
            candles.push({
                openTime,
                open,
                close,
                color: close >= open ? 'green' : 'red'
            });
        }
    }
    return candles; // sorted ascending by time
}
