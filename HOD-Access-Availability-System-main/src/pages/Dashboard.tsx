import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Clock, Users, Settings, LogOut, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState<"hod" | "student">("hod");

  useEffect(() => {
    const checkAndSetRole = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const queryRole = urlParams.get("role");

        // console.log("useEffect - URL role parameter:", queryRole);

        if (queryRole === "hod") {
          // console.log("Setting role to HOD from URL");
          setRole("hod");
          sessionStorage.setItem("selectedRole", "hod");
          // Clean up URL
          window.history.replaceState({}, '', window.location.pathname);
        } else if (queryRole === "student") {
          // console.log("Setting role to student from URL");
          setRole("student");
          sessionStorage.setItem("selectedRole", "student");
          // Clean up URL
          window.history.replaceState({}, '', window.location.pathname);
        } else {
          // Check session storage
          const storedRole = sessionStorage.getItem("selectedRole");
          // console.log("No URL role, checking stored role:", storedRole);
          if (storedRole === "hod" || storedRole === "student") {
            setRole(storedRole);
          }
        }
      } catch (error) {
        // console.error("Error in role detection:", error);
      }
    };

    checkAndSetRole();
  }, []);

  // console.log("Dashboard component - current role:", role);


  // console.log("Current role being rendered:", role);

  const [currentStatus, setCurrentStatus] = useState<"available" | "busy" | "not-available">("available");

  // Meeting request form state
  const [meetingRequest, setMeetingRequest] = useState({
    name: "",
    date: "",
    time: "",
    reason: ""
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample student requests data
  const [studentRequests, setStudentRequests] = useState([
    {
      id: 1,
      studentName: "John Doe",
      time: "10:30 AM",
      date: "2024-01-15",
      reason: "Project guidance for final year thesis on machine learning algorithms",
      status: "Pending"
    },
    {
      id: 2,
      studentName: "Jane Smith",
      time: "2:00 PM",
      date: "2024-01-15",
      reason: "Discussion about internship opportunities and career guidance",
      status: "Pending"
    },
    {
      id: 3,
      studentName: "Bob Johnson",
      time: "11:00 AM",
      date: "2024-01-16",
      reason: "Request for extension on assignment submission deadline",
      status: "Pending"
    },
    {
      id: 4,
      studentName: "Alice Brown",
      time: "3:30 PM",
      date: "2024-01-16",
      reason: "Clarification on course syllabus and grading criteria",
      status: "Pending"
    }
  ]);

  const handleAcceptRequest = (requestId: number) => {
    setStudentRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: "Approved" } : req
      )
    );
    alert("Request approved successfully!");
  };

  const handleRejectRequest = (requestId: number) => {
    setStudentRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: "Rejected" } : req
      )
    );
    alert("Request rejected.");
  };

  const handleRescheduleRequest = (requestId: number) => {
    const newTime = prompt("Enter new time (e.g., 2:00 PM):");
    if (newTime) {
      setStudentRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, time: newTime } : req
        )
      );
      alert("Request rescheduled successfully!");
    }
  };

  const handleMeetingRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {[key: string]: string} = {};

    if (!meetingRequest.name.trim()) errors.name = "Name is required";
    if (!meetingRequest.date.trim()) errors.date = "Date is required";
    if (!meetingRequest.time.trim()) errors.time = "Time is required";
    if (!meetingRequest.reason.trim()) errors.reason = "Reason is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert("Meeting request submitted successfully!");
      setMeetingRequest({ name: "", date: "", time: "", reason: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  const [availability, setAvailability] = useState([
    { day: "Monday", slots: ["9:00 AM - 11:00 AM", "2:00 PM - 4:00 PM"] },
    { day: "Tuesday", slots: ["10:00 AM - 12:00 PM", "3:00 PM - 5:00 PM"] },
    { day: "Wednesday", slots: ["9:00 AM - 11:00 AM"] },
    { day: "Thursday", slots: ["1:00 PM - 3:00 PM"] },
    { day: "Friday", slots: ["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"] },
  ]);

  const [appointments] = useState([
    { id: 1, student: "John Doe", time: "10:00 AM", date: "2024-01-15", status: "confirmed" },
    { id: 2, student: "Jane Smith", time: "2:00 PM", date: "2024-01-15", status: "pending" },
    { id: 3, student: "Bob Johnson", time: "11:00 AM", date: "2024-01-16", status: "confirmed" },
  ]);

  const [dailySchedule] = useState([
    { id: 1, time: "9:00 AM", title: "Department Meeting", description: "Weekly department coordination" },
    { id: 2, time: "10:30 AM", title: "Student Consultation", description: "Meeting with John Doe - Project guidance" },
    { id: 3, time: "12:00 PM", title: "Lunch Break", description: "Lunch with faculty colleagues" },
    { id: 4, time: "2:00 PM", title: "Research Review", description: "Review ongoing research projects" },
    { id: 5, time: "4:00 PM", title: "Student Consultation", description: "Meeting with Jane Smith - Thesis discussion" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500 hover:bg-green-600";
      case "busy":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "not-available":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "busy":
        return "Busy";
      case "not-available":
        return "Not Available";
      default:
        return "Unknown";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-600";
      case "busy":
        return "text-yellow-600";
      case "not-available":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              {role === "hod" ? (
                <Settings className="h-4 w-4 text-primary" />
              ) : (
                <User className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {role === "hod" ? "HOD Dashboard" : "Student Portal"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {role === "hod"
                  ? "Manage your availability and appointments"
                  : "Request meetings and check HOD availability"
                }
              </p>
            </div>
          </div>
          {role === "hod" && (
          <div className="flex items-center gap-2">
            <Button
              variant={role === "hod" ? "default" : "outline"}
              size="sm"
              onClick={() => setRole("hod")}
            >
              HOD View
            </Button>
            <Button
              variant={role === "student" ? "default" : "outline"}
              size="sm"
              onClick={() => setRole("student")}
            >
              Student View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.sessionStorage.removeItem("selectedRole");
                }
                navigate("/");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          )}
        </div>
      </header>

      <div className="p-6">
        {role === "hod" ? (
          <>
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
              </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Availability Status Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Status</span>
                  <span className={`text-sm font-medium ${getStatusTextColor(currentStatus)}`}>
                    Status: {getStatusText(currentStatus)}
                  </span>
                </CardTitle>
                <CardDescription>
                  Set your availability status for students to see
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setCurrentStatus("available")}
                    className={`flex-1 transition-all duration-200 ${
                      currentStatus === "available"
                        ? "bg-green-500 hover:bg-green-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    variant={currentStatus === "available" ? "default" : "outline"}
                  >
                    Available
                  </Button>
                  <Button
                    onClick={() => setCurrentStatus("busy")}
                    className={`flex-1 transition-all duration-200 ${
                      currentStatus === "busy"
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    variant={currentStatus === "busy" ? "default" : "outline"}
                  >
                    Busy
                  </Button>
                  <Button
                    onClick={() => setCurrentStatus("not-available")}
                    className={`flex-1 transition-all duration-200 ${
                      currentStatus === "not-available"
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    variant={currentStatus === "not-available" ? "default" : "outline"}
                  >
                    Not Available
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Daily Schedule Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>Your daily meetings and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-3 border-b border-border last:border-0">
                    <div className="flex-shrink-0 w-16 text-sm font-medium text-primary">
                      9:00 AM
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Department Meeting</p>
                      <p className="text-xs text-muted-foreground">Weekly department sync with faculty members</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-3 border-b border-border last:border-0">
                    <div className="flex-shrink-0 w-16 text-sm font-medium text-primary">
                      10:30 AM
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Student Consultation</p>
                      <p className="text-xs text-muted-foreground">Meeting with John Doe regarding project guidance</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-3 border-b border-border last:border-0">
                    <div className="flex-shrink-0 w-16 text-sm font-medium text-primary">
                      12:00 PM
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Lunch Break</p>
                      <p className="text-xs text-muted-foreground">Scheduled break and meal time</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-3 border-b border-border last:border-0">
                    <div className="flex-shrink-0 w-16 text-sm font-medium text-primary">
                      2:00 PM
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Curriculum Review</p>
                      <p className="text-xs text-muted-foreground">Review and update course curriculum with committee</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-3 border-b border-border last:border-0">
                    <div className="flex-shrink-0 w-16 text-sm font-medium text-primary">
                      4:00 PM
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Research Discussion</p>
                      <p className="text-xs text-muted-foreground">Discuss ongoing research projects and publications</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <Send className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentRequests.filter(r => r.status.toLowerCase() === "pending").length}</div>
                  <p className="text-xs text-muted-foreground">Awaiting response</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">2 confirmed, 1 pending</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Students Served</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">95%</div>
                  <p className="text-xs text-muted-foreground">Average response time: 2h</p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your planned activities and meetings for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailySchedule.map((item, index) => (
                    <div key={item.id} className="flex items-start gap-4 pb-4 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {index + 1}
                        </div>
                        {index < dailySchedule.length - 1 && (
                          <div className="mt-2 h-8 w-px bg-border"></div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{item.time}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>Your upcoming and recent student appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{appointment.student}</p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.date} at {appointment.time}
                        </p>
                      </div>
                      <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Student Requests
                  </CardTitle>
                  <CardDescription>
                    Review and manage student meeting requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentRequests.map((request) => (
                      <div key={request.id} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium text-foreground">{request.studentName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {request.date} at {request.time}
                            </p>
                          </div>
                          <StatusBadge status={request.status} />
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">Reason:</span> {request.reason}
                          </p>
                        </div>

                        {request.status.toLowerCase() === "pending" && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleAcceptRequest(request.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectRequest(request.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRescheduleRequest(request.id)}
                            >
                              Reschedule
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}

                    {studentRequests.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No student requests at the moment</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Availability</CardTitle>
                <CardDescription>Manage your available time slots for student appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availability.map((day) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <div className="font-medium">{day.day}</div>
                      <div className="flex gap-2">
                        {day.slots.map((slot, index) => (
                          <Badge key={index} variant="outline">
                            {slot}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="mt-4 w-full" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Availability
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>View and manage all your student appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{appointment.student}</p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.date} at {appointment.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                          {appointment.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </TabsContent>
          </Tabs>
          </>
        ) : (
          // Student Portal Content
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Student Portal</h2>
              <p className="text-muted-foreground">Request a meeting with your HOD</p>
            </div>

            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Send className="h-5 w-5 text-primary" />
                  Meeting Request Form
                </CardTitle>
                <CardDescription className="text-base">
                  Fill out all the details below to submit your meeting request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMeetingRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={meetingRequest.name}
                      onChange={(e) => setMeetingRequest(prev => ({ ...prev, name: e.target.value }))}
                      className={formErrors.name ? "border-red-500" : ""}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={meetingRequest.date}
                        onChange={(e) => setMeetingRequest(prev => ({ ...prev, date: e.target.value }))}
                        className={formErrors.date ? "border-red-500" : ""}
                      />
                      {formErrors.date && (
                        <p className="text-sm text-red-500">{formErrors.date}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={meetingRequest.time}
                        onChange={(e) => setMeetingRequest(prev => ({ ...prev, time: e.target.value }))}
                        className={formErrors.time ? "border-red-500" : ""}
                      />
                      {formErrors.time && (
                        <p className="text-sm text-red-500">{formErrors.time}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Meeting</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please describe the purpose of your meeting request"
                      value={meetingRequest.reason}
                      onChange={(e) => setMeetingRequest(prev => ({ ...prev, reason: e.target.value }))}
                      className={formErrors.reason ? "border-red-500" : ""}
                      rows={4}
                    />
                    {formErrors.reason && (
                      <p className="text-sm text-red-500">{formErrors.reason}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <Send className="mr-3 h-5 w-5" />
                        Submit Meeting Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>HOD Availability</CardTitle>
                <CardDescription>Current status and information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    currentStatus === "available" ? "bg-green-500" :
                    currentStatus === "busy" ? "bg-yellow-500" : "bg-red-500"
                  }`} />
                  <span className="text-sm">
                    HOD is currently <span className="font-medium">{getStatusText(currentStatus)}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
