import { CheckCircle2, XCircle } from "lucide-react";
import type { AvailabilityResult } from "@/lib/availability";

export default function ResultBanner({ result }: { result: AvailabilityResult | null }) {
  if (!result) return null;

  const ok = result.available;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 transition-all ${
        ok
          ? "border-emerald-300 bg-emerald-50"
          : "border-rose-300 bg-rose-50"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className={ok ? "text-emerald-600" : "text-rose-600"}>
        {ok ? <CheckCircle2 size={26} /> : <XCircle size={26} />}
      </div>
      <div>
        <p
          className={`text-lg font-bold ${
            ok ? "text-emerald-800" : "text-rose-800"
          }`}
        >
          {ok ? "Available" : "Unavailable"}
        </p>
        <p className={`text-sm ${ok ? "text-emerald-700" : "text-rose-700"}`}>
          {result.message}
        </p>
      </div>
    </div>
  );
}
