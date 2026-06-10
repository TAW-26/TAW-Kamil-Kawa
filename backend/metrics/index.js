const client = require('prom-client');

// ── Rejestr metryk ──────────────────────────────────────────
const register = new client.Registry();

// Domyślne metryki Node.js — CPU, RAM, event loop, GC
client.collectDefaultMetrics({ register });

// ── Counter: łączna liczba żądań HTTP ───────────────────────
const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Łączna liczba żądań HTTP',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
});

// ── Histogram: czas trwania żądania w milisekundach ─────────
const httpRequestDurationMs = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Czas trwania żądania w milisekundach',
    buckets: [5, 10, 25, 50, 100, 250, 500, 1000],
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
});

// ── Gauge: aktywne połączenia ───────────────────────────────
const activeConnections = new client.Gauge({
    name: 'active_connections',
    help: 'Liczba aktualnie obsługiwanych połączeń',
    registers: [register],
});
// ── Counter: błędy API ──────────────────────────────────────
const apiErrorsTotal = new client.Counter({
    name: 'api_errors_total',
    help: 'Liczba błędów API (404, 400)',
    labelNames: ['type'],
    registers: [register],
});

module.exports = {
    register,
    httpRequestsTotal,
    httpRequestDurationMs,
    activeConnections,
    apiErrorsTotal,
};
