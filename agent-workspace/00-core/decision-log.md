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
