import { useCallback, useMemo, useState } from "react";
import { DoorOpen } from "lucide-react";
import type { AvailabilityResult } from "@/lib/availability";
import { ROOMS, ALL_EQUIPMENT, CURRENT_TIME } from "@/lib/rooms";
import { filterRooms } from "@/lib/filterRooms";
import type { Room } from "@/lib/types";
import RoomSelector from "@/components/RoomSelector";
import RoomContextCard from "@/components/RoomContextCard";
import AvailabilityForm from "@/components/AvailabilityForm";
import ResultBanner from "@/components/ResultBanner";
import Timeline from "@/components/Timeline";
import EmptyState from "@/components/EmptyState";

const firstAvailableId = ROOMS.find((r) => !r.blocked)?.id ?? ROOMS[0].id;

function App() {
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

  const handleResult = useCallback((r: AvailabilityResult | null) => {
    setResult(r);
  }, []);

  const handlePending = useCallback((s: number | null, e: number | null) => {
    setPendingStart(s);
    setPendingEnd(e);
  }, []);

  const handleAttendeesChange = useCallback((count: number) => {
    setAttendees(count);
    setResult(null);
    setPendingStart(null);
    setPendingEnd(null);
  }, []);

  const handleEquipmentToggle = useCallback((item: string) => {
    setRequiredEquipment((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item],
    );
    setResult(null);
    setPendingStart(null);
    setPendingEnd(null);
  }, []);

  const handleRoomSelect = useCallback((id: string) => {
    setSelectedRoomId(id);
    setResult(null);
    setPendingStart(null);
    setPendingEnd(null);
  }, []);

  const room = selectedRoom ?? {
    id: "",
    name: "",
    capacity: 0,
    equipment: [],
    blocked: true,
    currentTime: CURRENT_TIME,
    bookings: [],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <header className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
            <DoorOpen size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Smart Campus Room Availability
            </h1>
            <p className="text-sm text-slate-500">
              {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </header>

        {/* Room selector with filters */}
        <RoomSelector
          filteredRooms={filteredRooms}
          selectedRoomId={room.id}
          allEquipment={ALL_EQUIPMENT}
          attendees={attendees}
          requiredEquipment={requiredEquipment}
          onAttendeesChange={handleAttendeesChange}
          onEquipmentToggle={handleEquipmentToggle}
          onRoomSelect={handleRoomSelect}
        />

        {filteredRooms.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Context */}
            <RoomContextCard room={room} />

            {/* Timeline */}
            <Timeline
              currentTime={room.currentTime}
              bookings={room.bookings}
              pendingStart={pendingStart}
              pendingEnd={pendingEnd}
              result={result}
            />

            {/* Form */}
            <AvailabilityForm
              room={room}
              onResult={handleResult}
              onPendingChange={handlePending}
            />

            {/* Result */}
            <ResultBanner result={result} />
          </>
        )}

        {/* Footer note */}
        <p className="pb-4 text-center text-xs text-slate-400">
          Prototype · fictional sample data · no bookings are saved
        </p>
      </div>
    </div>
  );
}

export default App;
