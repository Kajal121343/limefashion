import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavouritesState {
  ids: number[];
  toggle: (id: number) => void;
  isFavourite: (id: number) => boolean;
  clear: () => void;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((x) => x !== id)
            : [...state.ids, id],
        })),
      isFavourite: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: "limefashion-favourites" }
  )
);