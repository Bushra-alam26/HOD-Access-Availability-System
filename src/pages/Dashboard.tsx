import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Send, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Send, XCircle, Clock, Check, X, Filter, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { FormField } from "@/components/FormField";
import { useAuth } from "@/hooks/useAuth";

type RequestStatus = "Pending" | "Approved" | "Rejected";

type StudentRequest = {
  id: number;
  student: string;
  topic: string;
  notes: string;
  status: RequestStatus;
  submittedAt: string;
};

const requestStatusLabel: Record<RequestStatus, string> = {
  Pending: "🟡 Pending",
  Approved: "🟢 Approved",
  Rejected: "🔴 Rejected",
};

const initialRequests: StudentRequest[] = [
  {
    id: 1,
    student: "Anita Sharma",
    topic: "Lab access for project demo",
    notes: "Need to finalize experiment setup before Friday.",
    status: "Pending",
    submittedAt: "Today, 10:18 AM",
  },
  {
    id: 2,
    student: "Rahul Patel",
    topic: "HOD approval for attendance request",
    notes: "Missed a lecture due to medical appointment.",
    status: "Approved",
    submittedAt: "Yesterday, 4:02 PM",
  },
  {
    id: 3,
    student: "Priya Menon",
    topic: "Extra access to research lab",
    notes: "Need additional time for data collection.",
    status: "Rejected",
    submittedAt: "Today, 9:12 AM",
  },
];

interface StudentRequest {
  id: string;
  title: string;
  date: string;
  person: string;
  status: RequestStatus;
}

const dummyRequests: StudentRequest[] = [
  { id: "1", title: "Need HOD Signature", date: "16 Apr 2026", person: "Dr. Sharma", status: "Pending" },
  { id: "2", title: "Project Approval", date: "15 Apr 2026", person: "Dr. Verma", status: "Approved" },
  { id: "3", title: "Leave Permission", date: "14 Apr 2026", person: "Dr. Rao", status: "Rejected" },
  { id: "4", title: "Research Grant Request", date: "13 Apr 2026", person: "Dr. Sharma", status: "Approved" },
  { id: "5", title: "Exam Extension", date: "12 Apr 2026", person: "Dr. Verma", status: "Pending" },
];

