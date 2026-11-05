import type { RoomState } from "@/lib/availability";

export interface Room extends RoomState {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
}
