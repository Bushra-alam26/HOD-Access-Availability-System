/**
 * HOD Dashboard Page
 * Main dashboard for Head of Department to manage student requests
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun, Menu, X, Clock3, CalendarDays, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequestList } from "@/components/RequestList";
import { SummaryCard, SummaryCardSkeleton } from "@/components/SummaryCard";
import { useRequestsList } from "@/hooks/useRequests";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";

const HodDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
  const handleLogout = () => {
    window.localStorage.removeItem("userRole");
    window.localStorage.removeItem("userName");
    navigate("/");
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
                  📚 HOD Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
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
        <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 p-6 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Welcome Back, HOD!</h2>
          <p className="text-blue-100">
            Manage student appointment requests and keep track of all meeting schedules.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard Summary</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
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
