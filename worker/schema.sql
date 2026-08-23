
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    candle_time INTEGER,          
    signal_direction TEXT NOT NULL,
    strategy INTEGER NOT NULL,     
    entry_price REAL,
    result TEXT,                   
    result_price REAL,
    created_at INTEGER NOT NULL,  
    updated_at INTEGER             
);

CREATE TABLE IF NOT EXISTS bot_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    symbol TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    current_strategy INTEGER NOT NULL DEFAULT 1,
    consecutive_losses INTEGER NOT NULL DEFAULT 0,
    pending_trade INTEGER NOT NULL DEFAULT 0, 
    last_prediction_direction TEXT,          
    pending_signal_id INTEGER,                
    last_closed_candle_time INTEGER,          
    wins INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_signals_symbol_timeframe ON signals (symbol, timeframe);
CREATE INDEX idx_signals_candle_time ON signals (candle_time);
CREATE INDEX idx_sessions_token ON sessions (token);
CREATE INDEX idx_sessions_expires ON sessions (expires_at);