const getStatusIcon = (status: RequestStatus) => {
  switch (status) {
    case "Pending":
      return <Clock className="h-4 w-4" />;
    case "Approved":
      return <Check className="h-4 w-4" />;
    case "Rejected":
      return <X className="h-4 w-4" />;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [hodAvailable] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [topicError, setTopicError] = useState("");
  const [notesError, setNotesError] = useState("");
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("Pending");
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestFeedback, setRequestFeedback] = useState("");
  const [activeFilter, setActiveFilter] = useState<RequestStatus | "All">("All");
  
  // Get user name from localStorage
  const userName = localStorage.getItem("userName") || "Student";

  const filteredRequests = activeFilter === "All"
    ? dummyRequests
    : dummyRequests.filter(request => request.status === activeFilter);

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
    
    // Clear local storage and redirect
    logout();
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedTheme = window.localStorage.getItem("theme");
    const initialDarkMode = storedTheme ? storedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(initialDarkMode);
  }, []);

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

  useEffect(() => {
    if (!isRequesting) {
      return;
    }

    const timer = window.setTimeout(() => {
      const nextStatus = Math.random() > 0.5 ? "Approved" : "Rejected";
      setRequestStatus(nextStatus);
      setIsRequesting(false);
      if (nextStatus === "Approved") {
        toast.success("Request approved by the HOD.");
      } else {
        toast.error("Request rejected. Try again later.");
      }
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [isRequesting]);

  const statusMessage =
    requestStatus === "Pending"
      ? "Your meeting request is pending review. Please wait a few seconds."
      : requestStatus === "Approved"
      ? "Great news — your meeting request has been approved."
      : "Your meeting request was rejected. You can try again later.";

  const pendingCount = requests.filter((request) => request.status === "Pending").length;
  const approvedCount = requests.filter((request) => request.status === "Approved").length;
  const rejectedCount = requests.filter((request) => request.status === "Rejected").length;

  const handleTopicChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTopic(value);

    if (topicError && value.trim()) {
      setTopicError("");
    }

    if (requestFeedback) {
      setRequestFeedback("");
    }
  };

  const handleNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setNotes(value);

    if (notesError && value.trim()) {
      setNotesError("");
    }

    if (requestFeedback) {
      setRequestFeedback("");
    }
  };

  const validateForm = () => {
    const errors = { topic: "", notes: "" };
    let isValid = true;

    if (!topic.trim()) {
      errors.topic = "Meeting topic is required";
      isValid = false;
    }

    if (!notes.trim()) {
      errors.notes = "Notes are required";
      isValid = false;
    }

    setTopicError(errors.topic);
    setNotesError(errors.notes);

    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setRequestFeedback("Request submitted successfully");
    toast.success("Request submitted successfully");
    setRequestStatus("Pending");
    setIsRequesting(true);
  };

  const updateRequestStatus = (id: number, status: RequestStatus) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
            }
          : request,
      ),
    );
    toast.success(`Request ${status.toLowerCase()} successfully.`);
  };

  const approveRequest = (id: number) => updateRequestStatus(id, "Approved");
  const rejectRequest = (id: number) => updateRequestStatus(id, "Rejected");
  const isFormValid = topic.trim() && notes.trim();

  return (
    <div className="relative min-h-screen overflow-hidden animated-dashboard-background px-4 py-10 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />
        <div className="bg-animated-glow left-8 top-24 h-44 w-44 bg-sky-300/45" />
        <div className="bg-animated-glow slow right-8 top-28 h-56 w-56 bg-rose-300/40" />
        <div className="bg-animated-glow fast left-1/2 top-1/3 h-36 w-36 -translate-x-1/2 bg-emerald-300/45" />
        <div className="bg-animated-glow right-20 bottom-16 h-28 w-28 bg-violet-300/38" />
        <div className="bg-animated-glow slow left-16 bottom-24 h-32 w-32 bg-cyan-300/38" />
        <div className="bg-animated-dot tiny left-20 top-36" />
        <div className="bg-animated-dot small right-24 top-60" />
        <div className="bg-animated-dot medium left-[42%] top-10" />
        <div className="bg-animated-dot fast right-1/4 bottom-28" />
        <div className="bg-animated-dot slow left-1/4 bottom-20" />
        <div className="bg-animated-dot tiny left-3/4 top-[35%]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-slate-200/50 bg-white/95 p-8 shadow-[0_30px_80px_rgba(148,163,184,0.2)] backdrop-blur-xl sm:p-12">
          <div className="mb-10 space-y-3">
            <p className="text-sm uppercase tracking-[0.34em] text-slate-500">Student Dashboard</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">Welcome Back, {userName}!</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              {isHod ? "Review all student access requests and manage approvals." : "Check HOD availability, submit your meeting request, and send access details with topic and notes."}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/80">
              <div className="flex items-center gap-3">
                <Avatar className="bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950">
                  <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Student • hod request portal</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <span>{darkMode ? "Dark mode" : "Light mode"}</span>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </label>
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.95fr]">
            <div className="space-y-8">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-400">HOD Availability Status</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">{hodAvailable ? "Available" : "Not Available"}</h2>
                  </div>
                  <Badge variant={hodAvailable ? "default" : "destructive"} className="rounded-full px-4 py-2 text-sm">
                    {hodAvailable ? "Available" : "Not Available"}
                  </Badge>
                </div>
                <div className="mt-6 flex items-center gap-3 rounded-3xl bg-slate-900/80 p-5 text-slate-300 shadow-inner shadow-slate-950/40">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Next availability</p>
                    <p className="mt-1 text-base font-medium text-white">Today at 3:00 PM</p>
                  </div>
                </div>
              </div>

              {isHod ? (
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Student Request Summary</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <Badge variant="pending" className="rounded-full px-4 py-2 text-sm">{pendingCount} Pending</Badge>
                        <Badge variant="approved" className="rounded-full px-4 py-2 text-sm">{approvedCount} Approved</Badge>
                        <Badge variant="rejected" className="rounded-full px-4 py-2 text-sm">{rejectedCount} Rejected</Badge>
                      </div>
                    </div>
                    <div className="rounded-3xl bg-slate-900/70 px-4 py-3 text-sm text-slate-400">
                      <div className="font-semibold text-white">Total requests</div>
                      <div>{requests.length}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Your Meeting Request</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <Badge
                          variant={
                            requestStatus === "Pending"
                              ? "pending"
                              : requestStatus === "Approved"
                              ? "approved"
                              : "rejected"
                          }
                          className="rounded-full px-4 py-2 text-sm"
                        >
                          {requestStatusLabel[requestStatus]}
                        </Badge>
                        <span className="text-sm text-slate-300">{statusMessage}</span>
                      </div>
                    </div>
                    <div className="rounded-3xl bg-slate-900/70 px-4 py-3 text-sm text-slate-400">
                      <div className="font-semibold text-white">Request flow</div>
                      <div>{requestStatusLabel[requestStatus]}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {isHod ? (
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300">
                      <Send className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">All Student Requests</p>
                      <p className="text-sm text-slate-300">Review and approve or reject requests from all students.</p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-950/95 text-slate-200 shadow-inner shadow-slate-950/40">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.4fr_1fr_1fr_1.1fr] border-b border-slate-800 bg-slate-900/95 px-4 py-4 text-xs uppercase tracking-[0.18em] text-slate-500">
                      <span>Student</span>
                      <span>Requested</span>
                      <span>Status</span>
                      <span className="text-right">Action</span>
                    </div>
                    {requests.map((request) => (
                      <div key={request.id} className="grid grid-cols-1 gap-4 sm:grid-cols-[1.4fr_1fr_1fr_1.1fr] border-t border-slate-900 px-4 py-4 text-sm">
                        <div>
                          <p className="font-medium text-white">{request.student}</p>
                          <p className="mt-1 text-xs text-slate-400">{request.topic}</p>
                        </div>
                        <div className="text-slate-300">{request.submittedAt}</div>
                        <Badge variant={request.status.toLowerCase() as "pending" | "approved" | "rejected"} className="rounded-full px-3 py-1 text-xs">
                          {requestStatusLabel[request.status]}
                        </Badge>
                        <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
                          <Button size="sm" variant="secondary" disabled={request.status === "Approved"} onClick={() => approveRequest(request.id)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" disabled={request.status === "Rejected"} onClick={() => rejectRequest(request.id)}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300">
                      <Send className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">Submit Request Access</p>
                      <p className="text-sm text-slate-300">Share your meeting topic and notes for HOD review.</p>
                    </div>
                  </div>

                  <div className="grid gap-5">
                    <label className="grid gap-2 text-slate-300">
                      <span className="text-sm font-medium text-slate-300">Meeting Topic</span>
                      <input
                        value={topic}
                        onChange={handleTopicChange}
                        placeholder="Enter meeting topic"
                        className="rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-1 ring-transparent transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                      />
                      {topicError ? (
                        <p className="mt-2 flex items-center gap-2 text-sm text-rose-400">
                          <XCircle className="h-4 w-4" />
                          {topicError}
                        </p>
                      ) : null}
                    </label>

                    <label className="grid gap-2 text-slate-300">
                      <span className="text-sm font-medium text-slate-300">Notes</span>
                      <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        placeholder="Add details or questions for the HOD"
                        className="min-h-[120px] rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-1 ring-transparent transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                      />
                    </label>

                    {requestFeedback ? (
                      <div className="rounded-3xl bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-900">
                        {requestFeedback}
                      </div>
                    ) : null}

                    <Button
                      className="w-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-[0_18px_30px_rgba(59,130,246,0.24)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_40px_rgba(37,99,235,0.28)]"
                      onClick={handleSubmit}
                      disabled={isRequesting}
                    >
                      {isRequesting ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Requesting...
                        </span>
                      ) : (
                        "Submit Request"
                      )}
                    </Button>
                  </div>
                <div className="grid gap-4">
                  <FormField
                    label="Meeting Topic"
                    type="text"
                    value={topic}
                    onChange={handleTopicChange}
                    placeholder="Enter meeting topic"
                    error={topicError}
                    required
                    darkMode
                  />

                  <FormField
                    label="Notes"
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Add details or questions for the HOD"
                    error={notesError}
                    required
                    multiline
                    darkMode
                  />

                  {requestFeedback ? (
                    <div className="rounded-3xl bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-900">
                      {requestFeedback}
                    </div>
                  ) : null}

                  <Button
                    className="w-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-[0_18px_30px_rgba(59,130,246,0.24)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_40px_rgba(37,99,235,0.28)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_18px_30px_rgba(59,130,246,0.24)]"
                    onClick={handleSubmit}
                    disabled={isRequesting || !isFormValid}
                  >
                    {isRequesting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Requesting...
                      </span>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* My Request Status Section */}
          <div className="mt-12 rounded-[2rem] border border-slate-200/50 bg-white/95 p-8 shadow-[0_30px_80px_rgba(148,163,184,0.2)] backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/95">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">My Request Status</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Track the status of all your submitted requests and their current approval status.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              <Button
                variant={activeFilter === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("All")}
                className="rounded-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                All ({dummyRequests.length})
              </Button>
              <Button
                variant={activeFilter === "Pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("Pending")}
                className="rounded-full"
              >
                <Clock className="mr-2 h-4 w-4" />
                Pending ({dummyRequests.filter(r => r.status === "Pending").length})
              </Button>
              <Button
                variant={activeFilter === "Approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("Approved")}
                className="rounded-full"
              >
                <Check className="mr-2 h-4 w-4" />
                Approved ({dummyRequests.filter(r => r.status === "Approved").length})
              </Button>
              <Button
                variant={activeFilter === "Rejected" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("Rejected")}
                className="rounded-full"
              >
                <X className="mr-2 h-4 w-4" />
                Rejected ({dummyRequests.filter(r => r.status === "Rejected").length})
              </Button>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="rounded-[1.5rem] border border-slate-200/50 bg-slate-50/50 p-8 text-center dark:border-slate-800/50 dark:bg-slate-900/50">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <Filter className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">No requests found</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    No requests match the selected filter.
                  </p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-[1.5rem] border border-slate-200/50 bg-white/50 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800/50 dark:bg-slate-900/50"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{request.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Submitted to: {request.person}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            <Badge
                              variant={
                                request.status === "Pending"
                                  ? "pending"
                                  : request.status === "Approved"
                                  ? "approved"
                                  : "rejected"
                              }
                              className="rounded-full px-3 py-1 text-xs font-medium"
                            >
                              {request.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <span>Submitted on: {request.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};//task 4 completed

export default Dashboard;
