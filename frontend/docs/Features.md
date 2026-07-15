# Features Documentation — ServiceHub Frontend

This document provides a comprehensive record of every implemented feature, the backend APIs it consumes, and its current implementation status.

---

## 1. Authentication

### Purpose
Allow users to register, log in, and maintain authenticated sessions. Supports three distinct roles: `CUSTOMER`, `PROVIDER`, and `ADMIN`.

### Implemented Functionality
- **Register**: Users can create an account with their name, email, phone, password, and role.
- **Login**: JWT-based authentication. Token is stored in `localStorage` on success.
- **Session Persistence**: On app load, `AuthProvider` reads the token from `localStorage` and restores the session.
- **Auto-Logout**: The Axios response interceptor detects `401 Unauthorized` responses and automatically clears the session and redirects to `/login`.
- **Role-Based Routing**: `AuthGuard` and `RoleGuard` in route group layouts prevent unauthorized access to protected pages.

### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/auth/register` | Create new user account |
| `POST` | `/auth/login` | Authenticate and receive JWT |
| `GET` | `/auth/me` | Fetch current authenticated user profile |

### Architecture
```
LoginPage → LoginForm → useLogin hook → auth.service.ts → POST /auth/login
                                     ↓
                             AuthProvider.login()
                                     ↓
                          Store JWT in localStorage
                                     ↓
                         RoleGuard → redirect to role home
```

### Current Status: ✅ Complete

---

## 2. Customer Module

### 2A. Service Catalog

#### Purpose
Allow customers to browse all available home services by category, and discover relevant providers.

#### Implemented Functionality
- **Catalog Listing**: Grid of all services with name, rating, starting price, and category.
- **Category Display**: Services can be filtered conceptually by category.
- **Service Detail Page**: Deep-dive view of a service including overview, FAQ, included/not-included items, and a list of available providers for that service.
- **Related Services**: At the bottom of a service detail page, related services are shown.
- **404 Handling**: If a `serviceId` does not exist, the page calls `notFound()` and renders the Next.js 404 page.

#### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/catalog/services` | Fetch all services |
| `GET` | `/catalog/categories` | Fetch all categories |
| `GET` | `/catalog/services/:id` | Fetch detailed service + available providers |

#### Current Status: ✅ Complete

---

### 2B. Booking Flow

#### Purpose
Allow customers to book a specific provider's service for a chosen date and time.

#### Implemented Functionality
- **Book a Provider**: Selecting a provider from the service detail page leads to a booking creation form.
- **Form Validation**: Date, time, and address selection with Zod validation.
- **Coupon Code**: UI field present. Coupon validation is handled by the backend.

#### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/bookings` | Create a new booking |
| `GET` | `/users/me/addresses` | Fetch customer's saved addresses for selection |

#### Current Status: ✅ Complete

---

### 2C. Bookings Management

#### Purpose
Allow customers to view all their past and upcoming bookings, and cancel bookings where permitted.

#### Implemented Functionality
- **Booking List**: Paginated list of all bookings with status badges.
- **Booking Detail**: Full detail view of a single booking (provider, service, date, price, status history).
- **Cancel Booking**: Customers can cancel bookings that are in a cancellable status.

#### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/bookings` | List all bookings for current user |
| `GET` | `/bookings/:id` | Fetch detailed booking |
| `PATCH` | `/bookings/:id/status` | Update booking status (cancel) |

#### Current Status: ✅ Complete

---

### 2D. Wallet

#### Purpose
Allow customers to view their wallet balance and transaction history.

#### Implemented Functionality
- **Wallet Balance**: Displayed prominently in currency format.
- **Transaction History**: Paginated list of all wallet credits and debits with descriptions and timestamps.

#### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/wallets/me` | Fetch wallet balance and transactions |

#### Current Status: ✅ Complete

---

### 2E. Reviews

#### Purpose
Allow customers to submit reviews for completed bookings and view their submitted reviews.

#### Implemented Functionality
- **Review List**: Shows all reviews submitted by the current customer.
- **Submit Review**: Form to rate and leave a comment for a completed booking.

#### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/reviews` | List reviews by current user |
| `POST` | `/reviews` | Create a new review |

#### Current Status: ✅ Complete

---

### 2F. Profile & Addresses

#### Purpose
Allow customers to manage their personal information and saved delivery/service addresses.

#### Implemented Functionality
- **Profile View & Edit**: Update first name, last name, and avatar URL.
- **Address List**: View all saved addresses.
- **Add Address**: Create a new address with full details.
- **Edit Address**: Update an existing address.
- **Delete Address**: Remove a saved address.
- **Set Default Address**: Mark one address as the default for booking flows.

#### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/users/me` | Fetch current user profile |
| `PATCH` | `/users/me` | Update profile fields |
| `GET` | `/users/me/addresses` | Fetch all addresses |
| `POST` | `/users/me/addresses` | Create new address |
| `PUT` | `/users/me/addresses/:id` | Update address |
| `DELETE` | `/users/me/addresses/:id` | Delete address |
| `PATCH` | `/users/me/addresses/:id/default` | Set as default |

#### Current Status: ✅ Complete

---

## 3. Provider Module

### 3A. Provider Profile

