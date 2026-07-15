# Backend Developer Guide

Welcome to the ServiceHub backend codebase. This guide explains the project structure, architectural patterns, and guidelines for contributing.

## 1. Project Structure
```text
ServiceHub/
├── server.js                   # Process entry point, HTTP server, signal handling
├── package.json
├── .env.example
├── prisma/
│   ├── schema.prisma            # 24 models, 15 enums
│   ├── migrations/              # Prisma migration history
│   └── seed.js                  # Initial data seeder
├── src/
│   ├── app.js                   # Express factory, middleware pipeline
│   ├── config/
│   │   ├── env.js               # Validated environment config
│   │   ├── prisma.js            # Shared Prisma singleton
│   │   ├── auth.constants.js    # JWT constants (SALT_ROUNDS, etc.)
│   │   ├── roles.js             # ROLES constant map
│   │   └── swagger.js           # OpenAPI spec builder
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verification + user status check
│   │   ├── role.middleware.js   # Role-based access control
│   │   ├── validate.js          # express-validator error collector
│   │   ├── rateLimiter.js       # Global + auth rate limiters
│   │   ├── requestLogger.js     # Morgan + Winston structured logging
│   │   └── errorHandler.js      # Global error handler + 404 handler
│   ├── routes/
│   │   └── index.js             # Central route registry
│   ├── modules/
│   │   ├── admin/               # Admin operations
│   │   ├── auth/                # Authentication
│   │   ├── bookings/            # Booking lifecycle
│   │   ├── catalog/             # Service catalog
│   │   ├── disputes/            # Dispute management
│   │   ├── health/              # Health check
│   │   ├── notifications/       # Notifications
│   │   ├── providers/           # Provider profile, docs, availability, services
│   │   ├── reviews/             # Reviews and replies
│   │   ├── users/               # User profile and addresses
│   │   └── wallets/             # Wallet and transactions
│   ├── utils/
│   │   ├── ApiResponse.js       # Standard response envelope
│   │   ├── AppError.js          # Custom operational error class
│   │   ├── logger.js            # Winston logger
│   │   ├── jwt.util.js          # Token sign/verify helpers
│   │   ├── password.util.js     # bcrypt hash/compare
│   │   ├── pagination.util.js   # Pagination helpers
│   │   └── sanitize.util.js     # XSS mitigation for plain text
│   └── validations/             # express-validator schemas per module
└── docs/                        # Engineering documentation
```

## 2. Module Anatomy
ServiceHub follows a strict Layered MVC pattern. Each feature module is self-contained.

### Routes (`<module>.routes.js`)
- **Role**: Registers endpoints, applies middleware (auth, RBAC, validators).
- **Swagger**: Contains JSDoc `@swagger` annotations used to generate the `/api-docs`.

### Controllers (`<module>.controller.js`)
- **Role**: Thin wrappers. They extract data from `req`, call the service layer, and wrap the output in an `ApiResponse`.
- **Rule**: No business logic goes here.

### Services (`<module>.service.js`)
- **Role**: The core engine. Contains all business logic, complex validations, and Prisma database queries.
- **Rule**: If a business rule fails, `throw new AppError('Message', StatusCode)`.

## 3. Standard Patterns

### Validation (`express-validator`)
Input validation is handled before the controller is reached.
```javascript
const { body } = require('express-validator');
const { sanitizePlainText } = require('../../utils/sanitize.util');

const myValidation = [
  body('name')
    .notEmpty().withMessage('Required')
    .trim()
    .customSanitizer(sanitizePlainText)
];
// Usage in routes: router.post('/', authenticate, myValidation, validate, controller.myMethod);
```

### Standard Responses (`ApiResponse`)
Always wrap data using the standard `ApiResponse` class.
```javascript
res.json(new ApiResponse(StatusCodes.OK, data, 'Success message'));
```

### Error Handling (`AppError`)
For business logic failures inside services, throw an `AppError`. The global `errorHandler` middleware catches this automatically (thanks to `express-async-errors`).
```javascript
const AppError = require('../../utils/AppError');
throw new AppError('Insufficient balance', StatusCodes.UNPROCESSABLE_ENTITY);
```

### Pagination
```javascript
const { getPaginationOptions, formatPaginatedResponse } = require('../../utils/pagination.util');

const listItems = async (filters) => {
  const { page, limit, skip, take } = getPaginationOptions(filters);
  const [data, total] = await Promise.all([
    prisma.item.findMany({ skip, take }),
    prisma.item.count()
  ]);
  return formatPaginatedResponse(data, total, page, limit);
};
```

### Transactions
For multi-step DB writes (e.g., creating a booking and logging history), always use `$transaction`:
```javascript
return prisma.$transaction(async (tx) => {
  const result = await tx.model.create(...);
  await tx.audit.create(...);
  return result;
});
```

## 4. Coding Standards
- **Style**: Prettier enforces formatting (2 spaces, single quotes). Run `npm run format`.
- **Linting**: ESLint catches errors. Run `npm run lint`. No warnings are permitted.
- **Async/Await**: Avoid raw Promises (`.then`). Use `async/await`.
- **Environment Vars**: Access env vars only via `require('../../config/env')`, never `process.env`.
- **Monetary Values**: Always treat monetary fields as Prisma `Decimal`.
