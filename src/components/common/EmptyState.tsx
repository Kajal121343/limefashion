import { PackageOpen } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No products found",
  description = "Try adjusting your search or filters.",
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <PackageOpen className="h-10 w-10 text-slate-400 mb-3" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
  );
}