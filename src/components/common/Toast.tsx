import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export type ToastKind = "success" | "error";

export interface ToastMessage {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
}

interface Props {
  toast: ToastMessage;
  onClose: (id: number) => void;
}

export function Toast({ toast, onClose }: Props) {
  useEffect(() => {
    const id = setTimeout(() => onClose(toast.id), 4000);
    return () => clearTimeout(id);
  }, [toast.id, onClose]);

  const Icon = toast.kind === "success" ? CheckCircle2 : AlertCircle;
  const isSuccess = toast.kind === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative flex w-full items-start gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5"
    >
      <span
        className={`absolute left-0 top-0 h-full w-1 ${
          isSuccess ? "bg-emerald-500" : "bg-red-500"
        }`}
        aria-hidden="true"
      />
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isSuccess ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        }`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-slate-500">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        aria-label="Dismiss notification"
        className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}