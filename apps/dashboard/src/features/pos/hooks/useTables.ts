import { useQuery } from "@tanstack/react-query";
import { fetchTables } from "../services/pos.service";

export function useTables() {
  return useQuery({ queryKey: ["pos", "tables"], queryFn: fetchTables });
}
