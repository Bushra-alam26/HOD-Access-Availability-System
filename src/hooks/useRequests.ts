/**
 * Custom Hook: useRequests
 * Manages fetching and updating student requests with React Query
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchRequests,
  acceptRequest,
  rejectRequest,
  rescheduleRequest,
} from "@/services/requestService";
import type { StudentRequest, ReschedulePayload } from "@/types/request";

/**
 * Fetch all requests
 */
export const useRequestsList = () => {
  return useQuery({
    queryKey: ["requests"],
    queryFn: fetchRequests,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Accept a request mutation
 */
export const useAcceptRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptRequest,
    onSuccess: (updatedRequest) => {
      // Update the cache with new request data
      queryClient.setQueryData(["requests"], (oldData: StudentRequest[] | undefined) => {
        if (!oldData) return [updatedRequest];
        return oldData.map((req) => (req.id === updatedRequest.id ? updatedRequest : req));
      });
    },
  });
};

/**
 * Reject a request mutation
 */
export const useRejectRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectRequest,
    onSuccess: (updatedRequest) => {
      queryClient.setQueryData(["requests"], (oldData: StudentRequest[] | undefined) => {
        if (!oldData) return [updatedRequest];
        return oldData.map((req) => (req.id === updatedRequest.id ? updatedRequest : req));
      });
    },
  });
};

/**
 * Reschedule a request mutation
 */
export const useRescheduleRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rescheduleRequest,
    onSuccess: (updatedRequest) => {
      queryClient.setQueryData(["requests"], (oldData: StudentRequest[] | undefined) => {
        if (!oldData) return [updatedRequest];
        return oldData.map((req) => (req.id === updatedRequest.id ? updatedRequest : req));
      });
    },
  });
};
