import { useCallback, useState } from "react";
import { DoorOpen } from "lucide-react";
import type { AvailabilityResult, RoomState } from "@/lib/availability";
import RoomContextCard from "@/components/RoomContextCard";
import AvailabilityForm from "@/components/AvailabilityForm";
import ResultBanner from "@/components/ResultBanner";
import Timeline from "@/components/Timeline";

const INITIAL_ROOM: RoomState = {
  currentTime: 540,
  blocked: false,
  bookings: [{ start: 600, end: 660, label: "Calculus 101" }],
};

function App() {
  const [room, setRoom] = useState<RoomState>(INITIAL_ROOM);

  const toggleBlocked = useCallback(() => {
    setRoom((prev) => ({ ...prev, blocked: !prev.blocked }));
    setResult(null);
  }, []);
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [pendingStart, setPendingStart] = useState<number | null>(null);
  const [pendingEnd, setPendingEnd] = useState<number | null>(null);

  const handleResult = useCallback((r: AvailabilityResult | null) => {
    setResult(r);
  }, []);

  const handlePending = useCallback((s: number | null, e: number | null) => {
    setPendingStart(s);
    setPendingEnd(e);
  }, []);

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
              Room&nbsp;
              <span className="font-medium text-slate-700">B-204 · Engineering Block</span>
            </p>
          </div>
        </header>

        {/* Context */}
        <RoomContextCard room={room} onToggleBlocked={toggleBlocked} />

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

        {/* Footer note */}
        <p className="pb-4 text-center text-xs text-slate-400">
          Prototype · fictional sample data · no bookings are saved
        </p>
      </div>
    </div>
  );
}

export default App;
