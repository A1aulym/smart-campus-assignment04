import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { minutesToClock } from "@/lib/format";
import {
  checkAvailability,
  type AvailabilityResult,
  type RoomState,
  MAX_BOOKING_MINUTES,
  DAY_MINUTES,
} from "@/lib/availability";

interface AvailabilityFormProps {
  room: RoomState;
  onResult: (r: AvailabilityResult | null) => void;
  onPendingChange: (start: number | null, end: number | null) => void;
}

export default function AvailabilityForm({
  room,
  onResult,
  onPendingChange,
}: AvailabilityFormProps) {
  const [startStr, setStartStr] = useState("");
  const [endStr, setEndStr] = useState("");
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  useEffect(() => {
    onResult(result);
  }, [result, onResult]);

  useEffect(() => {
    const s = startStr === "" ? null : Number(startStr);
    const e = endStr === "" ? null : Number(endStr);
    onPendingChange(s, e);
  }, [startStr, endStr, onPendingChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = Number(startStr);
    const end = Number(endStr);
    setResult(checkAvailability(start, end, room));
  };

  const duration =
    startStr && endStr && !Number.isNaN(Number(startStr)) && !Number.isNaN(Number(endStr))
      ? Number(endStr) - Number(startStr)
      : null;

  const tooLong = duration !== null && duration > MAX_BOOKING_MINUTES;
  const invalidOrder =
    startStr && endStr && Number(startStr) >= Number(endStr);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 text-sm font-semibold tracking-wide text-slate-700 uppercase">
        Check Availability
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Start */}
        <div>
          <label htmlFor="start" className="mb-1 block text-sm font-medium text-slate-700">
            Start (min after midnight)
          </label>
          <input
            id="start"
            type="number"
            min={0}
            max={DAY_MINUTES}
            value={startStr}
            onChange={(e) => setStartStr(e.target.value)}
            placeholder="e.g. 660"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
          {startStr !== "" && !Number.isNaN(Number(startStr)) && (
            <p className="mt-1 text-xs text-slate-400">{minutesToClock(Number(startStr))}</p>
          )}
        </div>

        {/* End */}
        <div>
          <label htmlFor="end" className="mb-1 block text-sm font-medium text-slate-700">
            End (min after midnight)
          </label>
          <input
            id="end"
            type="number"
            min={0}
            max={DAY_MINUTES}
            value={endStr}
            onChange={(e) => setEndStr(e.target.value)}
            placeholder="e.g. 720"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
          {endStr !== "" && !Number.isNaN(Number(endStr)) && (
            <p className="mt-1 text-xs text-slate-400">{minutesToClock(Number(endStr))}</p>
          )}
        </div>
      </div>

      {/* Live validation hints */}
      <div className="mt-3 space-y-1">
        {invalidOrder && (
          <p className="text-xs text-rose-600">Start must be before end.</p>
        )}
        {tooLong && (
          <p className="text-xs text-rose-600">
            Duration {duration} min exceeds the {MAX_BOOKING_MINUTES}-minute limit.
          </p>
        )}
        {duration !== null && !tooLong && !invalidOrder && duration > 0 && (
          <p className="text-xs text-slate-500">
            Duration: {duration} min
          </p>
        )}
      </div>

      <button
        type="submit"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-sky-700 active:scale-[0.99] sm:w-auto"
      >
        <Search size={18} />
        Check Availability
      </button>
    </form>
  );
}
