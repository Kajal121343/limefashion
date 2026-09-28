import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/productApi";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(100),
    staleTime: 5 * 60 * 1000,
  });
}