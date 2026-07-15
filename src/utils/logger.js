'use strict';

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// ─────────────────────────────────────────────────────────
// Winston Logger
//
// We use Winston instead of console.log for three reasons:
// 1. Log levels — we can silence verbose logs in production.
// 2. Structured JSON output — easily ingested by log aggregation tools
//    (Datadog, CloudWatch, Loki) in production.
// 3. File rotation — logs are automatically rotated daily and cleaned up
//    after 14 days to prevent disk exhaustion.
//
// The LOG_LEVEL environment variable controls verbosity:
//   error > warn > info > http > debug
// ─────────────────────────────────────────────────────────

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LOG_DIR = path.join(process.cwd(), 'logs');

// ─── Custom format: timestamp + colorized level + message ─────────────────────
const devFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

// ─── Production format: structured JSON ───────────────────
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// ─── Transports ───────────────────────────────────────────

const transports = [];

// Console transport — always enabled; format depends on environment
transports.push(
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  })
);

// File transports — only in non-test environments (we don't want test runs
// polluting the log directory or slowing down CI).
if (process.env.NODE_ENV !== 'test') {
  // All logs at or above LOG_LEVEL
  transports.push(
    new DailyRotateFile({
      dirname: LOG_DIR,
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: LOG_LEVEL,
      format: prodFormat,
    })
  );

  // Error-only log — useful for quick triage
  transports.push(
    new DailyRotateFile({
      dirname: LOG_DIR,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: prodFormat,
    })
  );
}

// ─── Logger instance ──────────────────────────────────────
const logger = winston.createLogger({
  level: LOG_LEVEL,
  transports,
  // Prevent Winston from exiting the process on uncaught exceptions
  // (we handle that ourselves in server.js).
  exitOnError: false,
});

module.exports = logger;
