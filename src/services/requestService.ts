/**
 * Request Service
 * Handles API calls for managing student requests
 * Currently using mock data - replace with actual API endpoints
 */

import type { StudentRequest, ReschedulePayload } from "@/types/request";

// Mock data for demonstration
const mockRequests: StudentRequest[] = [
  {
    id: "req-001",
    studentId: "std-101",
    studentName: "Priya Sharma",
    studentEmail: "priya.sharma@college.edu",
    requestedTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    reason: "Discuss project presentation feedback",
    status: "Pending",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "req-002",
    studentId: "std-102",
    studentName: "Rajesh Kumar",
    studentEmail: "rajesh.kumar@college.edu",
    requestedTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    reason: "Academic performance discussion",
    status: "Pending",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "req-003",
    studentId: "std-103",
    studentName: "Anjali Patel",
    studentEmail: "anjali.patel@college.edu",
    requestedTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    reason: "Internship opportunity inquiry",
    status: "Pending",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "req-004",
    studentId: "std-104",
    studentName: "Vikram Singh",
    studentEmail: "vikram.singh@college.edu",
    requestedTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    reason: "Course selection guidance",
    status: "Accepted",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "req-005",
    studentId: "std-105",
    studentName: "Deepika Menon",
    studentEmail: "deepika.menon@college.edu",
    requestedTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reason: "Complaint regarding course assignment",
    status: "Rejected",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Fetch all student requests
 * @returns Promise with array of student requests
 */
export async function fetchRequests(): Promise<StudentRequest[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockRequests]);
    }, 500); // Simulate network delay
  });
}

/**
 * Update request status to Accepted
 * @param requestId - ID of the request to accept
 * @returns Promise with updated request
 */
export async function acceptRequest(requestId: string): Promise<StudentRequest> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const request = mockRequests.find((r) => r.id === requestId);
      if (request) {
        request.status = "Accepted";
        request.updatedAt = new Date().toISOString();
        resolve({ ...request });
      } else {
        reject(new Error("Request not found"));
      }
    }, 300);
  });
}

/**
 * Update request status to Rejected
 * @param requestId - ID of the request to reject
 * @returns Promise with updated request
 */
export async function rejectRequest(requestId: string): Promise<StudentRequest> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const request = mockRequests.find((r) => r.id === requestId);
      if (request) {
        request.status = "Rejected";
        request.updatedAt = new Date().toISOString();
        resolve({ ...request });
      } else {
        reject(new Error("Request not found"));
      }
    }, 300);
  });
}

/**
 * Reschedule a request to a new date and time
 * @param payload - Contains requestId and new datetime
 * @returns Promise with rescheduled request
 */
export async function rescheduleRequest(payload: ReschedulePayload): Promise<StudentRequest> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const request = mockRequests.find((r) => r.id === payload.requestId);
      if (request) {
        request.status = "Rescheduled";
        request.rescheduledTo = payload.newDateTime;
        request.updatedAt = new Date().toISOString();
        resolve({ ...request });
      } else {
        reject(new Error("Request not found"));
      }
    }, 300);
  });
}
