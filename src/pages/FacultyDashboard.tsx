/**
 * Faculty Dashboard Page
 * Main dashboard for Faculty to manage meetings and view HOD availability
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun, Menu, X, Clock, BookOpen, CheckCircle2, Users, Check, X as XIcon, Calendar, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchRequests } from "@/services/requestService";
import type { StudentRequest } from "@/types/request";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Quick Actions states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showViewRequestsModal, setShowViewRequestsModal] = useState(false);
  const [meetingForm, setMeetingForm] = useState({ reason: "", description: "", date: "", time: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get user name from localStorage
  const userName = localStorage.getItem("userName") || "Faculty";
  const isFirstLogin = localStorage.getItem("isFirstLogin") === "true";
  const welcomeMessage = isFirstLogin ? "Welcome" : "Welcome Back";

  // HOD Status states: available, busy, in-meeting, offline
  const [hodStatus] = useState<"available" | "busy" | "in-meeting" | "offline">("available");

  // Fetch faculty's own requests
  const { data: myRequests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ["facultyRequests"],
    queryFn: fetchRequests,
    staleTime: 5 * 60 * 1000,
  });

  // Get status styling for requests
  const getRequestStatusStyle = (status: string) => {
    const statusStyles: Record<string, { bgColor: string; textColor: string; badgeColor: string }> = {
      Pending: {
        bgColor: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-700",
        textColor: "text-yellow-900 dark:text-yellow-200",
        badgeColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      Accepted: {
        bgColor: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-700",
        textColor: "text-green-900 dark:text-green-200",
        badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      Rejected: {
        bgColor: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-700",
        textColor: "text-red-900 dark:text-red-200",
        badgeColor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
    };
    return statusStyles[status] || statusStyles["Pending"];
  };

  // Handle schedule meeting submission
  const handleScheduleMeeting = async () => {
    if (!meetingForm.reason || !meetingForm.date || !meetingForm.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          reason: meetingForm.reason,
          description: meetingForm.description,
          requestDate: meetingForm.date,
          requestTime: meetingForm.time,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Meeting request submitted successfully!");
        setShowScheduleModal(false);
        setMeetingForm({ reason: "", description: "", date: "", time: "" });
      } else {
        toast.error(data.message || "Failed to submit meeting request");
      }
    } catch (error) {
      console.error("Schedule meeting error:", error);
      toast.error("Failed to submit meeting request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle download report
  const handleDownloadReport = () => {
    const reportData = {
      title: "Faculty Meeting Requests Report",
      generatedOn: new Date().toLocaleString(),
      facultyName: userName,
      totalRequests: myRequests.length,
      pendingRequests: myRequests.filter((r: StudentRequest) => r.status === "Pending").length,
      approvedRequests: myRequests.filter((r: StudentRequest) => r.status === "Accepted").length,
      rejectedRequests: myRequests.filter((r: StudentRequest) => r.status === "Rejected").length,
      requests: myRequests.map((r: StudentRequest) => ({
        id: r.id,
        studentName: r.studentName,
        reason: r.reason,
        status: r.status,
        requestedTime: r.requestedTime,
        createdAt: r.createdAt,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `faculty-report-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Report downloaded successfully!");
  };

  // Initialize dark mode based on localStorage or system preference
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedTheme = window.localStorage.getItem("theme");
    const initialDarkMode = storedTheme
      ? storedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(initialDarkMode);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      window.localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Handle logout
  const handleLogout = async () => {
    const userEmail = localStorage.getItem("userEmail");
    
    // Call backend logout API
    try {
      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
      });
    } catch (error) {
      console.error("Logout API error:", error);
    }
    
    logout();
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // Get HOD status display info
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; bgColor: string; textColor: string; icon: string }> = {
      available: {
        label: "Available",
        bgColor: "bg-green-100 dark:bg-green-950",
        textColor: "text-green-700 dark:text-green-200",
        icon: "🟢",
      },
      busy: {
        label: "Busy",
        bgColor: "bg-yellow-100 dark:bg-yellow-950",
        textColor: "text-yellow-700 dark:text-yellow-200",
        icon: "🟡",
      },
      "in-meeting": {
        label: "In Meeting",
        bgColor: "bg-red-100 dark:bg-red-950",
        textColor: "text-red-700 dark:text-red-200",
        icon: "🔴",
      },
      offline: {
        label: "Offline",
        bgColor: "bg-gray-100 dark:bg-gray-950",
        textColor: "text-gray-700 dark:text-gray-200",
        icon: "⚫",
      },
    };

    return statusMap[status] || statusMap["offline"];
  };

  const statusInfo = getStatusInfo(hodStatus);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 page-enter">
      {/* Navigation Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo/Title */}
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {isSidebarOpen ? (
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <Menu className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  👨‍🎓 Faculty Dashboard
                </h1>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  Appointment & Meeting Management
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 btn-animate"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Welcome Card */}
        <div className="mb-6 md:mb-8 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 p-4 md:p-6 text-white shadow-lg fade-in-up">
          <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">{welcomeMessage}, {userName}!</h2>
          <p className="text-purple-100">
            Check HOD availability, manage your meetings, and track appointment requests.
          </p>
        </div>

        {/* HOD Availability Status Card */}
        <div className="mb-6 md:mb-8 rounded-lg bg-white dark:bg-gray-800 p-4 md:p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-4 mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">HOD Availability Status</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{statusInfo.icon}</span>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Status</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{statusInfo.label}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Last Updated</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Just now</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Next Available</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">2:30 PM</p>
            </div>
          </div>
        </div>

        {/* Summary Cards Section Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard Summary</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Your meeting and request statistics.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Requests Card */}
          <div className="rounded-lg bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 dark:from-blue-950 dark:via-blue-950 dark:to-blue-900 p-5 border border-blue-200 dark:border-blue-700 shadow-md hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] opacity-80 text-blue-900 dark:text-blue-200">
                  Total Requests
                </p>
                <p className="mt-3 text-4xl font-semibold leading-none text-blue-900 dark:text-blue-100">
                  28
                </p>
                <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">All-time requests</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 dark:bg-blue-900/80 shadow-sm">
                <Users className="h-7 w-7 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          {/* Pending Requests Card */}
          <div className="rounded-lg bg-gradient-to-br from-yellow-50 via-yellow-50 to-yellow-100 dark:from-yellow-950 dark:via-yellow-950 dark:to-yellow-900 p-5 border border-yellow-200 dark:border-yellow-700 shadow-md hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] opacity-80 text-yellow-900 dark:text-yellow-200">
                  Pending Requests
                </p>
                <p className="mt-3 text-4xl font-semibold leading-none text-yellow-900 dark:text-yellow-100">
                  5
                </p>
                <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">Awaiting action</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 dark:bg-yellow-900/80 shadow-sm">
                <Clock className="h-7 w-7 text-yellow-600 dark:text-yellow-300" />
              </div>
            </div>
          </div>

          {/* Approved Requests Card */}
          <div className="rounded-lg bg-gradient-to-br from-green-50 via-green-50 to-green-100 dark:from-green-950 dark:via-green-950 dark:to-green-900 p-5 border border-green-200 dark:border-green-700 shadow-md hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] opacity-80 text-green-900 dark:text-green-200">
                  Approved Meetings
                </p>
                <p className="mt-3 text-4xl font-semibold leading-none text-green-900 dark:text-green-100">
                  18
                </p>
                <p className="mt-2 text-sm text-green-700 dark:text-green-300">Scheduled meetings</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 dark:bg-green-900/80 shadow-sm">
                <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          {/* Today's Appointments Card */}
          <div className="rounded-lg bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 dark:from-purple-950 dark:via-purple-950 dark:to-purple-900 p-5 border border-purple-200 dark:border-purple-700 shadow-md hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] opacity-80 text-purple-900 dark:text-purple-200">
                  Today's Meetings
                </p>
                <p className="mt-3 text-4xl font-semibold leading-none text-purple-900 dark:text-purple-100">
                  3
                </p>
                <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">Scheduled for today</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 dark:bg-purple-900/80 shadow-sm">
                <BookOpen className="h-7 w-7 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={() => setShowScheduleModal(true)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting with HOD
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowViewRequestsModal(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              View My Requests
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleDownloadReport}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Schedule Meeting Modal */}
        <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule Meeting with HOD</DialogTitle>
              <DialogDescription>
                Fill in the details to request a meeting with the Head of Department.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason *</Label>
                <Input
                  id="reason"
                  placeholder="e.g., Project discussion, Leave approval"
                  value={meetingForm.reason}
                  onChange={(e) => setMeetingForm({ ...meetingForm, reason: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional details..."
                  value={meetingForm.description}
                  onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleScheduleMeeting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View My Requests Modal */}
        <Dialog open={showViewRequestsModal} onOpenChange={setShowViewRequestsModal}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>My Meeting Requests</DialogTitle>
              <DialogDescription>
                View all your meeting requests and their status.
              </DialogDescription>
            </DialogHeader>
            {loadingRequests ? (
              <div className="py-8 text-center text-gray-500">Loading requests...</div>
            ) : myRequests.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No meeting requests found.</div>
            ) : (
              <div className="space-y-3">
                {myRequests.map((request: StudentRequest) => {
                  const statusStyle = getRequestStatusStyle(request.status);
                  return (
                    <div
                      key={request.id}
                      className={`rounded-lg border p-4 ${statusStyle.bgColor} ${statusStyle.textColor}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{request.reason}</h4>
                        <Badge className={`text-xs font-medium ${statusStyle.badgeColor}`}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="text-sm opacity-80 space-y-1">
                        <p>Requested: {new Date(request.requestedTime).toLocaleString()}</p>
                        {request.status === "Rejected" && request.rejectionReason && (
                          <p className="text-red-600">Reason: {request.rejectionReason}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewRequestsModal(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        // ...existing code...
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2026 College Appointment Management System</p>
            <p className="mt-1">For Faculty - Manage meetings and appointments</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FacultyDashboard;