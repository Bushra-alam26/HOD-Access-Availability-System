import { parseISO, isToday } from "date-fns";
import { fetchRequests } from "@/services/requestService";
import type { DashboardSummary } from "@/types/dashboard";

const TOTAL_STUDENTS = 242;

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5001/api/requests/stats", {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch dashboard summary");
  }

  return {
    pendingRequests: data.stats.pending || 0,
    todaysMeetings:
      (data.todayStats.pending || 0) + (data.todayStats.approved || 0) + (data.todayStats.rejected || 0),
    approvedToday: data.todayStats.approved || 0,
    totalStudents: TOTAL_STUDENTS,
  };
}
