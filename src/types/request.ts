/**
 * Request Types and Interfaces
 * Defines data structures for student requests in the appointment system
 */

export type RequestStatus = "Pending" | "Accepted" | "Rejected" | "Rescheduled";

export interface StudentRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  requestedTime: string; // ISO format datetime
  reason: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt?: string;
  rescheduledTo?: string; // New scheduled time if rescheduled
}

export interface ReschedulePayload {
  requestId: string;
  newDateTime: string; // ISO format datetime
}

export interface RequestFilters {
  status?: RequestStatus;
  searchTerm?: string;
}
