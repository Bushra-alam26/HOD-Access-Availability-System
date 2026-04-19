/**
 * Request List Component
 * Displays all student requests with filtering and management capabilities
 */

import { useState } from "react";
import { AlertCircle, Loader2, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { RequestCard } from "./RequestCard";
import { RescheduleModal } from "./RescheduleModal";
import {
  useRequestsList,
  useAcceptRequest,
  useRejectRequest,
  useRescheduleRequest,
} from "@/hooks/useRequests";
import type { StudentRequest, RequestStatus } from "@/types/request";

export const RequestList = () => {
  // Queries and Mutations
  const { data: requests = [], isLoading, error } = useRequestsList();
  const { mutate: acceptReq, isPending: isAccepting } = useAcceptRequest();
  const { mutate: rejectReq, isPending: isRejecting } = useRejectRequest();
  const { mutate: rescheduleReq, isPending: isRescheduling } = useRescheduleRequest();

  // Local State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "All">("All");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<StudentRequest | null>(null);

  // Filter requests based on search and status
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle Accept
  const handleAccept = (requestId: string) => {
    acceptReq(requestId, {
      onSuccess: () => {
        // Request accepted
      },
      onError: () => {
        // Failed to accept
      },
    });
  };

  // Handle Reject - Show confirmation dialog
  const handleRejectClick = (request: StudentRequest) => {
    setSelectedRequest(request);
    setIsRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (selectedRequest) {
      rejectReq(selectedRequest.id, {
        onSuccess: () => {
          setIsRejectDialogOpen(false);
          setSelectedRequest(null);
        },
        onError: () => {
          // Failed to reject
        },
      });
    }
  };

  // Handle Reschedule - Show reschedule modal
  const handleRescheduleClick = (request: StudentRequest) => {
    setSelectedRequest(request);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleConfirm = (newDateTime: string) => {
    if (selectedRequest) {
      rescheduleReq(
        { requestId: selectedRequest.id, newDateTime },
        {
          onSuccess: () => {
            setIsRescheduleModalOpen(false);
            setSelectedRequest(null);
          },
          onError: () => {
            // Failed to reschedule
          },
        }
      );
    }
  };

  const isActionLoading = isAccepting || isRejecting || isRescheduling;

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Error loading requests. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Student Requests
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {filteredRequests.length} of {requests.length} request
          {requests.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Pending">🟡 Pending</SelectItem>
            <SelectItem value="Accepted">🟢 Accepted</SelectItem>
            <SelectItem value="Rejected">🔴 Rejected</SelectItem>
            <SelectItem value="Rescheduled">🔵 Rescheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* No Results State */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">No requests found</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
            {searchTerm || statusFilter !== "All"
              ? "Try adjusting your search or filter criteria."
              : "No student requests at the moment."}
          </p>
        </div>
      )}

      {/* Requests Grid */}
      {filteredRequests.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onAccept={handleAccept}
              onReject={handleRejectClick}
              onReschedule={handleRescheduleClick}
              isLoading={isActionLoading}
            />
          ))}
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Request?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject the request from{" "}
              <span className="font-semibold">{selectedRequest?.studentName}</span>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              disabled={isRejecting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRejecting ? "Rejecting..." : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule Modal */}
      {selectedRequest && (
        <RescheduleModal
          isOpen={isRescheduleModalOpen}
          studentName={selectedRequest.studentName}
          currentDateTime={selectedRequest.requestedTime}
          onClose={() => {
            setIsRescheduleModalOpen(false);
            setSelectedRequest(null);
          }}
          onConfirm={handleRescheduleConfirm}
          isLoading={isRescheduling}
        />
      )}
    </div>
  );
};
