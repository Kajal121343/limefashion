import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Heart, RotateCcw } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useDebounce } from "../hooks/useDebounce";
import { useFilterStore } from "../store/useFilterStore";
import { useFavouritesStore } from "../store/useFavouritesStore";
import { ProductCard } from "../components/product/ProductCard";
import { ProductSkeleton } from "../components/product/ProductSkeleton";
import { SearchBar } from "../components/filters/SearchBar";
import { CategoryFilter } from "../components/filters/CategoryFilter";
import { SortSelect } from "../components/filters/SortSelect";
import { Pagination } from "../components/common/Pagination";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import type { Product, SortField, SortOrder } from "../types/product";

const PAGE_SIZE = 12;

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    search,
    category,
    sortBy,
    order,
    page,
    showFavouritesOnly,
    addedProducts,
    setSearch,
    setCategory,
    setSortBy,
    setOrder,
    setPage,
    setShowFavouritesOnly,
    resetFilters,
  } = useFilterStore();

  const favouriteIds = useFavouritesStore((s) => s.ids);

  // ── 1. On mount: hydrate Zustand from URL ──
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const c = searchParams.get("category") ?? "";
    const s = (searchParams.get("sort") as SortField) ?? "";
    const o = (searchParams.get("order") as SortOrder) ?? "asc";
    const p = Number(searchParams.get("page") ?? "1");
    const fav = searchParams.get("fav") === "1";

    setSearch(q);
    setCategory(c);
    setSortBy(s);
    setOrder(o);
    setPage(Number.isFinite(p) && p > 0 ? p : 1);
    setShowFavouritesOnly(fav);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 2. On state change: sync to URL ──
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category) params.set("category", category);
    if (sortBy) {
      params.set("sort", sortBy);
      params.set("order", order);
    }
    if (page > 1) params.set("page", String(page));
    if (showFavouritesOnly) params.set("fav", "1");

    setSearchParams(params, { replace: true });
  }, [search, category, sortBy, order, page, showFavouritesOnly, setSearchParams]);

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading, isError, error, refetch } = useProducts();
  const { data: categories = [] } = useCategories();

  const allProducts: Product[] = useMemo(
    () => [...addedProducts, ...(data?.products ?? [])],
    [addedProducts, data]
  );

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    let result = allProducts;

    if (showFavouritesOnly) {
      result = result.filter((p) => favouriteIds.includes(p.id));
    }
    if (term) {
      result = result.filter((p) => p.title.toLowerCase().includes(term));
    }
    if (category) {
      result = result.filter((p) => p.category === category);
    }
    if (sortBy) {
      result = [...result].sort((a, b) => {
        const av = a[sortBy];
        const bv = b[sortBy];
        return order === "asc" ? av - bv : bv - av;
      });
    }
    return result;
  }, [
    allProducts,
    debouncedSearch,
    category,
    sortBy,
    order,
    showFavouritesOnly,
    favouriteIds,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const filtersActive = !!(
    search ||
    category ||
    sortBy ||
    showFavouritesOnly
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Products
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isLoading
            ? "Loading products…"
            : `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`}
        </p>
      </div>

      {/* Filters bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CategoryFilter
              categories={categories}
              value={category}
              onChange={setCategory}
            />
            <SortSelect
              sortBy={sortBy}
              order={order}
              onChange={(f, o) => {
                setSortBy(f);
                setOrder(o);
              }}
            />
            <button
              type="button"
              onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
              aria-pressed={showFavouritesOnly}
              className={
                "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 " +
                (showFavouritesOnly
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")
              }
            >
              <Heart
                className={
                  showFavouritesOnly
                    ? "h-4 w-4 fill-red-500 text-red-500"
                    : "h-4 w-4"
                }
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Favourites</span>
              <span className="sm:hidden">Fav</span>
              {favouriteIds.length > 0 && (
                <span
                  className={
                    "ml-1 rounded-full px-1.5 text-xs font-semibold " +
                    (showFavouritesOnly
                      ? "bg-red-200 text-red-800"
                      : "bg-slate-100 text-slate-600")
                  }
                >
                  {favouriteIds.length}
                </span>
              )}
            </button>
            {filtersActive && (
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setSearchParams({}, { replace: true });
                }}
                aria-label="Reset filters"
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span className="hidden lg:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {isError ? (
        <ErrorState
          message={
            error instanceof Error ? error.message : "Failed to load products."
          }
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : pageItems.length === 0 ? (
        <EmptyState
          title={showFavouritesOnly ? "No favourites yet" : "No products found"}
          description={
            showFavouritesOnly
              ? "Tap the heart on any product to save it here."
              : "Try adjusting your search or filters."
          }
        />
      ) : (
        <>
          <ul
            role="list"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {pageItems.map((p) => (
              <li key={`${p.id}-${p.title}`}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}