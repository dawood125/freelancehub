# Decision Log

## 2026-04-15

Decision:
- Create a root-level `agent-workspace/` folder to preserve long-term context and prevent plan drift between sessions.

Reason:
- Project continuity was lost due to context switching after UI work.

Impact:
- Future sessions can resume from plan/state quickly with lower rework.

---

Decision:
- Prioritize UI/UX stabilization before resuming backend hardening roadmap.

Reason:
- The UI pass was required to establish product baseline and improve usability.

Impact:
- Next work should now move to backend business-critical features (payment hardening).

---

## 2026-04-15 (Payment Hardening - Step 1)

Decision:
- Enforce checkout idempotency using `x-idempotency-key`, persisted in order payment metadata.

Reason:
- Prevent duplicate order/payment-intent creation from retries or double-submits.

Impact:
- Repeated checkout requests for the same attempt now reuse the same PaymentIntent instead of creating duplicates.

Decision:
- Make webhook handling race-safe with atomic state transition from `pending_payment` to `pending_requirements`.

Reason:
- Stripe can retry webhook deliveries; duplicate events must not double-increment gig order stats or reprocess state.

Impact:
- Payment success transition is idempotent and operationally safer under retries.

---

## 2026-04-15 (Payment Hardening - Step 2)

Decision:
- Implement paid-order cancellation refunds through Stripe before finalizing local cancellation state.

Reason:
- Prevent local cancellation from drifting away from real payment state.

Impact:
- Paid cancellations now create and persist refund metadata (`refundId`, `refundedAt`, `refundAmount`) for traceability.

Decision:
- Add `charge.refunded` webhook synchronization to keep local payment status aligned when refunds happen externally.

Reason:
- Refunds can occur outside the cancel endpoint; local status still must remain accurate.

Impact:
- Local payment status auto-syncs to `refunded` when Stripe sends refund events.

---

## 2026-04-15 (Payment Hardening - Step 3)

Decision:
- Add automated controller-level tests for payment idempotency, webhook retry safety, and refund synchronization.

Reason:
- Milestone completion required verifiable safety behavior, not only implementation changes.

Impact:
- Payment Hardening Sprint now has repeatable automated verification and is ready to close.

---

## 2026-04-16 (Messaging Sprint - Step 1)

Decision:
- Implement messaging as a dedicated module with `Conversation` and `Message` models plus a shared `messageService` for access-safe business logic.

Reason:
- Keeps controller and socket event handlers thin while reusing the same authorization and state updates across HTTP and real-time channels.

Impact:
- Messaging APIs and socket handlers now share consistent participant checks and unread-count behavior.

Decision:
- Bind conversations to orders (one conversation per order) for the initial milestone slice.

Reason:
- Strongest role-safety baseline with existing marketplace entities and avoids uncontrolled cross-user chat creation.

Impact:
- Buyer and seller can communicate with explicit order-linked access control, with room to expand to pre-order chat later.

Decision:
- Build first chat UI as a dedicated `/messages` page with conversation list + thread pane + unread badge on navbar.

Reason:
- Delivers a complete vertical slice quickly while staying aligned with current route/navigation architecture.

Impact:
- Messaging is now accessible end-to-end from UI and can be iterated with richer UX features in later milestones.

---

## 2026-04-16 (Messaging Sprint - Stability Fixes)

Decision:
- Treat `/api/messages/conversations` 404 as runtime drift (stale process) rather than route wiring failure after verifying route exists in source app execution.

Reason:
- Source-level app check returned `401` on `/api/messages/conversations`, proving route is mounted.

Impact:
- Troubleshooting guidance now includes backend restart/process validation when route mismatch appears.

Decision:
- Remove forced scroll-to-top on package selection in gig detail compare table and strengthen order/contact action flows.

Reason:
- Package selection UX was disruptive and could block perceived checkout progression.

Impact:
- Package selection remains in context, checkout navigation remains stable, and contact flow now routes through order-based messaging.
