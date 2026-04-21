# Current Plan

Last updated: 2026-04-21

## Completed Milestones

1. Premium UI redesign and consistency pass
2. Frontend route-level lazy loading and bundle split improvements
3. Payment Hardening Sprint
4. Messaging Sprint

## Active Milestone

5. Notifications Sprint

Goal:
- Build event-driven notification model, API, and UI panel.

Pre-start adjustments completed:
- Messaging module UX consistency pass completed (chat pane scroll constraints, sender identity rendering fixes, and live presence indicators).

Work items:
- [ ] Define notification schema and event taxonomy (order/message/review/payment triggers).
- [ ] Implement protected notification APIs (list, mark-read, mark-all-read).
- [ ] Add notification UI entry point (navbar badge + panel/page).
- [ ] Add notification automated tests for lifecycle and access behavior.

Messaging milestone status:
- Complete.

Completed now:
- Added `Conversation` and `Message` models with indexes and unread tracking.
- Added messaging service layer for conversation creation, message send/read, pagination, and access guards.
- Added protected message routes and controller endpoints.
- Added Socket.IO server with JWT-authenticated connections and conversation room events.
- Wired sockets into server startup and message routes into API app.
- Fixed gig detail package selection UX (removed forced top scroll) and strengthened contact-to-conversation entry path.
- Verified messaging route existence directly in source app runtime (`/api/messages/conversations` returns `401` when unauthenticated).
- Added `server/tests/messageController.test.js` covering conversation create/list/read flows, socket emit behavior, and controller error forwarding.
- Verified backend suite passes with `messageController.test.js` and `paymentController.test.js`.

Remaining in milestone:
- None. Milestone is complete.

## Milestone 3 Progress Notes

Completed now:
- Backend create-intent flow reuses existing order/payment intent when same idempotency key is reused.
- Order model stores payment idempotency key with unique sparse index.
- Stripe webhook success path uses atomic transition to avoid duplicate processing.
- Frontend checkout sends a stable attempt idempotency key per checkout session.
- Paid-order cancellation now creates Stripe refund before final cancellation save.
- Refund metadata is persisted on order payment state.
- `charge.refunded` webhook sync updates local payment state when refund occurs externally.

Remaining in milestone:
- None. Milestone is complete.

## Next Milestones (After Notifications)

6. Dashboard Sprint
- Build seller, client, and admin analytics surfaces.
