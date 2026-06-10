// backend/middleware/metricsMiddleware.js
const {
    httpRequestsTotal,
    httpRequestDurationMs,
    activeConnections,
} = require('../metrics');

function metricsMiddleware(req, res, next) {
    const startMs = Date.now();
    activeConnections.inc();            // +1 aktywne połączenie

    res.on('finish', () => {
        const durationMs = Date.now() - startMs;

        // req.route?.path daje wzorzec routy (np. "/:id"),
        // a nie konkretną wartość (np. "/abc-123").
        // Jeśli req.route jest undefined (np. 404), bierzemy req.path.
        const route = req.route?.path ?? req.path;

        const labels = {
            method: req.method,
            route: route,
            status_code: String(res.statusCode),
        };

        httpRequestsTotal.inc(labels);                // +1 do countera
        httpRequestDurationMs.observe(labels, durationMs); // zapisz czas
        activeConnections.dec();                       // -1 aktywne połączenie
    });

    next();
}

module.exports = metricsMiddleware;
