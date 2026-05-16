import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { analyticsService } from "../services/analyticsService";

export function useAnalytics() {
  return useQuery({
    queryKey: QUERY_KEYS.ANALYTICS.OVERVIEW,
    queryFn: analyticsService.getOverview,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}
