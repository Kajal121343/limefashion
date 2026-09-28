import type { SortField, SortOrder } from "../../types/product";

interface Props {
  sortBy: SortField;
  order: SortOrder;
  onChange: (sortBy: SortField, order: SortOrder) => void;
}

export function SortSelect({ sortBy, order, onChange }: Props) {
  const value = sortBy ? `${sortBy}-${order}` : "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    if (!v) return onChange("", "asc");
    const [field, ord] = v.split("-") as [SortField, SortOrder];
    onChange(field, ord);
  }

  return (
    <div className="w-full sm:w-56">
      <label htmlFor="sort-select" className="sr-only">
        Sort products
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={handleChange}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      >
        <option value="">Sort: Default</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-desc">Rating: High to Low</option>
        <option value="rating-asc">Rating: Low to High</option>
      </select>
    </div>
  );
}