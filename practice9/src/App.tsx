import { DoorOpen } from "lucide-react";
import { ALL_EQUIPMENT } from "@/lib/rooms";
import { useRoomSelection } from "@/hooks/useRoomSelection";
import RoomSelector from "@/components/RoomSelector";
import RoomContextCard from "@/components/RoomContextCard";
import AvailabilityForm from "@/components/AvailabilityForm";
import ResultBanner from "@/components/ResultBanner";
import Timeline from "@/components/Timeline";
import EmptyState from "@/components/EmptyState";

function App() {
  const {
    selectedRoomId,
    attendees,
    requiredEquipment,
    filteredRooms,
    room,
    result,
    pendingStart,
    pendingEnd,
    handleResult,
    handlePending,
    handleAttendeesChange,
    handleEquipmentToggle,
    handleRoomSelect,
  } = useRoomSelection();

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
