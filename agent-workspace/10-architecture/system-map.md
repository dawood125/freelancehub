# System Map

Last updated: 2026-04-15

## High-Level Structure

- `client/`: React SPA
- `server/`: Express + MongoDB API

## Backend Modules (Current)

- Authentication
- User profile management
- Gig management and discovery
- Order lifecycle
- Payment endpoints
- Review endpoints
- Category endpoints

## Frontend Module Shape (Current)

- Route pages organized by domain in `client/src/pages`
- API communication through service layer in `client/src/services`
- App routing configured with lazy-loaded page chunks

## Architectural Focus Next

1. Payment transaction safety and webhook integrity
2. Event-driven notifications/messages foundation
3. Better testability and guardrails around state transitions
