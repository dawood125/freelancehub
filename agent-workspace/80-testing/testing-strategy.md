# Testing Strategy

Last updated: 2026-04-30

## Current State

- Automated suites are established for:
	- Payment hardening in `server/tests/paymentController.test.js`
	- Messaging controller flows in `server/tests/messageController.test.js`
	- Notification controller flows in `server/tests/notificationController.test.js`

## Minimum Standards to Introduce

1. Backend integration tests for auth, orders, payments, reviews.
2. Unit tests for pure utility/service logic.
3. Frontend route smoke tests for critical pages.
4. Regression checks for checkout and order state transitions.
5. Regression checks for messaging read/unread state transitions and access guards.
6. Regression checks for notification read/unread state transitions and badge counts.

## Release Gate for Payment Work

- Payment intent create success/failure paths
- Webhook signature verification pass/fail
- Duplicate webhook/idempotency behavior
- Order state correctness after payment and refund events

Current gate status:
- Implemented and validated with automated tests.

## Release Gate for Messaging Work

- Conversation create/list/message/read controller success paths
- Controller async error forwarding behavior (`catchAsync`)
- Realtime `message:new` emit behavior from HTTP create endpoint

Current gate status:
- Implemented and validated with automated tests.

## Release Gate for Notifications Work

- Notification list/unread count endpoints
- Mark single notification and mark-all-read behavior
- Notification creation from live message/payment events

Current gate status:
- Implemented and validated with automated tests.
