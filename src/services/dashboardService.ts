import { parseISO, isToday } from "date-fns";
import { fetchRequests } from "@/services/requestService";
import type { DashboardSummary } from "@/types/dashboard";

const TOTAL_STUDENTS = 242;

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const requests = await fetchRequests();

  const pendingRequests = requests.filter((request) => request.status === "Pending").length;
  const todaysMeetings = requests.filter((request) => isToday(parseISO(request.requestedTime))).length;
  const approvedToday = requests.filter((request) => {
    if (request.status !== "Accepted") {
      return false;
    }
    const referenceDate = request.updatedAt ? parseISO(request.updatedAt) : parseISO(request.createdAt);
    return isToday(referenceDate);
  }).length;

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        pendingRequests,
        todaysMeetings,
        approvedToday,
        totalStudents: TOTAL_STUDENTS,
      });
    }, 600);
  });
}
