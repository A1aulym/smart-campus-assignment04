import type { Room } from "@/lib/types";

export interface RoomFilter {
  attendees: number;
  requiredEquipment: string[];
}

export function filterRooms(rooms: Room[], filter: RoomFilter): Room[] {
  return rooms.filter((room) => {
    if (room.blocked) return false;
    if (room.capacity < filter.attendees) return false;
    for (const item of filter.requiredEquipment) {
      if (!room.equipment.includes(item)) return false;
    }
    return true;
  });
}
