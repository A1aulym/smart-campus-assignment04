import { useCallback, useMemo, useState } from "react";
import { ROOMS, CURRENT_TIME } from "@/lib/rooms";
import { filterRooms } from "@/lib/filterRooms";
import type { AvailabilityResult } from "@/lib/availability";
import type { Room } from "@/lib/types";

const firstAvailableId = ROOMS.find((r) => !r.blocked)?.id ?? ROOMS[0].id;

const FALLBACK_ROOM: Room = {
  id: "",
  name: "",
  capacity: 0,
  equipment: [],
  blocked: true,
  currentTime: CURRENT_TIME,
  bookings: [],
};

export interface RoomSelection {
  selectedRoomId: string;
  attendees: number;
  requiredEquipment: string[];
  filteredRooms: Room[];
  selectedRoom: Room | undefined;
  room: Room;
  result: AvailabilityResult | null;
  pendingStart: number | null;
  pendingEnd: number | null;
  handleResult: (r: AvailabilityResult | null) => void;
  handlePending: (s: number | null, e: number | null) => void;
  handleAttendeesChange: (count: number) => void;
  handleEquipmentToggle: (item: string) => void;
  handleRoomSelect: (id: string) => void;
}

export function useRoomSelection(): RoomSelection {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(firstAvailableId);
  const [attendees, setAttendees] = useState<number>(1);
  const [requiredEquipment, setRequiredEquipment] = useState<string[]>([]);
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [pendingStart, setPendingStart] = useState<number | null>(null);
  const [pendingEnd, setPendingEnd] = useState<number | null>(null);

  const filteredRooms = useMemo(
    () => filterRooms(ROOMS, { attendees, requiredEquipment }),
    [attendees, requiredEquipment],
  );

  const selectedRoom: Room | undefined = useMemo(
    () =>
      filteredRooms.find((r) => r.id === selectedRoomId) ??
      filteredRooms[0],
    [filteredRooms, selectedRoomId],
  );

  const clearStale = useCallback(() => {
    setResult(null);
    setPendingStart(null);
    setPendingEnd(null);
  }, []);

  const handleResult = useCallback((r: AvailabilityResult | null) => {
    setResult(r);
  }, []);

  const handlePending = useCallback((s: number | null, e: number | null) => {
    setPendingStart(s);
    setPendingEnd(e);
  }, []);

  const handleAttendeesChange = useCallback((count: number) => {
    setAttendees(count);
    clearStale();
  }, [clearStale]);

  const handleEquipmentToggle = useCallback((item: string) => {
    setRequiredEquipment((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item],
    );
    clearStale();
  }, [clearStale]);

  const handleRoomSelect = useCallback((id: string) => {
    setSelectedRoomId(id);
    clearStale();
  }, [clearStale]);

  const room = selectedRoom ?? FALLBACK_ROOM;

  return {
    selectedRoomId,
    attendees,
    requiredEquipment,
    filteredRooms,
    selectedRoom,
    room,
    result,
    pendingStart,
    pendingEnd,
    handleResult,
    handlePending,
    handleAttendeesChange,
    handleEquipmentToggle,
    handleRoomSelect,
  };
}
