# Smart Campus Room Availability Checker

A single-page web application for checking study room availability on a fictional campus. Users filter rooms by attendee count and required equipment, select a room, and check whether a requested time slot is available against that room's existing bookings.

Booking data is fictional and in-memory. No database, API, login, or external services are used.

## Technologies

- React 18 + TypeScript 5
- Vite 5 (build tool and dev server)
- Tailwind CSS 3 (styling)
- lucide-react (icons)
- Vitest 2 (unit testing)

## Fictional Rooms

The catalog (`src/lib/rooms.ts`) contains five rooms:

| ID | Name | Capacity | Equipment | Blocked | Bookings |
|----|------|----------|-----------|---------|----------|
| b-204 | B-204 · Engineering Block | 30 | projector, whiteboard | No | Calculus 101 (600–660) |
| a-101 | A-101 · Lecture Hall | 100 | projector, microphone, whiteboard | No | Physics 201 (540–600), Chemistry 110 (700–760) |
| c-310 | C-310 · Seminar Room | 12 | whiteboard | Yes | Maintenance review (550–570) |
| d-105 | D-105 · Computer Lab | 20 | projector, computers, lab-kit | No | Coding workshop (660–720) |
| e-202 | E-202 · Study Room | 6 | whiteboard, tv | No | None |

Current time is fixed at 540 minutes (09:00).

## Filtering and Availability

**Room filtering** (`src/lib/filterRooms.ts`):

- F1: Room capacity must be at least the requested attendee count.
- F2: Room must contain all selected equipment items.
- F3: Blocked rooms are excluded from available choices.
- F4: A clear empty state is shown when no rooms match.
- F5: Switching rooms or changing filters clears stale availability results.

**Availability validation** (`src/lib/availability.ts`):

- AC1: Valid time inputs (0 ≤ start < end ≤ 1440), with the booking start not earlier than the fixed current time.
- AC2: Maximum booking duration of 120 minutes.
- AC3: Blocked rooms cannot be reported as available.
- AC4: Correct booking overlap rules, including touching endpoints.
- AC5: Original booking data is not mutated.
- AC6: Clear and responsive user feedback.

## Prerequisites

- Node.js 18+ (required by Vite 5)
- npm 9+

## Commands

```bash
npm install        # install dependencies
npm run dev        # start the dev server
npm run test       # run the test suite (vitest)
npm run typecheck  # type-check with tsc (no emit)
npm run build      # production build
```

## Project Structure

```
src/
├── App.tsx                      # top-level state, room selection, result/pending state
├── main.tsx                     # React root mount
├── index.css                    # Tailwind directives
├── components/
│   ├── AvailabilityForm.tsx     # start/end inputs, live validation, check button
│   ├── EmptyState.tsx           # shown when no rooms match the filters
│   ├── ResultBanner.tsx         # available/unavailable result with message
│   ├── RoomContextCard.tsx      # current time, room status, bookings summary
│   ├── RoomSelector.tsx         # attendee/equipment filters and room cards
│   └── Timeline.tsx             # visual 0–1440 day timeline
├── lib/
│   ├── availability.ts          # pure checkAvailability function (AC1–AC5)
│   ├── availability.test.ts     # 21 unit tests for checkAvailability
│   ├── filterRooms.ts           # pure filterRooms function (F1–F3)
│   ├── filterRooms.test.ts      # 12 unit tests for filterRooms
│   ├── roomSwitching.test.ts    # 6 tests for F5 room-switching behavior
│   ├── format.ts                # minutesToClock helper
│   ├── rooms.ts                 # fictional room catalog + current time
│   └── types.ts                 # Room interface
```

## Known Limitations

- All booking data is fictional and in-memory; nothing is persisted across reloads.
- Room-switching behavior (F5) is tested at the logic level, not via rendered DOM interactions, because no UI testing library is installed.
- Blocked status is a read-only catalog property; the original interactive toggle was removed.
- No authentication, payments, live APIs, or database integration.

## Test Results

Final verification reported by Bolt.new on November 4, 2026:

- `npm run test` — 39 passed, 0 failed (3 test files).
- `npm run typecheck` — 0 errors.
- `npm run build` — succeeded.

The test results are also documented in the Assignment #04 report.
