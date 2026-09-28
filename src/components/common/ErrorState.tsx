import { AlertCircle } from "lucide-react";

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="h-10 w-10 text-red-500 mb-3" aria-hidden="true" />
      <p className="text-slate-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Try again
        </button>
      )}
    </div>
  );
}