# Security Checklist

Last updated: 2026-04-15

## Authentication and Session

- [ ] Ensure JWT secret rotation strategy exists
- [ ] Validate token expiry and refresh flow strategy
- [ ] Add brute-force/rate-limit protections on auth endpoints
- [ ] Verify password reset and OTP flows have replay protection

## Payments

- [x] Verify Stripe webhook signatures strictly
- [x] Add idempotency handling for payment/order creation
- [x] Protect against duplicate order generation
- [x] Validate refund flow and cancellation state sync

## Authorization

- [ ] Ensure buyer/seller ownership checks on all order actions
- [ ] Ensure role checks for gig create/edit/delete
- [ ] Ensure review creation allowed only for completed eligible orders

## Data Safety

- [ ] Validate all request payloads with centralized validators
- [ ] Sanitize user-generated content where needed
- [ ] Confirm sensitive fields are excluded from API responses
