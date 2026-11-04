export interface Booking {
  start: number;
  end: number;
  label: string;
}

export interface RoomState {
  blocked: boolean;
  currentTime: number;
  bookings: Booking[];
}

export type AvailabilityReason =
  | "available"
  | "invalid_interval"
  | "before_current_time"
  | "too_long"
  | "room_blocked"
  | "overlap";

export interface AvailabilityResult {
  available: boolean;
  reason: AvailabilityReason;
  message: string;
}

export const MAX_BOOKING_MINUTES = 120;
export const DAY_MINUTES = 1440;

export function checkAvailability(
  start: number,
  end: number,
  room: RoomState,
): AvailabilityResult {
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return {
      available: false,
      reason: "invalid_interval",
      message: "Start and end must be numeric minutes (0–1440).",
    };
  }

  // AC1: valid interval and start after current time
  if (!(start >= 0 && end > start && end <= DAY_MINUTES)) {
    return {
      available: false,
      reason: "invalid_interval",
      message: "Interval must satisfy 0 ≤ start < end ≤ 1440 minutes.",
    };
  }

  if (start <= room.currentTime) {
    return {
      available: false,
      reason: "before_current_time",
      message: `Start must be after the current time (${room.currentTime} min).`,
    };
  }

  // AC2: reject bookings longer than 120 minutes
  if (end - start > MAX_BOOKING_MINUTES) {
    return {
      available: false,
      reason: "too_long",
      message: `Bookings may not exceed ${MAX_BOOKING_MINUTES} minutes (requested ${end - start} min).`,
    };
  }

  // AC3: reject when room is blocked
  if (room.blocked) {
    return {
      available: false,
      reason: "room_blocked",
      message: "This room is currently blocked and cannot be booked.",
    };
  }

  // AC4: reject overlapping intervals (touching endpoints allowed)
  for (const b of room.bookings) {
    const overlaps = start < b.end && b.start < end;
    if (overlaps) {
      return {
        available: false,
        reason: "overlap",
        message: `Overlaps existing booking "${b.label}" (${b.start}–${b.end} min).`,
      };
    }
  }

  return {
    available: true,
    reason: "available",
    message: "This time slot is available.",
  };
}
