import { useState } from "react";
import { Bell, User, Clock, Calendar, CheckCircle, Users, Home, Users as FacultyIcon, CalendarDays, FileText, LogOut, X, Check, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const [currentStatus, setCurrentStatus] = useState("Available");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    reason: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    date: "",
    time: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statuses = [
    { label: "Available", color: "bg-green-500 hover:bg-green-600", selectedColor: "bg-green-600" },
    { label: "Busy", color: "bg-yellow-500 hover:bg-yellow-600", selectedColor: "bg-yellow-600" },
    { label: "Not Available", color: "bg-red-500 hover:bg-red-600", selectedColor: "bg-red-600" },
  ];
  const summaryCards = [
    { title: "Pending Requests", value: 4, icon: Clock, color: "text-orange-500" },
    { title: "Today's Meetings", value: 3, icon: Calendar, color: "text-blue-500" },
    { title: "Approved Today", value: 5, icon: CheckCircle, color: "text-green-500" },
    { title: "Total Students", value: 42, icon: Users, color: "text-purple-500" },
  ];

  const scheduleItems = [
    "9:00 AM – Faculty Meeting",
    "10:30 AM – Student: Rahul Verma – Project Review",
    "12:00 PM – Lunch Break",
    "2:00 PM – Student: Priya Singh – Thesis Discussion",
    "3:30 PM – Department Review",
  ];

  const studentRequests = [
    {
      name: "Amit Kumar",
      status: "pending",
      time: "11:00 AM",
      reason: "Lab report guidance",
    },
    {
      name: "Sneha Patel",
      status: "pending",
      time: "1:30 PM",
      reason: "Thesis consultation",
    },
    {
      name: "Rajesh Gupta",
      status: "pending",
      time: "4:00 PM",
      reason: "Project discussion",
    },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = {
      name: formData.name.trim() ? "" : "Name is required",
      date: formData.date ? "" : "Date is required",
      time: formData.time ? "" : "Time is required",
      reason: formData.reason.trim() ? "" : "Reason is required",
    };
    setFormErrors(errors);
    if (Object.values(errors).some(error => error)) {
      return;
    }
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      alert("Meeting request submitted successfully!");
      setFormData({ name: "", date: "", time: "", reason: "" });
      setFormErrors({ name: "", date: "", time: "", reason: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col min-h-screen">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">HOD System</h2>
        </div>
        <nav className="px-4 flex-1">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-blue-50 rounded-lg">
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <FacultyIcon className="w-5 h-5 mr-3" />
                Faculty
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <CalendarDays className="w-5 h-5 mr-3" />
                Leaves
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Calendar className="w-5 h-5 mr-3" />
                Appointments
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <FileText className="w-5 h-5 mr-3" />
                Reports
              </a>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Manage your availability and student requests</p>
              {/* Availability Status */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Status: <span className="font-semibold text-gray-800">{currentStatus}</span></p>
                <div className="flex space-x-2">
                  {statuses.map((status) => (
                    <Button
                      key={status.label}
                      onClick={() => setCurrentStatus(status.label)}
                      className={`px-4 py-2 text-white font-medium rounded-lg transition-colors ${
                        currentStatus === status.label
                          ? status.selectedColor
                          : status.color
                      }`}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {summaryCards.map((card, index) => (
              <Card key={index} className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">{card.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Meeting Request Form */}
          <Card className="shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Request a Meeting</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className={formErrors.date ? "border-red-500" : ""}
                    />
                    {formErrors.date && <p className="text-sm text-red-500 mt-1">{formErrors.date}</p>}
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange("time", e.target.value)}
                      className={formErrors.time ? "border-red-500" : ""}
                    />
                    {formErrors.time && <p className="text-sm text-red-500 mt-1">{formErrors.time}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Enter the reason for the meeting"
                    value={formData.reason}
                    onChange={(e) => handleInputChange("reason", e.target.value)}
                    className={formErrors.reason ? "border-red-500" : ""}
                  />
                  {formErrors.reason && <p className="text-sm text-red-500 mt-1">{formErrors.reason}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Schedule and Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {scheduleItems.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Student Requests */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Student Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentRequests.map((request, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">{request.name}</h4>
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{request.time} – {request.reason}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button size="sm" variant="destructive">
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
