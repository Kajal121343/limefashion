import { Link, Outlet } from "react-router-dom";
import { ShoppingBag, Plus } from "lucide-react";
import { ToastContainer } from "../components/common/ToastContainer";

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/products"
            className="group flex items-center gap-2.5 rounded-lg font-semibold text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30 transition-transform group-hover:scale-105">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-base tracking-tight">Limefashion</span>
          </Link>

          <Link to="/products/add" className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200/70 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>Limefashion · Product Management Dashboard</p>
          <p>
            Data from{" "}
            <a
              href="https://dummyjson.com/products"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-indigo-600 hover:underline"
            >
              DummyJSON
            </a>
          </p>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}