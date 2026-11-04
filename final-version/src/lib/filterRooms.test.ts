import { describe, expect, it } from "vitest";
import { filterRooms } from "@/lib/filterRooms";
import { ROOMS } from "@/lib/rooms";

const noEquip = { attendees: 1, requiredEquipment: [] };

describe("filterRooms F1 — capacity >= attendees", () => {
  it("F1: includes rooms whose capacity exactly equals attendees", () => {
    const result = filterRooms(ROOMS, { attendees: 30, requiredEquipment: [] });
    const ids = result.map((r) => r.id);
    expect(ids).toContain("b-204");
  });

  it("F1: excludes rooms whose capacity is below attendees", () => {
    const result = filterRooms(ROOMS, { attendees: 31, requiredEquipment: [] });
    expect(result.map((r) => r.id)).not.toContain("b-204");
  });

  it("F1: includes all non-blocked rooms when attendees is 1", () => {
    const result = filterRooms(ROOMS, noEquip);
    const ids = result.map((r) => r.id);
    expect(ids).toContain("b-204");
    expect(ids).toContain("a-101");
    expect(ids).toContain("d-105");
    expect(ids).toContain("e-202");
    expect(ids).not.toContain("c-310");
  });
});

describe("filterRooms F2 — ALL required equipment", () => {
  it("F2: includes rooms that have every required item", () => {
    const result = filterRooms(ROOMS, {
      attendees: 1,
      requiredEquipment: ["projector", "whiteboard"],
    });
    const ids = result.map((r) => r.id);
    expect(ids).toContain("b-204");
    expect(ids).toContain("a-101");
    expect(ids).not.toContain("e-202");
  });

  it("F2: excludes rooms missing any single required item", () => {
    const result = filterRooms(ROOMS, {
      attendees: 1,
      requiredEquipment: ["projector", "microphone"],
    });
    const ids = result.map((r) => r.id);
    expect(ids).toContain("a-101");
    expect(ids).not.toContain("b-204");
    expect(ids).not.toContain("d-105");
  });

  it("F2: empty requiredEquipment matches on equipment alone", () => {
    const result = filterRooms(ROOMS, noEquip);
    expect(result.length).toBe(4);
  });
});

describe("filterRooms F3 — blocked rooms excluded", () => {
  it("F3: blocked rooms never appear in results", () => {
    const result = filterRooms(ROOMS, noEquip);
    expect(result.map((r) => r.id)).not.toContain("c-310");
  });

  it("F3: blocked room excluded even when it would match capacity and equipment", () => {
    const result = filterRooms(ROOMS, {
      attendees: 1,
      requiredEquipment: ["whiteboard"],
    });
    const ids = result.map((r) => r.id);
    expect(ids).not.toContain("c-310");
    expect(ids).toContain("b-204");
  });
});

describe("filterRooms F4 — empty result when nothing matches", () => {
  it("F4: returns empty array when attendees exceeds all capacities", () => {
    const result = filterRooms(ROOMS, { attendees: 200, requiredEquipment: [] });
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it("F4: returns empty array when no room has the required equipment", () => {
    const result = filterRooms(ROOMS, {
      attendees: 1,
      requiredEquipment: ["nonexistent"],
    });
    expect(result).toHaveLength(0);
  });

  it("F4: returns empty array when combined filters exclude everything", () => {
    const result = filterRooms(ROOMS, {
      attendees: 50,
      requiredEquipment: ["tv"],
    });
    expect(result).toHaveLength(0);
  });
});

describe("filterRooms data preservation", () => {
  it("does not mutate the input rooms array or its elements", () => {
    const snapshot = ROOMS.map((r) => ({
      ...r,
      equipment: [...r.equipment],
      bookings: r.bookings.map((b) => ({ ...b })),
    }));
    filterRooms(ROOMS, { attendees: 10, requiredEquipment: ["projector"] });
    expect(ROOMS).toEqual(snapshot);
  });
});