#### Purpose
Allow providers to manage their public-facing profile and verification documents.

#### Implemented Functionality
- **Profile View**: Read-only overview of email, phone, verification status, and wallet balance.
- **Profile Edit**: Update first name, last name, bio, years of experience, avatar URL, and availability toggle.
- **Documents List**: View all uploaded verification documents with their status (PENDING / APPROVED / REJECTED) and admin notes.
- **Upload Document**: Submit a new document by type and URL for admin review.
- **Delete Document**: Remove a document that is not yet APPROVED.

#### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/providers/me` | Fetch provider profile |
| `PATCH` | `/providers/me` | Update provider profile |
| `GET` | `/providers/me/documents` | Fetch provider's documents |
| `POST` | `/providers/me/documents` | Upload a new document |
| `DELETE` | `/providers/me/documents/:id` | Delete a document |

#### Current Status: ✅ Complete

---

### 3B. Provider Services

#### Purpose
Allow providers to configure which services they offer, their custom pricing, and their descriptions.

#### Implemented Functionality
- **Services List**: View all services the provider has added to their profile.
- **Add Service**: Select from the base catalog, optionally set a custom price and description.
- **Edit Service**: Update custom price, description, and availability toggle for a service.
- **Delete Service**: Remove a service from the provider's profile.

#### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/providers/me/services` | Fetch provider's services |
| `POST` | `/providers/me/services` | Add a service to the profile |
| `PATCH` | `/providers/me/services/:id` | Update a service |
| `DELETE` | `/providers/me/services/:id` | Remove a service |
| `GET` | `/catalog/services` | Fetch base catalog for service selection |

#### Current Status: ✅ Complete

---

### 3C. Provider Availability

#### Purpose
Allow providers to set their standard weekly working schedule.

#### Implemented Functionality
- **Weekly Schedule Form**: For each day of the week, set a start time, end time, and whether the day is available.
- **Save Schedule**: Updates the entire availability schedule in a single API call.

#### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/providers/me/availability` | Fetch current availability schedule |
| `PUT` | `/providers/me/availability` | Replace the entire availability schedule |

#### Current Status: ✅ Complete

---

### 3D. Provider Time-Off

#### Purpose
Allow providers to block out specific date ranges when they are unavailable (holidays, illness, etc.).

#### Implemented Functionality
- **Time-Off List**: View all scheduled time-offs with start/end dates and reasons.
- **Add Time-Off**: Select a date range and optional reason.
- **Delete Time-Off**: Remove a scheduled time-off.

#### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/providers/me/time-off` | Fetch all time-offs |
| `POST` | `/providers/me/time-off` | Create a new time-off period |
| `DELETE` | `/providers/me/time-off/:id` | Delete a time-off period |

#### Current Status: ✅ Complete

---

### 3E. Provider Bookings

#### Purpose
Allow providers to manage incoming bookings for their services.

#### Implemented Functionality
- **Bookings List**: Paginated list of all bookings assigned to the provider.
- **Status Update**: Provider can accept, start, complete, or cancel a booking.

#### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/bookings` | Fetch bookings (filtered for provider context) |
| `PATCH` | `/bookings/:id/status` | Update booking status |

#### Current Status: ✅ Complete

---

## 4. Admin Module

### 4A. Admin Dashboard

#### Purpose
Provide platform-level overview and navigation for admin users.

#### Implemented Functionality
- **Dashboard Page**: High-level statistics and navigation to admin sub-sections.
- **Sidebar Navigation**: Links to all admin sections with role-guarded access.

#### Current Status: ✅ Complete

---

### 4B. Admin Bookings Management

#### Purpose
Allow admins to view and manage all bookings on the platform.

#### Implemented Functionality
- **All Bookings List**: Paginated list of all platform bookings with status filter.
- **Booking Details**: View full booking detail in a dialog.
- **Update Status**: Admins can forcefully update a booking's status.

#### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/bookings` | Fetch all bookings (admin scope) |
| `GET` | `/bookings/:id` | Fetch booking details |
| `PATCH` | `/bookings/:id/status` | Update booking status |

#### Current Status: ✅ Complete

---

### 4C. Admin Dispute Management

#### Purpose
Allow admins to view all customer disputes, respond to messages, and resolve disputes.

#### Implemented Functionality
- **Disputes List**: Paginated list of all platform disputes.
- **Dispute Detail**: View full dispute including all messages in a dialog.
- **Add Message**: Admins can send messages to the dispute thread.
- **Resolve Dispute**: Admin can mark a dispute as resolved with a resolution note.

#### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/disputes` | List all disputes |
| `GET` | `/disputes/:id` | Fetch dispute details and messages |
| `POST` | `/disputes/:id/messages` | Add a message to the dispute |
| `PATCH` | `/admin/disputes/:id/resolve` | Resolve a dispute |

#### Current Status: ✅ Complete

---

### 4D. Admin Document Verification

#### Purpose
Allow admins to approve or reject provider-submitted verification documents.

#### Backend APIs Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `PATCH` | `/admin/documents/:id/status` | Update document verification status |

> **Note**: This API is implemented and used as part of the provider profile flow from the admin side. A dedicated admin documents management UI page is part of a future milestone.

#### Current Status: ⚠️ API available, dedicated UI page pending
