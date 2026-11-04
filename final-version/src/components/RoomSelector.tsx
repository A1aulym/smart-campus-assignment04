import { Users, Monitor, Check } from "lucide-react";
import type { Room } from "@/lib/types";

interface RoomSelectorProps {
  filteredRooms: Room[];
  selectedRoomId: string;
  allEquipment: string[];
  attendees: number;
  requiredEquipment: string[];
  onAttendeesChange: (attendees: number) => void;
  onEquipmentToggle: (item: string) => void;
  onRoomSelect: (id: string) => void;
}

export default function RoomSelector({
  filteredRooms,
  selectedRoomId,
  allEquipment,
  attendees,
  requiredEquipment,
  onAttendeesChange,
  onEquipmentToggle,
  onRoomSelect,
}: RoomSelectorProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold tracking-wide text-slate-700 uppercase">
        Find a Room
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="attendees"
            className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700"
          >
            <Users size={16} /> Attendees
          </label>
          <input
            id="attendees"
            type="number"
            min={1}
            max={200}
            value={attendees}
            onChange={(e) =>
              onAttendeesChange(Math.max(1, Number(e.target.value) || 1))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Monitor size={16} /> Required Equipment
          </p>
          <div className="flex flex-wrap gap-2">
            {allEquipment.map((item) => {
              const active = requiredEquipment.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onEquipmentToggle(item)}
                  className={`flex items-center rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
                    active
                      ? "bg-sky-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {active && <Check size={12} className="mr-1" />}
                  {item.replace(/-/g, " ")}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-slate-500">
          {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} match
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {filteredRooms.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => onRoomSelect(room.id)}
              className={`rounded-xl border p-3 text-left transition ${
                room.id === selectedRoomId
                  ? "border-sky-500 bg-sky-50 ring-1 ring-sky-200"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className="text-sm font-semibold text-slate-800">{room.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                <span>Capacity: {room.capacity}</span>
                <span className="capitalize">
                  · {room.equipment.join(", ").replace(/-/g, " ")}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
