'use strict';

const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// ─────────────────────────────────────────────────────────
// Validation Runner Middleware
//
// This middleware is placed AFTER an array of express-validator
// check() rules in a route definition. It reads the validation
// result and throws an AppError if any rule failed, so the global
// error handler returns a consistent 422 with a list of field errors.
//
// Usage in a route file:
//   router.post(
//     '/register',
//     [body('email').isEmail(), body('password').isLength({ min: 8 })],
//     validate,          ← this middleware
//     authController.register
//   );
//
// Response shape on failure:
//   { success: false, message: 'Validation failed', errors: [{ field, message }] }
// ─────────────────────────────────────────────────────────

const validate = (req, _res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return next(new AppError('Validation failed', 422, errors));
  }

  return next();
};

module.exports = validate;
