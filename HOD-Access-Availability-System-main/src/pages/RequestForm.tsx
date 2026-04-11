import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, User, FileText, CheckCircle, AlertCircle } from "lucide-react";

const RequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    reason: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.date) newErrors.date = "Please select a date";
    if (!formData.time) newErrors.time = "Please select a time";
    if (!formData.reason.trim()) newErrors.reason = "Please describe the reason for your meeting";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      // Reset form after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-xl">
        <button
          onClick={() => navigate("/")}
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portal
        </button>

        {submitted ? (
          <Card className="animate-fade-in border-green-200 bg-green-50">
            <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="mb-4 inline-flex rounded-full bg-green-100 p-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-green-900">Request Submitted!</h2>
              <p className="mb-6 text-sm text-green-700">
                Your meeting request has been successfully submitted. The HOD will review your request and get back to you soon.
              </p>
              <button
                onClick={() => navigate("/")}
                className="text-sm font-medium text-green-600 transition-colors hover:text-green-700 underline"
              >
                Return to home
              </button>
            </CardContent>
          </Card>
        ) : (
          <Card className="animate-fade-in border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-3 border-b border-border bg-white rounded-t-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-3 inline-flex rounded-lg bg-blue-50 p-3 shadow-sm">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Request a Meeting
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                Schedule a meeting with the HOD. Fill in all the details below and we'll get back to you shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="name"
                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <User className="h-4 w-4 text-blue-600" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Rajesh Kumar"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`transition-all duration-200 ${
                      errors.name
                        ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200"
                        : "border-input hover:border-blue-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  {errors.name && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Date Field */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="date"
                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Preferred Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className={`transition-all duration-200 ${
                      errors.date
                        ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200"
                        : "border-input hover:border-blue-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  {errors.date && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Time Field */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="time"
                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <Clock className="h-4 w-4 text-blue-600" />
                    Preferred Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className={`transition-all duration-200 ${
                      errors.time
                        ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200"
                        : "border-input hover:border-blue-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  {errors.time && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.time}
                    </p>
                  )}
                </div>

                {/* Reason Field */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="reason"
                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <FileText className="h-4 w-4 text-blue-600" />
                    Reason for Meeting
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe the purpose of your meeting. E.g., Course guidance, academic concerns, project discussion, etc."
                    value={formData.reason}
                    onChange={(e) => handleInputChange("reason", e.target.value)}
                    className={`resize-none transition-all duration-200 ${
                      errors.reason
                        ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200"
                        : "border-input hover:border-blue-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                    rows={4}
                  />
                  {errors.reason && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.reason}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 h-11 rounded-lg bg-blue-600 font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RequestForm;