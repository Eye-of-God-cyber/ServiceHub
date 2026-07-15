'use strict';

const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');
const ApiResponse = require('../../utils/ApiResponse');
const logger = require('../../utils/logger');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: API Health Check
 *     description: >
 *       Returns the operational status of the API and its database connection.
 *       This endpoint is public (no authentication required) and is intended for
 *       use by uptime monitors and load balancers.
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: API is healthy and database is reachable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: ServiceHub API is running
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: healthy
 *                     database:
 *                       type: string
 *                       example: connected
 *                     environment:
 *                       type: string
 *                       example: development
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     uptime:
 *                       type: number
 *                       description: Process uptime in seconds
 *       503:
 *         description: API is up but database is unreachable
 */
router.get('/', async (_req, res) => {
  try {
    // Ping the database with the lightest possible query
    await prisma.$queryRaw`SELECT 1`;

    return ApiResponse.success(res, {
      message: 'ServiceHub API is running',
      data: {
        status: 'healthy',
        database: 'connected',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
      },
    });
  } catch (error) {
    logger.error('[Health Check] Database ping failed', { error: error.message });
    return ApiResponse.error(res, {
      statusCode: 503,
      message: 'Service unavailable — database connection failed',
    });
  }
});

module.exports = router;
