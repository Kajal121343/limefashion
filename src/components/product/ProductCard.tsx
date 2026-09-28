import { Link } from "react-router-dom";
import { Star, ArrowRight, Heart } from "lucide-react";
import type { Product } from "../../types/product";
import { formatCurrency, formatRating } from "../../utils/format";
import { useFavouritesStore } from "../../store/useFavouritesStore";

interface Props {
  product: Product;
}

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
        Out of stock
      </span>
    );
  }
  if (stock < 10) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
        Low stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
      In stock
    </span>
  );
}

export function ProductCard({ product }: Props) {
  const isFavourite = useFavouritesStore((s) => s.ids.includes(product.id));
  const toggle = useFavouritesStore((s) => s.toggle);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50">
      {/* Favourite button */}
      <button
        type="button"
        onClick={() => toggle(product.id)}
        aria-pressed={isFavourite}
        aria-label={
          isFavourite
            ? `Remove ${product.title} from favourites`
            : `Add ${product.title} to favourites`
        }
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <Heart
          className={
            isFavourite
              ? "h-4 w-4 fill-red-500 text-red-500"
              : "h-4 w-4 text-slate-400"
          }
          aria-hidden="true"
        />
      </button>

      <div className="aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          decoding="async"
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
          {product.title}
        </h3>

        <p className="text-xs uppercase tracking-wide text-slate-500">
          {product.category}
        </p>

        <div className="flex items-center gap-1 text-xs text-slate-600">
          <Star
            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
          <span>{formatRating(product.rating)}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-semibold text-slate-900">
            {formatCurrency(product.price)}
          </span>
          <StockBadge stock={product.stock} />
        </div>

        <Link
          to={`/products/${product.id}`}
          className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          View details
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}