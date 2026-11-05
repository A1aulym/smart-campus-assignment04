import { SearchX } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <SearchX size={24} className="text-slate-400" />
      </div>
      <p className="mt-3 text-base font-semibold text-slate-700">No rooms match</p>
      <p className="mt-1 text-sm text-slate-500">
        Try reducing the attendee count or removing equipment requirements.
      </p>
    </div>
  );
}
