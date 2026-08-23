// Authentication: session tokens, password hashing

// We'll use PBKDF2 with a random salt.
// Store salt and hash as hex strings.

export async function hashPassword(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );
    const derived = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: enc.encode(salt),
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );
    const hashArray = Array.from(new Uint8Array(derived));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateSalt() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateToken() {
    return crypto.randomUUID();
}

/**
 * Authenticate user by username and password.
 * Returns user object if success, else null.
 */
export async function authenticateUser(env, username, password) {
    const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
    if (!user) return null;
    const hash = await hashPassword(password, user.salt);
    if (hash !== user.password_hash) return null;
    return user;
}

/**
 * Create a session token for a user.
 * Returns token string.
 */
export async function createSession(env, username) {
    const token = generateToken();
    const now = Date.now();
    const expires = now + 7 * 24 * 60 * 60 * 1000; // 7 days
    await env.DB.prepare(`
        INSERT INTO sessions (token, username, created_at, expires_at)
        VALUES (?, ?, ?, ?)
    `).bind(token, username, now, expires).run();
    return token;
}

/**
 * Validate a session token.
 * Returns username if valid, else null.
 */
export async function validateSession(env, token) {
    const session = await env.DB.prepare('SELECT * FROM sessions WHERE token = ?').bind(token).first();
    if (!session) return null;
    if (session.expires_at < Date.now()) {
        // clean up expired
        await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
        return null;
    }
    return session.username;
}

/**
 * Invalidate a session (logout).
 */
export async function deleteSession(env, token) {
    await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
}

/**
 * Reset user credentials using master password.
 */
export async function resetCredentials(env, masterPassword, newUsername, newPassword) {
    // Verify master password (stored as secret)
    if (masterPassword !== env.MASTER_PASSWORD) {
        throw new Error('Invalid master password');
    }
    // Check if new username already exists
    const existing = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(newUsername).first();
    if (existing) {
        throw new Error('Username already taken');
    }
    const salt = generateSalt();
    const hash = await hashPassword(newPassword, salt);
    // Update or insert (we only have one user for simplicity)
    const user = await env.DB.prepare('SELECT * FROM users LIMIT 1').first();
    if (user) {
        await env.DB.prepare(`
            UPDATE users SET username = ?, password_hash = ?, salt = ? WHERE id = ?
        `).bind(newUsername, hash, salt, user.id).run();
    } else {
        await env.DB.prepare(`
            INSERT INTO users (username, password_hash, salt, created_at)
            VALUES (?, ?, ?, ?)
        `).bind(newUsername, hash, salt, Date.now()).run();
    }
    return { username: newUsername };
}
