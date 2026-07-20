'use strict';

const { v4: uuidv4 } = require('uuid');

// ─────────────────────────────────────────────────────────────────────────────
// Request Correlation ID Middleware
//
// Assigns a unique identifier to every inbound HTTP request so that all
// log lines produced during that request can be correlated in a log
// aggregator (Datadog, Loki, CloudWatch, etc.).
//
// Behaviour:
//   1. If the caller includes X-Request-ID in the request headers,
//      we reuse it (supports upstream proxies / API gateways that
//      already stamp the header, e.g. Render's load balancer).
//   2. If absent, we generate a fresh UUID v4.
//   3. The resolved ID is attached to req.id for downstream use.
//   4. X-Request-ID is written to the response so the caller can
//      correlate their request logs with server logs.
//
// This middleware must be registered BEFORE requestLogger so that the
// request-id is available when Morgan formats the log entry.
// ─────────────────────────────────────────────────────────────────────────────

const requestId = (req, res, next) => {
  // Honour upstream header if present (case-insensitive read via Express)
  const incoming = req.headers['x-request-id'];
  const id = (incoming && typeof incoming === 'string' && incoming.trim())
    ? incoming.trim()
    : uuidv4();

  // Attach to request for use in controllers, services, and logger
  req.id = id;

  // Echo back so clients can correlate their own logs
  res.setHeader('X-Request-ID', id);

  next();
};

module.exports = requestId;
