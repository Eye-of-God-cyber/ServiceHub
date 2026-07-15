'use strict';

const { body, param } = require('express-validator');
const { DayOfWeek } = require('@prisma/client');

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM

const updateAvailabilityValidation = [
  body().isArray().withMessage('Payload must be an array of availability objects'),
  body('*.dayOfWeek')
    .trim().notEmpty().withMessage('Day of week is required')
    .isIn(Object.values(DayOfWeek))
    .withMessage(`Invalid day of week`),
  body('*.startTime')
    .trim().notEmpty().withMessage('Start time is required')
    .matches(TIME_REGEX).withMessage('Start time must be in HH:MM format'),
  body('*.endTime')
    .trim().notEmpty().withMessage('End time is required')
    .matches(TIME_REGEX).withMessage('End time must be in HH:MM format')
    .custom((endTime, { req, path }) => {
      // Extract the index from the path (e.g., "[0].endTime")
      const match = path.match(/\[(\d+)\]/);
      if (match) {
        const index = match[1];
        const startTime = req.body[index].startTime;
        if (startTime && endTime <= startTime) {
          throw new Error('End time must be after start time');
        }
      }
      return true;
    }),
  body('*.isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be a boolean')
    .toBoolean(),
];

const createTimeOffValidation = [
  body('startDate')
    .trim().notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid ISO8601 date (YYYY-MM-DD)')
    .toDate(),
  body('endDate')
    .trim().notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('End date must be a valid ISO8601 date (YYYY-MM-DD)')
    .toDate()
    .custom((endDate, { req }) => {
      if (req.body.startDate && endDate < req.body.startDate) {
        throw new Error('End date cannot be before start date');
      }
      return true;
    }),
  body('reason')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 }).withMessage('Reason cannot exceed 255 characters'),
];

const timeOffIdParam = [
  param('timeOffId').isInt({ min: 1 }).withMessage('Time-off ID must be a positive integer').toInt(),
];

module.exports = {
  updateAvailabilityValidation,
  createTimeOffValidation,
  timeOffIdParam,
};
