import * as binance from './binance';
import * as strategy from './strategy';
import * as db from './database';
import * as api from './api';
import * as auth from './auth';

export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);
            const path = url.pathname;

            // Log every request (helps debugging)
            console.log(`Request: ${request.method} ${path}`);

            // CORS headers
            const corsHeaders = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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
                    response = new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
            }

            // Add CORS headers to response
            const newHeaders = new Headers(response.headers);
            for (const [key, value] of Object.entries(corsHeaders)) {
                newHeaders.set(key, value);
            }
            // Ensure Content-Type is JSON for all responses (unless it's a streaming response)
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

// (Keep the processNewCandle function as before, but ensure it uses env.DB correctly)
