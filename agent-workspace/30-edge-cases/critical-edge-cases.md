# Critical Edge Cases

Last updated: 2026-04-15

## Orders and Payments

- Webhook arrives before client success redirect.
- User refreshes checkout and retries payment quickly.
- Duplicate payment event processed twice.
- Cancellation requested after payment but before delivery starts.
- Refund succeeds in Stripe but local state update fails.

## Gigs

- Gig is paused/deleted while checkout is in progress.
- Package price changes between listing view and checkout submit.

## Reviews

- Buyer attempts multiple reviews for one order.
- Seller and buyer both try race-condition actions on completion/review windows.

## Auth

- OTP resend spam attempts.
- Password reset token reuse after successful reset.
