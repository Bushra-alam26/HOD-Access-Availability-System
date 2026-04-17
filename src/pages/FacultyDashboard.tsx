/**
 * Faculty Dashboard Page
 * Main dashboard for Faculty to manage meetings and view HOD availability
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun, Menu, X, Clock, BookOpen, CheckCircle2, Users, Check, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Get user name from localStorage
  const userName = localStorage.getItem("userName") || "Faculty";

  // HOD Status states: available, busy, in-meeting, offline
  const [hodStatus] = useState<"available" | "busy" | "in-meeting" | "offline">("available");

  // Dummy student requests data
  const studentRequests = [
    {
      id: 1,
      name: "Rahul Sharma",
      time: "10:30 AM",
      reason: "Need HOD signature",
      status: "Pending" as const,
    },
    {
      id: 2,
      name: "Priya Singh",
      time: "11:15 AM",
      reason: "Project approval",
      status: "Approved" as const,
    },
    {
      id: 3,
      name: "Aman Verma",
      time: "12:00 PM",
      reason: "Leave permission",
      status: "Rejected" as const,
    },
    {
      id: 4,
      name: "Sneha Patel",
      time: "2:30 PM",
      reason: "Grade review",
      status: "Pending" as const,
    },
    {
      id: 5,
      name: "Vikram Kumar",
      time: "3:45 PM",
      reason: "Course registration",
      status: "Approved" as const,
    },
  ];

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

  // Get status styling for student requests
  const getRequestStatusStyle = (status: string) => {
    const statusStyles: Record<string, { bgColor: string; textColor: string; badgeColor: string }> = {
      Pending: {
        bgColor: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-700",
        textColor: "text-yellow-900 dark:text-yellow-200",
        badgeColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      Approved: {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  👨‍🎓 Faculty Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
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
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="mb-8 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 p-6 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Welcome Back, {userName}!</h2>
          <p className="text-purple-100">
            Check HOD availability, manage your meetings, and track appointment requests.
          </p>
        </div>

        {/* HOD Availability Status Card */}
        <div className="mb-8 rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">HOD Availability Status</h3>
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
            <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
              Schedule Meeting with HOD
            </Button>
            <Button variant="outline" className="w-full">
              View My Requests
            </Button>
            <Button variant="outline" className="w-full">
              Download Report
            </Button>
          </div>
        </div>

        {/* Student Requests Section */}
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Requests</h3>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {studentRequests.length} Total
            </Badge>
          </div>

          <div className="space-y-4">
            {studentRequests.map((request) => {
              const statusStyle = getRequestStatusStyle(request.status);

              return (
                <div
                  key={request.id}
                  className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${statusStyle.bgColor} ${statusStyle.textColor}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{request.name}</h4>
                        <Badge className={`text-xs font-medium ${statusStyle.badgeColor}`}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm opacity-80">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{request.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{request.reason}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      {request.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                          >
                            <XIcon className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {request.status === "Approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-950"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approved
                        </Button>
                      )}
                      {request.status === "Rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-950"
                        >
                          <XIcon className="h-4 w-4 mr-1" />
                          Rejected
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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