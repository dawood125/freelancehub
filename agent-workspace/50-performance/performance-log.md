# Performance Log

Last updated: 2026-04-15

## Completed

- Route-level lazy loading added in app router.
- Build output now splits pages into separate chunks.

## Frontend Next

- Add route prefetch on intent (hover/focus) for core navigation.
- Add route-level error boundaries next to suspense fallback.
- Track LCP/CLS/TBT baseline in production-like runs.

## Backend Next

- Measure p95 latency for auth, gigs, orders, checkout, and reviews.
- Add query profiling on high-traffic endpoints.
- Prevent duplicate expensive operations in payment flow with idempotency guards.
