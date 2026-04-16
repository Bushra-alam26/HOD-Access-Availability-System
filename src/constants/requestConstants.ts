/**
 * Constants for Request Management
 * Centralized configuration for request statuses and UI labels
 */

import type { RequestStatus } from "@/types/request";

export const REQUEST_STATUSES: RequestStatus[] = ["Pending", "Accepted", "Rejected", "Rescheduled"];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  Pending: "🟡 Pending",
  Accepted: "🟢 Accepted",
  Rejected: "🔴 Rejected",
  Rescheduled: "🔵 Rescheduled",
};

export const REQUEST_STATUS_COLORS: Record<RequestStatus, Record<string, string>> = {
  Pending: {
    bg: "bg-yellow-100 dark:bg-yellow-950",
    text: "text-yellow-800 dark:text-yellow-200",
    border: "border-yellow-300 dark:border-yellow-700",
  },
  Accepted: {
    bg: "bg-green-100 dark:bg-green-950",
    text: "text-green-800 dark:text-green-200",
    border: "border-green-300 dark:border-green-700",
  },
  Rejected: {
    bg: "bg-red-100 dark:bg-red-950",
    text: "text-red-800 dark:text-red-200",
    border: "border-red-300 dark:border-red-700",
  },
  Rescheduled: {
    bg: "bg-blue-100 dark:bg-blue-950",
    text: "text-blue-800 dark:text-blue-200",
    border: "border-blue-300 dark:border-blue-700",
  },
};

// API Response timeout (in ms)
export const API_TIMEOUT = 30000;

// Polling interval for updates (in ms)
export const POLLING_INTERVAL = 30000;

// Toast notification duration (in ms)
export const TOAST_DURATION = 3000;
