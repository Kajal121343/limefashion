import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, Package, Tag, BadgeCheck } from "lucide-react";
import { useProduct } from "../hooks/useProduct";
import { Spinner } from "../components/common/Spinner";
import { ErrorState } from "../components/common/ErrorState";
import { formatCurrency, formatRating } from "../utils/format";

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error, refetch } = useProduct(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Product not found."}
        onRetry={() => refetch()}
      />
    );
  }

  const originalPrice =
    product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : null;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Image gallery */}
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <img
              src={product.thumbnail}
              alt={product.title}
              width={800}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors hover:border-indigo-300"
                >
                  <img
                    src={img}
                    alt={`${product.title} — image ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    width={200}
                    height={200}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-indigo-700">
              <Tag className="h-3 w-3" aria-hidden="true" />
              {product.category}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {product.title}
            </h1>
            {product.brand && (
              <p className="flex items-center gap-1.5 text-sm text-slate-600">
                <BadgeCheck className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                {product.brand}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1 text-amber-500">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden="true" />
              <span className="text-base font-semibold text-slate-800">
                {formatRating(product.rating)}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
              <Package className="h-4 w-4" aria-hidden="true" />
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">
              {formatCurrency(product.price)}
            </span>
            {originalPrice !== null && (
              <>
                <span className="text-base text-slate-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  -{Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-800">
              Description
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>
          </div>

          <Link to="/products" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to products
          </Link>
        </div>
      </div>
    </div>
  );
}