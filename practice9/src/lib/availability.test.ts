import { describe, expect, it } from "vitest";
import { checkAvailability, type Booking, type RoomState } from "@/lib/availability";

function defaultRoom(): RoomState {
  return {
    blocked: false,
    currentTime: 540,
    bookings: [{ start: 600, end: 660, label: "Existing booking" } as Booking],
  };
}

describe("checkAvailability boundary tests (T01–T16)", () => {
  // T01 — AC4: touching after existing booking is available
  it("T01 AC4: touching after existing booking is available", () => {
    const room = defaultRoom();
    const result = checkAvailability(660, 720, room);
    expect(result.available).toBe(true);
    expect(result.reason).toBe("available");
  });

  // T02 — AC1: start exactly at current time is unavailable
  it("T02 AC1: start exactly at current time is unavailable", () => {
    const room = defaultRoom();
    const result = checkAvailability(540, 570, room);
    expect(result.available).toBe(false);
    expect(result.reason).toBe("before_current_time");
  });

  // T03 — AC1: zero duration is unavailable
  it("T03 AC1: zero duration is unavailable", () => {
    const room = defaultRoom();
    const result = checkAvailability(720, 720, room);
    expect(result.available).toBe(false);
    expect(result.reason).toBe("invalid_interval");
  });

  // T04 — AC1: reversed interval is unavailable
  it("T04 AC1: reversed interval is unavailable", () => {
    const room = defaultRoom();
    const result = checkAvailability(750, 720, room);
    expect(result.available).toBe(false);
    expect(result.reason).toBe("invalid_interval");
  });

  // T05 — AC1: end past end of day is unavailable
  it("T05 AC1: end past end of day is unavailable", () => {
    const room = defaultRoom();
    const result = checkAvailability(1380, 1441, room);
    expect(result.available).toBe(false);
    expect(result.reason).toBe("invalid_interval");
  });

  // T06 — AC2: exactly 120 minutes is available
  it("T06 AC2: exactly 120 minutes is available", () => {
    const room = defaultRoom();
    const result = checkAvailability(720, 840, room);
    expect(result.available).toBe(true);
    expect(result.reason).toBe("available");
  });

  // T07 — AC2: 121 minutes is unavailable
  it("T07 AC2: 121 minutes is unavailable", () => {
    const room = defaultRoom();
    const result = checkAvailability(720, 841, room);
    expect(result.available).toBe(false);
    expect(result.reason).toBe("too_long");
  });

  // T08 — AC4: touching before existing booking is available
  it("T08 AC4: touching before existing booking is available", () => {
    const room = defaultRoom();
    const result = checkAvailability(570, 600, room);
    expect(result.available).toBe(true);
    expect(result.reason).toBe("available");
  });

  // T09 — AC4: partial overlap is unavailable
  it("T09 AC4: partial overlap is unavailable", () => {
    const room = defaultRoom();
    const result = checkAvailability(630, 690, room);
    expect(result.available).toBe(false);
    expect(result.reason).toBe("overlap");
  });

  // T10 — AC4: candidate containing the existing booking is unavailable
  it("T10 AC4: candidate containing existing booking is unavailable", () => {
    const room = defaultRoom();
    const result = checkAvailability(570, 690, room);
    expect(result.available).toBe(false);
    expect(result.reason).toBe("overlap");
  });

  // T11 — AC4: candidate inside the existing booking is unavailable
  it("T11 AC4: candidate inside existing booking is unavailable", () => {
    const room = defaultRoom();
    const result = checkAvailability(615, 645, room);
    expect(result.available).toBe(false);
    expect(result.reason).toBe("overlap");
  });

  // T12 — AC4: identical interval is unavailable
  it("T12 AC4: identical interval is unavailable", () => {
    const room = defaultRoom();
    const result = checkAvailability(600, 660, room);
    expect(result.available).toBe(false);
    expect(result.reason).toBe("overlap");
  });

  // T13 — AC3: blocked room is unavailable
  it("T13 AC3: blocked room is unavailable", () => {
    const room = defaultRoom();
    room.blocked = true;
    const result = checkAvailability(660, 720, room);
    expect(result.available).toBe(false);
    expect(result.reason).toBe("room_blocked");
  });

  // T14 — AC4: overlapping interval with no bookings is available
  it("T14 AC4: overlapping interval with no bookings is available", () => {
    const room = defaultRoom();
    room.bookings = [];
    const result = checkAvailability(630, 690, room);
    expect(result.available).toBe(true);
    expect(result.reason).toBe("available");
  });

  // T15 — AC1: smallest start strictly after current time is available
  it("T15 AC1: smallest start strictly after current time is available", () => {
    const room = defaultRoom();
    const result = checkAvailability(541, 542, room);
    expect(result.available).toBe(true);
    expect(result.reason).toBe("available");
  });

  // T16 — AC1+AC2: 120 min ending exactly at end of day is available
  it("T16 AC1+AC2: 120 min ending exactly at end of day is available", () => {
    const room = defaultRoom();
    const result = checkAvailability(1320, 1440, room);
    expect(result.available).toBe(true);
    expect(result.reason).toBe("available");
  });

  // T17 — AC1: NaN input is rejected as invalid interval
  // Covers the existing numeric-validation branch (Number.isNaN guard) that T01–T16 do not exercise.
  it("T17 AC1: NaN start is rejected as invalid_interval", () => {
    const room = defaultRoom();
    const result = checkAvailability(NaN, 720, room);
    expect(result.available).toBe(false);
    expect(result.reason).toBe("invalid_interval");
  });

  // T18 — AC4: overlapping only the second of multiple bookings is rejected
  // Detects implementations that incorrectly check only the first booking in the list.
  it("T18 AC4: overlapping only the second booking is rejected", () => {
    const room = defaultRoom();
    room.bookings = [
      { start: 600, end: 660, label: "First booking" } as Booking,
      { start: 700, end: 760, label: "Second booking" } as Booking,
    ];
    const result = checkAvailability(730, 780, room);
    expect(result.available).toBe(false);
    expect(result.reason).toBe("overlap");
  });

  // T19 — AC3: blocked room takes precedence over overlap (new test, T13 unchanged)
  // Uses a candidate that overlaps an existing booking AND has blocked = true.
  // The blocked check runs before the overlap loop, so reason must be room_blocked.
  it("T19 AC3+AC4: blocked takes precedence over overlap", () => {
    const room = defaultRoom();
    room.blocked = true;
    const result = checkAvailability(630, 690, room);
    expect(result.available).toBe(false);
    expect(result.reason).toBe("room_blocked");
  });
});

describe("checkAvailability AC5 data preservation", () => {
  // AC5: calling checkAvailability must not mutate room.bookings (success path)
  it("AC5: does not mutate room.bookings on available result", () => {
    const room = defaultRoom();
    const before: Booking[] = room.bookings.map((b) => ({ ...b }));
    checkAvailability(660, 720, room);
    expect(room.bookings).toEqual(before);
    expect(room.bookings).toHaveLength(before.length);
    room.bookings.forEach((b, i) => {
      expect(b.start).toBe(before[i].start);
      expect(b.end).toBe(before[i].end);
      expect(b.label).toBe(before[i].label);
    });
  });

  // AC5: calling checkAvailability must not mutate room.bookings (rejected path)
  it("AC5: does not mutate room.bookings on overlapping rejected result", () => {
    const room = defaultRoom();
    const before: Booking[] = room.bookings.map((b) => ({ ...b }));
    checkAvailability(630, 690, room);
    expect(room.bookings).toEqual(before);
    expect(room.bookings).toHaveLength(before.length);
    room.bookings.forEach((b, i) => {
      expect(b.start).toBe(before[i].start);
      expect(b.end).toBe(before[i].end);
      expect(b.label).toBe(before[i].label);
    });
  });
});
