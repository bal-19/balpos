import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../services/pos.service";

export function useCategories() {
  return useQuery({ queryKey: ["pos", "categories"], queryFn: fetchCategories });
}
