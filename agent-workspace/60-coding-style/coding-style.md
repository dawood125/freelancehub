# Coding Style and Delivery Rules

Last updated: 2026-04-15

## Core Style

- Prefer small, composable functions and clear naming.
- Avoid large unreviewable patches when not required.
- Keep behavior changes separate from pure styling/refactor changes when possible.
- Preserve existing API contracts unless migration is planned.

## Frontend Rules

- Use design tokens and shared UI utility classes over ad-hoc color values.
- Keep route pages readable by extracting reusable chunks when repeated.
- Ensure both light and dark themes remain consistent after UI changes.

## Backend Rules

- Keep controller logic thin where possible; move reusable logic to services/utils.
- Enforce authorization checks early in request lifecycle.
- Use consistent error shape and status code semantics.

## Commenting Rule

- Add comments only when logic is non-obvious; avoid obvious noise comments.
