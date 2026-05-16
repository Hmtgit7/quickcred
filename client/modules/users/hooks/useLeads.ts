import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userService } from "../services/userService";

export function useLeads(page = 1, limit = 10) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.LEADS(page, limit),
    queryFn: () => userService.getLeads(page, limit),
  });
}
