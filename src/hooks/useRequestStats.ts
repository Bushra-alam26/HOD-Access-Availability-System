/**
 * Custom Hook: useRequestStats
 * Calculate statistics from requests
 */

import { useMemo } from "react";
import type { StudentRequest, RequestStatus } from "@/types/request";

export interface RequestStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  rescheduled: number;
  acceptanceRate: number;
}

/**
 * Hook to calculate request statistics
 * @param requests - Array of requests
 * @returns Request statistics
 */
export const useRequestStats = (requests: StudentRequest[]): RequestStats => {
  return useMemo(() => {
    const stats: RequestStats = {
      total: requests.length,
      pending: 0,
      accepted: 0,
      rejected: 0,
      rescheduled: 0,
      acceptanceRate: 0,
    };

    requests.forEach((request) => {
      switch (request.status) {
        case "Pending":
          stats.pending++;
          break;
        case "Accepted":
          stats.accepted++;
          break;
        case "Rejected":
          stats.rejected++;
          break;
        case "Rescheduled":
          stats.rescheduled++;
          break;
      }
    });

    // Calculate acceptance rate (accepted / non-pending)
    const processedRequests = stats.accepted + stats.rejected + stats.rescheduled;
    stats.acceptanceRate =
      processedRequests > 0 ? Math.round((stats.accepted / processedRequests) * 100) : 0;

    return stats;
  }, [requests]);
};
