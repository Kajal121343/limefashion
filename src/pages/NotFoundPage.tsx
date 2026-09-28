import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-4xl font-bold text-slate-900">404</h1>
      <p className="text-slate-600 mt-2">Page not found.</p>
      <Link
        to="/products"
        className="mt-6 px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
      >
        Back to products
      </Link>
    </div>
  );
}