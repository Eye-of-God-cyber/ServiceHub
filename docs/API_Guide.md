# ServiceHub API Guide

This document is the complete API documentation for frontend developers integrating with the ServiceHub backend.

**Base URL**: `http://localhost:5000/api/v1` (dev) | `https://api.servicehub.app/api/v1` (prod)  
**Content-Type**: `application/json`  
**Authentication**: `Authorization: Bearer <token>`

---

## Standard Response Envelopes

**Success**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

**Success with Pagination**
```json
{
  "success": true,
  "message": "Results fetched",
  "data": [ ... ],
  "meta": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
}
```

**Error**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    { "field": "email", "message": "Email is required" }
  ]
}
```

---

## Auth Module (`/auth`)

### `POST /auth/register`
- **Auth**: None
- **Body**: `{ email, phone, password, firstName, lastName, role: 'CUSTOMER'|'PROVIDER'|'ADMIN' }`
- **Returns**: JWT token and user profile details.

### `POST /auth/login`
- **Auth**: None
- **Body**: `{ email, password }`
- **Returns**: JWT token and user profile details.

### `GET /auth/me`
- **Auth**: Required
- **Returns**: Authenticated user details, including active roles and linked profiles (Customer/Provider).

---

## Users Module (`/users`)

### `GET /users/profile`
- **Auth**: Required
- **Returns**: The customer profile (`firstName`, `lastName`, `avatarUrl`, `dateOfBirth`).

### `PUT /users/profile`
- **Auth**: Required
- **Body**: `{ firstName, lastName, avatarUrl, dateOfBirth }` (all optional).

### `GET /users/addresses`
- **Auth**: Required
- **Returns**: Array of saved delivery addresses.

### `POST /users/addresses`
- **Auth**: Required
- **Body**: `{ label, line1, line2, city, state, pincode, latitude, longitude, isDefault }`

### `PUT /users/addresses/:addressId`
- **Auth**: Required
- **Body**: Update an existing address (fields identical to `POST`). Users can only modify their own addresses.

### `DELETE /users/addresses/:addressId`
- **Auth**: Required
- **Action**: Soft deletes or permanently removes the address.

### `PATCH /users/addresses/:addressId/default`
- **Auth**: Required
- **Action**: Sets the specified address as the default for the user.

---

## Providers Module (`/providers`)
*(Accessible only by users with the `PROVIDER` role)*

### `GET /providers/me`
- **Auth**: Required (PROVIDER only)
- **Returns**: Provider-specific metrics (`experienceYears`, `avgRating`, `totalBookings`, `verificationStatus`).

### `PUT /providers/me`
- **Auth**: Required (PROVIDER only)
- **Body**: `{ bio, experienceYears, isAvailable }`

### `GET /providers/documents` & `POST /providers/documents`
- **Auth**: Required (PROVIDER only)
- **Body (POST)**: `{ documentType, documentUrl }`
- **Action**: Upload compliance documents (ID Proof, Certification, etc.).

### `GET /providers/services` & `POST /providers/services`
- **Auth**: Required (PROVIDER only)
- **Body (POST)**: `{ serviceId, customPrice, description, isAvailable }`
- **Action**: Manage the specific services this provider offers from the master catalog.

### `GET /providers/availability` & `PUT /providers/availability`
- **Auth**: Required (PROVIDER only)
- **Body (PUT)**: Array of `{ dayOfWeek, startTime, endTime, isAvailable }`

---

## Catalog Module (`/catalog`)

### `GET /catalog/categories`
- **Auth**: None (Public)
- **Returns**: Array of active service categories (e.g., Plumbing, Cleaning).

### `GET /catalog/services`
- **Auth**: None (Public)
- **Query**: `?categoryId=1`
- **Returns**: Array of specific services under categories.

---

## Bookings Module (`/bookings`)

### `POST /bookings`
- **Auth**: Required (CUSTOMER only)
- **Body**: `{ providerServiceId, addressId, scheduledAt, notes, couponId }`
- **Rules**: Enforces coupon validity and provider availability atomically.

### `GET /bookings`
- **Auth**: Required
- **Query**: `?status=PENDING&page=1&limit=20`
- **Returns**: Paginated list of bookings. Customers see own bookings, Providers see their assigned jobs.

### `PATCH /bookings/:bookingId/status`
- **Auth**: Required
- **Body**: `{ status, cancellationReason }`
- **Rules**: State machine enforced. E.g., Customers can cancel `PENDING` bookings; Providers can transition `CONFIRMED` to `IN_PROGRESS`.

---

## Wallet Module (`/wallets`)

### `GET /wallets/me`
- **Auth**: Required
- **Returns**: Current wallet `balance` and a list of recent `transactions` (credits and debits).

---

## Reviews Module (`/reviews`)

### `POST /reviews`
- **Auth**: Required (CUSTOMER only)
- **Body**: `{ bookingId, rating, comment }`
- **Rules**: Booking must be `COMPLETED`. Only one review per booking allowed.

### `POST /reviews/:reviewId/reply`
- **Auth**: Required (PROVIDER only)
- **Body**: `{ comment }`
- **Rules**: Provider can reply once to a review left on their job.

---

## Disputes Module (`/disputes`)

### `POST /disputes`
- **Auth**: Required
- **Body**: `{ bookingId, subject, description }`
- **Action**: Opens a support ticket for a booking.

### `POST /disputes/:disputeId/messages`
- **Auth**: Required
- **Body**: `{ message }`
- **Action**: Appends a threaded message to an open dispute.

---

## Admin Module (`/admin`)
*(Accessible only by users with the `ADMIN` role)*

### `PATCH /admin/documents/:docId/status`
- **Body**: `{ status: 'APPROVED' | 'REJECTED', adminNotes }`

### `PATCH /admin/disputes/:disputeId/resolve`
- **Body**: `{ status: 'RESOLVED', resolution: "Explanation..." }`

---

## Common HTTP Status Codes
- `200 OK` / `201 Created`: Success
- `400 Bad Request`: Validation failure (missing/invalid fields)
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Authenticated, but lacking required role
- `404 Not Found`: Resource does not exist
- `409 Conflict`: Resource state violation (e.g., booking already cancelled)
- `422 Unprocessable Entity`: Business rule violation (e.g., wallet insufficient balance)
- `429 Too Many Requests`: Rate limit exceeded
