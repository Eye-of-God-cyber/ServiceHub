# Database Guide

## Database Overview
- **Database**: PostgreSQL
- **ORM**: Prisma 5

## Tables (24 total)

| Table | PK Type | Purpose |
|---|---|---|
| `users` | UUID string | Auth identity, one row per person |
| `user_roles` | int auto | Junction: user ↔ role assignment |
| `roles` | int auto | Master role list (CUSTOMER, PROVIDER, ADMIN) |
| `user_profiles` | int auto | Customer-specific profile data (1:1 with users) |
| `provider_profiles` | int auto | Provider-specific data (1:1 with users) |
| `service_categories` | int auto | Top-level groupings (Plumbing, Electrical, etc.) |
| `services` | int auto | Master catalog of bookable services |
| `provider_services` | int auto | Junction: which services a provider offers, with custom pricing |
| `addresses` | int auto | User-saved service delivery addresses |
| `bookings` | int auto | Core business transaction (customer + provider + service + address) |
| `booking_status_history` | int auto | Append-only audit trail of status transitions |
| `provider_availability` | int auto | Weekly recurring availability schedule |
| `provider_time_off` | int auto | Date-range exceptions to availability |
| `payments` | int auto | Payment gateway records per booking |
| `wallets` | int auto | Running balance ledger per user |
| `wallet_transactions` | int auto | Immutable append-only money movement ledger |
| `reviews` | int auto | Customer rating + comment post booking |
| `review_replies` | int auto | Provider reply to a review (1:1 with review) |
| `disputes` | int auto | Support ticket for booking issues |
| `dispute_messages` | int auto | Threaded conversation within a dispute |
| `notifications` | int auto | In-app notification feed |
| `coupons` | int auto | Admin-created discount codes |
| `coupon_usages` | int auto | Track which user used which coupon for which booking |
| `provider_documents` | int auto | Verification documents uploaded by providers |
| `otp_verifications` | int auto | Short-lived OTP codes for verification flows |

## Enums
- `UserStatus`: ACTIVE, INACTIVE, SUSPENDED, BANNED
- `RoleName`: CUSTOMER, PROVIDER, ADMIN
- `OtpPurpose`: EMAIL_VERIFICATION, PHONE_VERIFICATION, PASSWORD_RESET
- `VerificationStatus`: PENDING, UNDER_REVIEW, APPROVED, REJECTED
- `DocumentType`: ID_PROOF, ADDRESS_PROOF, CERTIFICATION, POLICE_VERIFICATION, OTHER
- `DayOfWeek`: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
- `BookingStatus`: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW
- `PaymentStatus`: PENDING, SUCCESS, FAILED, REFUNDED
- `PaymentMethod`: WALLET, CARD, UPI, CASH, NET_BANKING
- `WalletTransactionType`: CREDIT, DEBIT
- `WalletTransactionStatus`: PENDING, COMPLETED, FAILED, REVERSED
- `DisputeStatus`: OPEN, IN_REVIEW, RESOLVED, CLOSED
- `NotificationType`: BOOKING_UPDATE, PAYMENT, REVIEW_REQUEST, PROMOTIONAL, SYSTEM, DISPUTE
- `CouponType`: PERCENTAGE, FLAT
- `CouponStatus`: ACTIVE, INACTIVE, EXPIRED

## Key Relationships
- **User (1:1)** UserProfile, ProviderProfile, Wallet
- **User (1:N)** UserRole, Address, Booking (as customer), Review, Dispute, DisputeMessage, Notification, CouponUsage, OtpVerification, BookingStatusHistory
- **ProviderProfile (1:N)** ProviderService, ProviderAvailability, ProviderTimeOff, Booking (as provider), Review, ReviewReply, ProviderDocument
- **Booking (1:N)** BookingStatusHistory, Payment, WalletTransaction, Review (via 1:1), Dispute, CouponUsage (1:1)
- **Coupon (1:N)** CouponUsage, Booking

## Cascade Behaviors
- **Cascade (child deleted with parent)**: UserProfile→User, ProviderProfile→User, Wallet→User, Address→User, ProviderService→ProviderProfile, ProviderAvailability→ProviderProfile, ProviderTimeOff→ProviderProfile, ProviderDocument→ProviderProfile, BookingStatusHistory→Booking, DisputeMessage→Dispute, Notification→User, OtpVerification→User, ReviewReply→Review
- **Restrict (blocks deletion)**: Booking FKs (customerId, providerId, serviceId, addressId), Payment→Booking, WalletTransaction→Wallet, Review FKs, CouponUsage FKs, Dispute→Booking
- **SetNull**: BookingStatusHistory.changedById (preserve audit trail if actor user deleted), Booking.couponId (preserve booking if coupon deleted)

## Business Rules Enforced at DB Level
1. `users.email` UNIQUE — one account per email
2. `users.phone` UNIQUE — one account per phone
3. `user_roles` (userId, roleId) UNIQUE — no duplicate role assignments
4. `provider_services` (providerId, serviceId) UNIQUE — provider offers each service once
5. `reviews.bookingId` UNIQUE — one review per booking
6. `review_replies.reviewId` UNIQUE — one reply per review
7. `coupon_usages.bookingId` UNIQUE — one coupon per booking
8. `wallets.userId` UNIQUE — one wallet per user
9. `provider_availability` (providerId, dayOfWeek) UNIQUE — one schedule slot per day
10. `payments.transactionRef` UNIQUE — idempotency key for webhook processing

## Monetary Fields
All monetary values use `Decimal(10,2)` for exact arithmetic (no floating point errors)
- `wallet.balance`, `walletTransaction.amount`, `balanceBefore`, `balanceAfter`
- `booking.baseAmount`, `discountAmount`, `totalAmount`
- `payment.amount`
- `service.basePrice`, `providerService.customPrice`
- `coupon.discountValue`, `maxDiscount`, `minOrderValue`

## Immutable Tables (append-only by design)
- `booking_status_history`: no updatedAt field
- `wallet_transactions`: no updatedAt field
