export function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-slate-200 bg-white p-3">
      <div className="aspect-square rounded-md bg-slate-200 mb-3" />
      <div className="h-4 w-3/4 rounded bg-slate-200 mb-2" />
      <div className="h-3 w-1/2 rounded bg-slate-200 mb-3" />
      <div className="h-4 w-1/3 rounded bg-slate-200" />
    </div>
  );
}