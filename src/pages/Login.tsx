import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Shield, GraduationCap, ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();
  const isHod = role === "hod";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => navigate(`/dashboard?role=${role ?? "student"}`), 1200);
  };

  const Icon = isHod ? Shield : GraduationCap;

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
              {isHod ? "HOD Login" : "Student Login"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isHod
                ? "Sign in to manage your availability"
                : "Sign in to check HOD schedules"}
            </p>
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="input-glow w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-destructive">{errors.username}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-glow w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
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
            {isHod ? "Not an HOD?" : "Not a student?"}{" "}
            <Link
              to={isHod ? "/login/student" : "/login/hod"}
              className="font-medium text-primary hover:underline"
            >
              {isHod ? "Student Login" : "HOD Login"}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
