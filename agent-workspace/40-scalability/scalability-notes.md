# Scalability Notes

Last updated: 2026-04-15

## Current Risk Areas

- Order and payment workflows can become hot paths under load.
- Search queries can degrade without proper indexing and pagination discipline.
- Review aggregation can become expensive if recalculated naively.

## Guardrails

- Keep pagination defaults and hard caps on list endpoints.
- Index query-critical fields in orders, gigs, and reviews.
- Move expensive aggregation to scheduled/materialized strategies if needed.
- Prepare Redis caching strategy for hot listing/search responses.

## Near-Term Scalability Actions

1. Review and document all Mongo indexes used by top endpoints.
2. Add endpoint-level latency logging for search/orders/payments.
3. Define thresholds that trigger optimization work.
