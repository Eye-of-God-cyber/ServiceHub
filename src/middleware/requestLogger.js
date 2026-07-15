'use strict';

const morgan = require('morgan');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────
// HTTP Request Logger Middleware
//
// We use morgan to capture every inbound HTTP request and pipe its
// output through our Winston logger (not stdout directly).
//
// Why route morgan through Winston?
// - All log output is centralized in one place (console + log files).
// - In production, the JSON log format makes HTTP logs parseable by
//   aggregation tools alongside application logs.
//
// Format:
//   Development → verbose "dev" format with colors
//   Production  → Apache "combined" format for standard log parsing
// ─────────────────────────────────────────────────────────

// Create a write stream that forwards morgan's output to Winston
const stream = {
  // Morgan will pass us a stringified JSON string, which we parse and pass to logger
  write: (message) => {
    try {
      const data = JSON.parse(message);
      logger.http('HTTP Request', data);
    } catch (e) {
      logger.http(message.trim());
    }
  },
};

// Use a custom morgan format that generates JSON
const jsonFormat = (tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number(tokens.status(req, res)),
    content_length: tokens.res(req, res, 'content-length'),
    response_time: Number(tokens['response-time'](req, res)),
    remote_addr: tokens['remote-addr'](req, res),
    user_agent: tokens['user-agent'](req, res)
  });
};

const requestLogger = morgan(
  process.env.NODE_ENV === 'production' ? jsonFormat : 'dev',
  { stream }
);

module.exports = requestLogger;
