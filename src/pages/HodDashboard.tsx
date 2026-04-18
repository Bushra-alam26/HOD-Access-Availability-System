/**
 * HOD Dashboard Page
 * Main dashboard for Head of Department to manage student requests
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun, Menu, X, Clock3, CalendarDays, CheckCircle2, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequestList } from "@/components/RequestList";
import { SummaryCard, SummaryCardSkeleton } from "@/components/SummaryCard";
import { useRequestsList } from "@/hooks/useRequests";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { useAuth } from "@/hooks/useAuth";

interface LoggedInUser {
  id: string;
  fullName: string;
  email: string;
  usn: string;
  branch: string;
  semester: number;
  lastLogin: string;
}

const HodDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loggedInUsers, setLoggedInUsers] = useState<LoggedInUser[]>([]);
  const [allUsers, setAllUsers] = useState<LoggedInUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  
  // Get user name from localStorage
  const userName = localStorage.getItem("userName") || "HOD";

  // Fetch requests for statistics
  const { data: requests = [] } = useRequestsList();
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = useDashboardSummary();

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

  // Fetch logged in users
  const fetchLoggedInUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/auth/logged-users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setLoggedInUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching logged in users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch all registered users
  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/auth/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAllUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch logged in users on mount
  useEffect(() => {
    fetchLoggedInUsers();
    fetchAllUsers();
  }, []);

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
                  📚 HOD Dashboard
                </h1>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  Appointment & Request Management
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
        <div className="mb-6 md:mb-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 p-4 md:p-6 text-white shadow-lg fade-in-up">
          <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Welcome Back, {userName}!</h2>
          <p className="text-blue-100">
            Manage student appointment requests and keep track of all meeting schedules.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row gap-3 md:gap-4 md:items-center md:justify-between fade-in-up stagger-1">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Dashboard Summary</h2>
            <p className="mt-1 text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Live request and meeting insights for the HOD team.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => refetchSummary()}>
              Refresh data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 mb-8">
          {summaryLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <SummaryCardSkeleton key={index} />
            ))
          ) : summaryError || !summary ? (
            <div className="col-span-1 xl:col-span-4 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-900 shadow-sm">
              <p className="font-semibold">Unable to load summary data.</p>
              <p className="mt-2 text-sm text-red-700">
                Please refresh the dashboard or check your connection.
              </p>
              <Button className="mt-4" onClick={() => refetchSummary()}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              <SummaryCard
                title="Pending Requests"
                value={summary.pendingRequests}
                subtitle="Requests waiting for review"
                icon={Clock3}
                color="orange"
              />
              <SummaryCard
                title="Today's Meetings"
                value={summary.todaysMeetings}
                subtitle="Meetings scheduled for today"
                icon={CalendarDays}
                color="blue"
              />
              <SummaryCard
                title="Approved Today"
                value={summary.approvedToday}
                subtitle="Requests approved today"
                icon={CheckCircle2}
                color="green"
              />
              <SummaryCard
                title="Total Students"
                value={summary.totalStudents}
                subtitle="Registered student count"
                icon={Users}
                color="purple"
              />
            </>
          )}
        </div>

        {/* Request List Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <RequestList />
        </div>

        {/* Logged In Users Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {showAllUsers ? "All Registered Students" : "Logged In Users"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {showAllUsers ? "All registered students in the system" : "Students currently logged in"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showAllUsers ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAllUsers(false)}
                disabled={loadingUsers}
              >
                Logged In
              </Button>
              <Button
                variant={showAllUsers ? "outline" : "default"}
                size="sm"
                onClick={() => setShowAllUsers(true)}
                disabled={loadingUsers}
              >
                View All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { fetchLoggedInUsers(); fetchAllUsers(); }}
                disabled={loadingUsers}
              >
                {loadingUsers ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {loadingUsers ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (showAllUsers ? allUsers.length === 0 : loggedInUsers.length === 0) ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{showAllUsers ? "No registered students found" : "No students currently logged in"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">USN</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Branch</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Sem</th>
                    {showAllUsers && <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>}
                    {!showAllUsers && <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Login Time</th>}
                    {!showAllUsers && <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>}
                  </tr>
                </thead>
                <tbody>
                  {(showAllUsers ? allUsers : loggedInUsers).map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{user.fullName}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{user.usn}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{user.branch}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{user.semester}</td>
                      {showAllUsers ? (
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.isLoggedIn 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.isLoggedIn ? "bg-green-500" : "bg-gray-400"}`}></span>
                            {user.isLoggedIn ? "Online" : "Offline"}
                          </span>
                        </td>
                      ) : (
                        <>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              Online
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2026 College Appointment Management System</p>
            <p className="mt-1">For HOD - Manage and respond to student requests</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HodDashboard;
