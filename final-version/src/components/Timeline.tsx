import { minutesToClock } from "@/lib/format";
import type { Booking, AvailabilityResult } from "@/lib/availability";
import { DAY_MINUTES } from "@/lib/availability";

interface TimelineProps {
  currentTime: number;
  bookings: Booking[];
  pendingStart: number | null;
  pendingEnd: number | null;
  result: AvailabilityResult | null;
}

const TICK_MARKS = [0, 180, 360, 540, 720, 900, 1080, 1260, 1440];

export default function Timeline({
  currentTime,
  bookings,
  pendingStart,
  pendingEnd,
  result,
}: TimelineProps) {
  const pct = (m: number) => `${(m / DAY_MINUTES) * 100}%`;

  const pendingValid =
    pendingStart !== null &&
    pendingEnd !== null &&
    pendingStart >= 0 &&
    pendingEnd > pendingStart &&
    pendingEnd <= DAY_MINUTES;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">
          Day Timeline · 00:00 → 24:00
        </h2>
        <span className="text-xs text-slate-400">minutes after midnight</span>
      </div>

      {/* Track */}
      <div className="relative h-12 w-full overflow-hidden rounded-lg bg-slate-100">
        {/* Existing bookings */}
        {bookings.map((b, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 bg-slate-300"
            style={{ left: pct(b.start), width: `${((b.end - b.start) / DAY_MINUTES) * 100}%` }}
            title={`Existing booking: ${b.label} (${b.start}–${b.end})`}
          />
        ))}

        {/* Pending interval */}
        {pendingValid && pendingStart !== null && pendingEnd !== null && (
          <div
            className={`absolute top-0 bottom-0 border-2 ${
              result?.available
                ? "border-emerald-500 bg-emerald-300/60"
                : result
                  ? "border-rose-500 bg-rose-300/60"
                  : "border-sky-500 bg-sky-300/50"
            }`}
            style={{
              left: pct(pendingStart),
              width: `${((pendingEnd - pendingStart) / DAY_MINUTES) * 100}%`,
            }}
            title={`Requested: ${pendingStart}–${pendingEnd}`}
          />
        )}

        {/* Current time marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-500"
          style={{ left: pct(currentTime) }}
        >
          <span className="absolute -top-0 left-1 text-[9px] font-bold whitespace-nowrap text-amber-600">
            now
          </span>
        </div>
      </div>

      {/* Tick marks */}
      <div className="relative mt-1 h-4 w-full">
        {TICK_MARKS.map((m) => (
          <span
            key={m}
            className="absolute -translate-x-1/2 text-[10px] text-slate-400"
            style={{ left: pct(m) }}
          >
            {minutesToClock(m)}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-slate-300" /> Existing booking
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border-2 border-sky-500 bg-sky-300/50" /> Requested
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-0.5 bg-amber-500" /> Current time
        </span>
      </div>
    </div>
  );
}
