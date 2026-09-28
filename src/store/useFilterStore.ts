import { create } from "zustand";
import type { Product, SortField, SortOrder } from "../types/product";

interface FilterState {
  search: string;
  category: string;
  sortBy: SortField;
  order: SortOrder;
  page: number;
  showFavouritesOnly: boolean;
  addedProducts: Product[];

  setSearch: (value: string) => void;
  setCategory: (value: string) => void;
  setSortBy: (field: SortField) => void;
  setOrder: (order: SortOrder) => void;
  setPage: (page: number) => void;
  setShowFavouritesOnly: (value: boolean) => void;
  addProductLocally: (product: Product) => void;
  resetFilters: () => void;
}

const initialState = {
  search: "",
  category: "",
  sortBy: "" as SortField,
  order: "asc" as SortOrder,
  page: 1,
  showFavouritesOnly: false,
  addedProducts: [] as Product[],
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setOrder: (order) => set({ order }),
  setPage: (page) => set({ page }),
  setShowFavouritesOnly: (showFavouritesOnly) =>
    set({ showFavouritesOnly, page: 1 }),
  addProductLocally: (product) =>
    set((state) => ({ addedProducts: [product, ...state.addedProducts] })),
  resetFilters: () => set(initialState),
}));