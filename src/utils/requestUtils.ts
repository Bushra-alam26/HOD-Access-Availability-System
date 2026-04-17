/**
 * Request Utilities
 * Helper functions for request management
 */

import { format, isPast, isBefore } from "date-fns";

/**
 * Format datetime for display
 * @param dateTime - ISO format datetime string
 * @returns Formatted datetime string
 */
export const formatRequestDateTime = (dateTime: string): string => {
  try {
    return format(new Date(dateTime), "PPP 'at' p");
  } catch {
    return "Invalid date";
  }
};

/**
 * Check if request time has passed
 * @param dateTime - ISO format datetime string
 * @returns Boolean indicating if time has passed
 */
export const isRequestPast = (dateTime: string): boolean => {
  try {
    return isPast(new Date(dateTime));
  } catch {
    return false;
  }
};

/**
 * Calculate time remaining until request
 * @param dateTime - ISO format datetime string
 * @returns String representing time remaining
 */
export const getTimeRemaining = (dateTime: string): string => {
  try {
    const requestDate = new Date(dateTime);
    const now = new Date();
    const diff = requestDate.getTime() - now.getTime();

    if (diff < 0) return "Past";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  } catch {
    return "N/A";
  }
};

/**
 * Validate request datetime
 * @param dateTime - ISO format datetime string
 * @returns Boolean indicating if datetime is valid
 */
export const isValidDateTime = (dateTime: string): boolean => {
  try {
    const date = new Date(dateTime);
    return date instanceof Date && !isNaN(date.getTime());
  } catch {
    return false;
  }
};

/**
 * Sort requests by status priority
 * @param requests - Array of requests
 * @returns Sorted array with Pending first, then others
 */
export const sortRequestsByPriority = <T extends { status: string }>(
  requests: T[]
): T[] => {
  const statusPriority: Record<string, number> = {
    Pending: 0,
    Rescheduled: 1,
    Accepted: 2,
    Rejected: 3,
  };

  return [...requests].sort(
    (a, b) =>
      (statusPriority[a.status] || 4) - (statusPriority[b.status] || 4)
  );
};

/**
 * Export requests to CSV (for future feature)
 * @param requests - Array of requests
 * @returns CSV string
 */
export const exportRequestsToCSV = (requests: any[]): string => {
  const headers = ["Student Name", "Email", "Requested Time", "Reason", "Status"];
  const rows = requests.map((req) => [
    req.studentName,
    req.studentEmail,
    formatRequestDateTime(req.requestedTime),
    req.reason,
    req.status,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  return csvContent;
};
