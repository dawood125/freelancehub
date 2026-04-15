# Testing Strategy

Last updated: 2026-04-15

## Current State

- Initial automated suite is established for payment hardening in `server/tests/paymentController.test.js`.

## Minimum Standards to Introduce

1. Backend integration tests for auth, orders, payments, reviews.
2. Unit tests for pure utility/service logic.
3. Frontend route smoke tests for critical pages.
4. Regression checks for checkout and order state transitions.

## Release Gate for Payment Work

- Payment intent create success/failure paths
- Webhook signature verification pass/fail
- Duplicate webhook/idempotency behavior
- Order state correctness after payment and refund events

Current gate status:
- Implemented and validated with automated tests.
