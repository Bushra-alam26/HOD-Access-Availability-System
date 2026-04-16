import { useQuery } from "@tanstack/react-query";
import { fetchDashboardSummary } from "@/services/dashboardService";
import type { DashboardSummary } from "@/types/dashboard";

export const useDashboardSummary = () => {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboardSummary"],
    queryFn: fetchDashboardSummary,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};
