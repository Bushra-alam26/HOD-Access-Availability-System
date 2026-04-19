/**
 * Request Service
 * Handles API calls for managing student requests
 */

import type { StudentRequest, ReschedulePayload } from "@/types/request";

const API_URL = "http://localhost:5001/api/requests";

/**
 * Fetch all student requests
 * @returns Promise with array of student requests
 */
export async function fetchRequests(): Promise<StudentRequest[]> {
  const token = localStorage.getItem("token");
  const response = await fetch(API_URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch requests");
  }
  
  // Transform backend data to frontend format
  return data.requests.map((req: any) => ({
    id: req._id,
    studentId: req.studentId?._id || req.studentId,
    studentName: req.studentId ? `${req.studentId.firstName} ${req.studentId.surname}` : "Unknown",
    studentEmail: req.studentId?.email || "",
    requestedTime: req.requestedTime,
    reason: req.reason,
    status: req.status === "Approved" ? "Accepted" : req.status,
    createdAt: req.createdAt,
    updatedAt: req.updatedAt,
    rescheduledTo: req.rescheduledTo,
    approvedByName: req.approvedByName,
    rejectedByName: req.rejectedByName,
    rejectionReason: req.rejectionReason,
  }));
}

/**
 * Update request status to Accepted
 * @param requestId - ID of the request to accept
 * @returns Promise with updated request
 */
export async function acceptRequest(requestId: string): Promise<StudentRequest> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${requestId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ status: "Approved" }),
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || "Failed to accept request");
  }
  
  return {
    id: data.request._id,
    studentId: data.request.studentId?._id || data.request.studentId,
    studentName: data.request.studentId ? `${data.request.studentId.firstName} ${data.request.studentId.surname}` : "Unknown",
    studentEmail: data.request.studentId?.email || "",
    requestedTime: data.request.requestedTime,
    reason: data.request.reason,
    status: data.request.status === "Approved" ? "Accepted" : data.request.status,
    createdAt: data.request.createdAt,
    updatedAt: data.request.updatedAt,
    approvedByName: data.request.approvedByName,
    rejectedByName: data.request.rejectedByName,
    rejectionReason: data.request.rejectionReason,
  };
}

/**
 * Update request status to Rejected
 * @param requestId - ID of the request to reject
 * @returns Promise with updated request
 */
export async function rejectRequest(requestId: string): Promise<StudentRequest> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${requestId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ status: "Rejected" }),
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || "Failed to reject request");
  }
  
  return {
    id: data.request._id,
    studentId: data.request.studentId?._id || data.request.studentId,
    studentName: data.request.studentId ? `${data.request.studentId.firstName} ${data.request.studentId.surname}` : "Unknown",
    studentEmail: data.request.studentId?.email || "",
    requestedTime: data.request.requestedTime,
    reason: data.request.reason,
    status: data.request.status === "Rejected" ? "Rejected" : data.request.status,
    createdAt: data.request.createdAt,
    updatedAt: data.request.updatedAt,
    approvedByName: data.request.approvedByName,
    rejectedByName: data.request.rejectedByName,
    rejectionReason: data.request.rejectionReason,
  };
}

/**
 * Reschedule a request to a new date and time
 * @param payload - Contains requestId and new datetime
 * @returns Promise with rescheduled request
 */
export async function rescheduleRequest(payload: ReschedulePayload): Promise<StudentRequest> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${payload.requestId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ 
      status: "Rescheduled",
      rescheduledTo: payload.newDateTime 
    }),
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || "Failed to reschedule request");
  }
  
  return {
    id: data.request._id,
    studentId: data.request.studentId?._id || data.request.studentId,
    studentName: data.request.studentId ? `${data.request.studentId.firstName} ${data.request.studentId.surname}` : "Unknown",
    studentEmail: data.request.studentId?.email || "",
    requestedTime: data.request.requestedTime,
    reason: data.request.reason,
    status: "Rescheduled",
    createdAt: data.request.createdAt,
    updatedAt: data.request.updatedAt,
    rescheduledTo: data.request.rescheduledTo,
    approvedByName: data.request.approvedByName,
    rejectedByName: data.request.rejectedByName,
    rejectionReason: data.request.rejectionReason,
  };
}

/**
 * Create a new meeting request
 * @param requestData - Contains reason, description, requestDate, requestTime
 * @returns Promise with created request
 */
export async function createRequest(requestData: {
  reason: string;
  description?: string;
  requestDate: string;
  requestTime: string;
}): Promise<StudentRequest> {
  const token = localStorage.getItem("token");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(requestData),
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || "Failed to create request");
  }
  
  return {
    id: data.request._id,
    studentId: data.request.studentId,
    studentName: data.request.studentName,
    studentEmail: data.request.studentEmail,
    requestedTime: data.request.requestedTime,
    reason: data.request.reason,
    status: data.request.status === "Approved" ? "Accepted" : data.request.status,
    createdAt: data.request.createdAt,
    updatedAt: data.request.updatedAt,
    rescheduledTo: data.request.rescheduledTo,
    rejectionReason: data.request.rejectionReason,
  };
}
