import { Clock, Ban, CalendarX2 } from "lucide-react";
import { minutesToClock } from "@/lib/format";
import type { RoomState } from "@/lib/availability";

interface RoomContextCardProps {
  room: RoomState;
  onToggleBlocked: () => void;
}

export default function RoomContextCard({ room, onToggleBlocked }: RoomContextCardProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {/* Current time */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2 text-amber-700">
          <Clock size={18} />
          <span className="text-xs font-semibold tracking-wide uppercase">Current Time</span>
        </div>
        <p className="mt-2 text-2xl font-bold text-amber-900">{room.currentTime} min</p>
        <p className="text-sm text-amber-700/80">09:00 AM</p>
      </div>

      {/* Blocked status */}
      <div
        className={`rounded-2xl border p-4 ${
          room.blocked ? "border-rose-200 bg-rose-50" : "border-emerald-200 bg-emerald-50"
        }`}
      >
        <div
          className={`flex items-center gap-2 ${
            room.blocked ? "text-rose-700" : "text-emerald-700"
          }`}
        >
          {room.blocked ? <Ban size={18} /> : <CalendarX2 size={18} />}
          <span className="text-xs font-semibold tracking-wide uppercase">Room Status</span>
        </div>
        <p
          className={`mt-2 text-2xl font-bold ${
            room.blocked ? "text-rose-900" : "text-emerald-900"
          }`}
        >
          {room.blocked ? "Blocked" : "Open"}
        </p>
        <p className={`text-sm ${room.blocked ? "text-rose-700/80" : "text-emerald-700/80"}`}>
          {room.blocked ? "No bookings accepted" : "Accepting bookings"}
        </p>
        <button
          type="button"
          onClick={onToggleBlocked}
          className={`mt-3 w-full rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            room.blocked
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-rose-100 text-rose-700 hover:bg-rose-200"
          }`}
        >
          {room.blocked ? "Set room to Open" : "Set room to Blocked"}
        </button>
      </div>

      {/* Existing bookings summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 text-slate-600">
          <CalendarX2 size={18} />
          <span className="text-xs font-semibold tracking-wide uppercase">Bookings</span>
        </div>
        <p className="mt-2 text-2xl font-bold text-slate-800">{room.bookings.length}</p>
        <p className="text-sm text-slate-500">
          {room.bookings.map((b) => `${b.start}–${b.end}`).join(", ") || "None"}
        </p>
      </div>
    </div>
  );
}
