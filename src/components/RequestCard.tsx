/**
 * Request Card Component
 * Displays individual student request with action buttons
 */

import { format } from "date-fns";
import { Clock, User, MessageSquare, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { StudentRequest, RequestStatus } from "@/types/request";

interface RequestCardProps {
  request: StudentRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onReschedule: (request: StudentRequest) => void;
  isLoading?: boolean;
}

const statusConfig: Record<
  RequestStatus,
  { badge: string; color: string; textColor: string }
> = {
  Pending: {
    badge: "🟡 Pending",
    color: "bg-yellow-100 dark:bg-yellow-950",
    textColor: "text-yellow-800 dark:text-yellow-200",
  },
  Accepted: {
    badge: "🟢 Accepted",
    color: "bg-green-100 dark:bg-green-950",
    textColor: "text-green-800 dark:text-green-200",
  },
  Rejected: {
    badge: "🔴 Rejected",
    color: "bg-red-100 dark:bg-red-950",
    textColor: "text-red-800 dark:text-red-200",
  },
  Rescheduled: {
    badge: "🔵 Rescheduled",
    color: "bg-blue-100 dark:bg-blue-950",
    textColor: "text-blue-800 dark:text-blue-200",
  },
};

export const RequestCard = ({
  request,
  onAccept,
  onReject,
  onReschedule,
  isLoading = false,
}: RequestCardProps) => {
  const config = statusConfig[request.status];
  const isPending = request.status === "Pending";

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Student Name */}
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {request.studentName}
              </h3>
            </div>

            {/* Request Time */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 flex-shrink-0" />
              {format(new Date(request.requestedTime), "PPP 'at' p")}
            </div>
          </div>

          {/* Status Badge */}
          <Badge className={`${config.color} ${config.textColor} whitespace-nowrap`}>
            {config.badge}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Reason Section */}
        <div>
          <div className="flex items-start gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reason:</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{request.reason}</p>
        </div>

        {/* Email for reference */}
        <div className="text-xs text-gray-500 dark:text-gray-500">
          📧 {request.studentEmail}
        </div>

        {/* Rescheduled Info (if applicable) */}
        {request.rescheduledTo && (
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-blue-900 dark:text-blue-200">
                Rescheduled to: {format(new Date(request.rescheduledTo), "PPP 'at' p")}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {isPending ? (
            <>
              {/* Accept Button - Green */}
              <Button
                size="sm"
                onClick={() => onAccept(request.id)}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                ✓ Accept
              </Button>

              {/* Reject Button - Red */}
              <Button
                size="sm"
                onClick={() => onReject(request.id)}
                disabled={isLoading}
                variant="destructive"
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                ✕ Reject
              </Button>

              {/* Reschedule Button - Blue */}
              <Button
                size="sm"
                onClick={() => onReschedule(request)}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                📅 Reschedule
              </Button>
            </>
          ) : (
            <div className="w-full text-center py-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {request.status === "Accepted" && "✓ Request accepted"}
                {request.status === "Rejected" && "✕ Request rejected"}
                {request.status === "Rescheduled" && "📅 Request rescheduled"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
