import { describe, expect, it } from "vitest";
import { ROOMS } from "@/lib/rooms";
import { filterRooms } from "@/lib/filterRooms";
import { checkAvailability } from "@/lib/availability";

const noEquip = { attendees: 1, requiredEquipment: [] };

function findRoom(id: string) {
  const room = ROOMS.find((r) => r.id === id);
  if (!room) throw new Error(`Room ${id} not found`);
  return room;
}

describe("F5: room switching refreshes availability result", () => {
  it("switching rooms uses the new room's own bookings", () => {
    const b204 = findRoom("b-204");
    const d105 = findRoom("d-105");

    const resultB204 = checkAvailability(630, 690, b204);
    expect(resultB204.reason).toBe("overlap");

    const resultD105 = checkAvailability(570, 600, d105);
    expect(resultD105.reason).toBe("available");
    expect(resultD105.available).toBe(true);
  });

  it("switching to a room with different bookings changes the overlap outcome", () => {
    const b204 = findRoom("b-204");
    const a101 = findRoom("a-101");

    const resultB204 = checkAvailability(540, 570, b204);
    expect(resultB204.reason).toBe("before_current_time");

    const resultA101 = checkAvailability(550, 570, a101);
    expect(resultA101.reason).toBe("overlap");
  });

  it("filterRooms result drives which rooms are selectable", () => {
    const filtered = filterRooms(ROOMS, { attendees: 50, requiredEquipment: [] });
    const ids = filtered.map((r) => r.id);
    expect(ids).toEqual(["a-101"]);

    const result = checkAvailability(610, 670, findRoom(ids[0]));
    expect(result.available).toBe(true);
  });

  it("removing equipment filter re-adds previously excluded rooms", () => {
    const withFilter = filterRooms(ROOMS, {
      attendees: 1,
      requiredEquipment: ["projector"],
    });
    expect(withFilter.map((r) => r.id)).not.toContain("e-202");

    const withoutFilter = filterRooms(ROOMS, noEquip);
    expect(withoutFilter.map((r) => r.id)).toContain("e-202");
  });

  it("a blocked room is never in the filtered selectable set", () => {
    const filtered = filterRooms(ROOMS, noEquip);
    expect(filtered.map((r) => r.id)).not.toContain("c-310");
  });

  it("all five rooms have unique IDs and required catalog fields", () => {
    const ids = ROOMS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(4);
    for (const room of ROOMS) {
      expect(room.id).toBeTruthy();
      expect(room.name).toBeTruthy();
      expect(room.capacity).toBeGreaterThan(0);
      expect(Array.isArray(room.equipment)).toBe(true);
      expect(typeof room.blocked).toBe("boolean");
      expect(Array.isArray(room.bookings)).toBe(true);
    }
  });
});
