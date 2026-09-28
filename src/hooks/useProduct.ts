import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../services/productApi";
import { useFilterStore } from "../store/useFilterStore";

export function useProduct(id: string | number | undefined) {
  const addedProducts = useFilterStore((s) => s.addedProducts);

  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      // Check locally-added products first
      const local = addedProducts.find((p) => String(p.id) === String(id));
      if (local) return local;

      // Otherwise fetch from API
      return getProductById(id!);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}