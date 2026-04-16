# Current Plan

Last updated: 2026-04-15

## Completed Milestones

1. Premium UI redesign and consistency pass
2. Frontend route-level lazy loading and bundle split improvements
3. Payment Hardening Sprint

## Active Milestone

4. Messaging Sprint

Goal:
- Build conversation/message models and real-time socket events.

Work items:
- [x] Define conversation and message schemas with role-safe access rules.
- [x] Implement messaging APIs for list/create/read/update message states.
- [x] Add Socket.IO room and event flow for real-time delivery.
- [x] Build basic chat UI page and unread indicators.

Messaging milestone status:
- In progress.

Completed now:
- Added `Conversation` and `Message` models with indexes and unread tracking.
- Added messaging service layer for conversation creation, message send/read, pagination, and access guards.
- Added protected message routes and controller endpoints.
- Added Socket.IO server with JWT-authenticated connections and conversation room events.
- Wired sockets into server startup and message routes into API app.
- Fixed gig detail package selection UX (removed forced top scroll) and strengthened contact-to-conversation entry path.
- Verified messaging route existence directly in source app runtime (`/api/messages/conversations` returns `401` when unauthenticated).

Remaining in milestone:
- Add messaging-specific automated tests.

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

## Next Milestones (After Messaging)

5. Notifications Sprint
- Build event-driven notification model, API, and UI panel.

6. Dashboard Sprint
- Build seller, client, and admin analytics surfaces.
