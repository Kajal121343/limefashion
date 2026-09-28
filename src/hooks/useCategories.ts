import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/productApi";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000,
  });
}