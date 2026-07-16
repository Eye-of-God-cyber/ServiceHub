# Frontend API Integration Guide

This guide helps frontend developers integrate with the ServiceHub REST API.

Base URL: `https://servicehub-api-13vx.onrender.com/api/v1`  
Swagger UI: `/api-docs`

---

## 1. Authentication Flow
ServiceHub uses stateless JWT authentication.
1. **Register/Login** → Receive JWT in response
2. **Store token** → (localStorage or HttpOnly cookie)
3. **Attach to requests** → `Authorization: Bearer <token>`
4. **Token Expiry** → Default 15m. When 401 is returned, clear token and redirect to login.

Login response shape:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbG...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "phone": "+919876543210",
      "roles": ["CUSTOMER"],
      "userProfile": { ... }
    }
  }
}
```

## 2. Required Headers
For any protected route:
```http
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

## 3. Standard Response Format
**Success**
```json
{ "success": true, "message": "Profile fetched", "data": { ... } }
```

**Success with Pagination**
```json
{
  "success": true,
  "message": "Bookings fetched",
  "data": [...],
  "meta": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
}
```

**Error**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email address" }]
}
```

## 4. Handling Pagination
All collection endpoints support query params: `?page=1&limit=20` (max limit 100).
Use `meta.totalPages` to build your UI pagination component.

## 5. Error Handling Guide
- `400 Bad Request`: Show validation errors from `response.errors` array.
- `401 Unauthorized`: Token expired or missing. Clear token, redirect to `/login`.
- `403 Forbidden`: User lacks required role or ownership. Show "Permission Denied".
- `404 Not Found`: Resource does not exist.
- `409 Conflict`: Resource already exists (e.g., already reviewed).
- `422 Unprocessable Entity`: Business rule violation (e.g., "Insufficient balance").
- `429 Too Many Requests`: Global or auth rate limit hit. Show "Please slow down".
- `500 Internal Server Error`: Show generic error, backend will log stack trace.

## 6. Axios Setup Example

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

## 7. Role-Based UI Guidance
Check `user.roles` array (from `/auth/me` or login response).
- `CUSTOMER`: Show booking UI, review UI, wallet, disputes.
- `PROVIDER`: Show job management, availability settings, document upload, service listing.
- `ADMIN`: Show document approval panel, dispute resolution panel.

Note: A single user can have multiple roles simultaneously.

```javascript
const user = response.data.data.user;
const isCustomer = user.roles.includes('CUSTOMER');
const isProvider = user.roles.includes('PROVIDER');
const isAdmin = user.roles.includes('ADMIN');
```
