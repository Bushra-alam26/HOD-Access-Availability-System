import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Shield, GraduationCap, Users, ArrowLeft } from "lucide-react";
import { FormField } from "@/components/FormField";

const Login = () => {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();
  const isHod = role === "hod";
  const isFaculty = role === "faculty";
  const isStudent = role === "student";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    if (errors.username && value.trim()) {
      setErrors(prev => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (errors.password && value.trim()) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => navigate(`/dashboard?role=${role ?? "student"}`), 1200);

    // Store user role in localStorage for session management
    localStorage.setItem("userRole", role || "student");

    setTimeout(() => {
      if (isHod) {
        navigate("/hod-dashboard");
      } else if (isFaculty) {
        navigate("/faculty-dashboard");
      } else {
        navigate("/dashboard");
      }
    }, 1200);
  };

  const isFormValid = username.trim() && password.trim();

  const getIcon = () => {
    if (isHod) return Shield;
    if (isFaculty) return Users;
    return GraduationCap;
  };

  const getTitle = () => {
    if (isHod) return "HOD Login";
    if (isFaculty) return "Faculty Login";
    return "Student Login";
  };

  const getDescription = () => {
    if (isHod) return "Sign in to manage your availability";
    if (isFaculty) return "Sign in to access faculty resources";
    return "Sign in to check HOD schedules";
  };

  const getAlternativeLink = () => {
    if (isHod) return { text: "Student Login", path: "/login/student" };
    if (isFaculty) return { text: "Student Login", path: "/login/student" };
    return { text: "HOD Login", path: "/login/hod" };
  };

  const Icon = getIcon();
  const alternative = getAlternativeLink();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portal
        </Link>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-in rounded-3xl border border-border bg-card p-8 shadow-lg sm:p-10"
        >
          <div className="mb-10 flex flex-col items-center gap-2">
            <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {getTitle()}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {getDescription()}
            </p>
          </div>

          <FormField
            label="Username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter your username"
            error={errors.username}
            required
          />

          <FormField
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••••••"
            error={errors.password}
            required
          />

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Signing in…
              </span>
            ) : (
              "Login"
            )}
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {isFaculty ? "Not a faculty member?" : isHod ? "Not an HOD?" : "Not a student?"}{" "}
            <Link
              to={alternative.path}
              className="font-medium text-primary hover:underline"
            >
              {alternative.text}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
