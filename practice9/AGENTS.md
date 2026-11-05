## Project

Smart Campus Room Availability Checker. A React/TypeScript application with fictional room data, a fixed current time, room filtering, and availability checking.

## Project Structure

- src/lib/availability.ts: pure booking availability rules.
- src/lib/filterRooms.ts: room filtering rules.
- src/lib/rooms.ts: fictional room fixtures.
- src/components/: user interface components.
- src/App.tsx: application state and component integration.
- src/lib/*.test.ts: existing regression tests.

## Constraints

- Preserve acceptance criteria AC1–AC6 and existing filtering behavior.
- Reject invalid or past time requests, bookings longer than 120 minutes, blocked rooms, and overlapping bookings.
- Allow bookings touching only at endpoints.
- Never mutate room or booking fixture data.
- Preserve clear responsive feedback on desktop and mobile.
- Do not introduce authentication, a backend, database, or booking creation.

## Engineering Rules

- Prefer pure functions and minimal changes.
- Use at most two justified design patterns.
- Focus on one real maintainability problem.
- Keep existing booking logic and UI behavior unchanged.
- Do not remove or weaken existing tests.

## Verification

- Inspect package.json and document the actual available test, type-check, and build commands.
- Run existing tests and add focused regression tests for any changed behavior.
- Report changed files, rationale, test results, and remaining limitations.
