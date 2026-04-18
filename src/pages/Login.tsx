import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Shield, GraduationCap, Users, ArrowLeft, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const API_URL = "http://localhost:5001/api/auth";

const Login = () => {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();
  const { login: setAuth } = useAuth();
  
  const isHod = role === "hod";
  const isFaculty = role === "faculty";
  const isStudent = role === "student";

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Registration form state
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    firstName: "",
    surname: "",
    email: "",
    password: "",
    branch: ""
  });
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setLoginError("");

    if (errors.email && validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setLoginError("");

    if (errors.password && value.length >= 6) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  // Validate login form
  const validateLoginForm = () => {
    const newErrors: typeof errors = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email (e.g., student@gmail.com)";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;

    setLoading(true);
    setLoginError("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email, 
          password,
          role: role || "student"
        })
      });

      const data = await response.json();

      if (data.success) {
        // Login successful
        const userRole = data.user.role || role || "student";
        setAuth(userRole);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", `${data.user.firstName} ${data.user.surname}`);
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        
        if (isHod || userRole === "hod") {
          navigate("/hod-dashboard");
        } else if (isFaculty || userRole === "faculty") {
          navigate("/faculty-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else if (data.isNewUser) {
        // New user - show registration form
        setRegisterData(prev => ({ ...prev, email }));
        setShowRegister(true);
        setLoginError("");
      } else {
        setLoginError(data.message || "Invalid email or password");
      }
    } catch (error) {
      setLoginError("Unable to connect to server. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle register input change
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    
    if (registerErrors[name]) {
      setRegisterErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate registration form
  const validateRegisterForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!registerData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!registerData.surname.trim()) {
      newErrors.surname = "Surname is required";
    }
    if (!registerData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(registerData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!registerData.password) {
      newErrors.password = "Password is required";
    } else if (registerData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!registerData.branch.trim()) {
      newErrors.branch = "Branch is required";
    }
    
    // Only validate USN and semester for students
    if (isStudent) {
      if (!registerData.usn?.trim()) {
        newErrors.usn = "USN is required";
      }
      if (!registerData.semester) {
        newErrors.semester = "Semester is required";
      }
    }
    
    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle registration submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;

    setRegisterLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...registerData,
          semester: isStudent ? (parseInt(registerData.semester) || 1) : undefined,
          usn: isStudent ? registerData.usn : undefined,
          role: role || "student"
        })
      });

      const data = await response.json();

      if (data.success) {
        setRegisterSuccess(true);
        
        // Auto login after registration
        setTimeout(() => {
          const userRole = data.user.role || role || "student";
          setAuth(userRole);
          localStorage.setItem("userRole", userRole);
          localStorage.setItem("userEmail", data.user.email);
          localStorage.setItem("userName", `${data.user.firstName} ${data.user.surname}`);
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          
          if (isHod || userRole === "hod") {
            navigate("/hod-dashboard");
          } else if (isFaculty || userRole === "faculty") {
            navigate("/faculty-dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 1500);
      } else {
        setRegisterErrors({ form: data.message || "Registration failed" });
      }
    } catch (error) {
      setRegisterErrors({ form: "Unable to connect to server. Please try again." });
      console.error("Registration error:", error);
    } finally {
      setRegisterLoading(false);
    }
  };

  // Check if login form is valid
  const isLoginValid = email.trim() && password.length >= 6 && validateEmail(email);


      if (data.success) {
        // Login successful
        const userRole = data.user.role || role || "student";
        setAuth(userRole);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", `${data.user.firstName} ${data.user.surname}`);
        
        if (isHod || userRole === "hod") {
          navigate("/hod-dashboard");
        } else if (isFaculty || userRole === "faculty") {
          navigate("/faculty-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else if (data.isNewUser) {
        // New user - show registration form
        setRegisterData(prev => ({ ...prev, email }));
        setShowRegister(true);
        setLoginError("");
      } else {
        setLoginError(data.message || "Invalid email or password");
      }
    } catch (error) {
      setLoginError("Unable to connect to server. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle register input change
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    
    if (registerErrors[name]) {
      setRegisterErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate registration form
  const validateRegisterForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!registerData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!registerData.surname.trim()) {
      newErrors.surname = "Surname is required";
    }
    if (!registerData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(registerData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!registerData.password) {
      newErrors.password = "Password is required";
    } else if (registerData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!registerData.branch.trim()) {
      newErrors.branch = "Branch is required";
    }
    
    // Only validate USN and semester for students
    if (isStudent) {
      if (!registerData.usn?.trim()) {
        newErrors.usn = "USN is required";
      }
      if (!registerData.semester) {
        newErrors.semester = "Semester is required";
      }
    }
    
    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle registration submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;

    setRegisterLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...registerData,
          semester: isStudent ? (parseInt(registerData.semester) || 1) : undefined,
          usn: isStudent ? registerData.usn : undefined,
          role: role || "student"
        })
      });

      const data = await response.json();

      if (data.success) {
        setRegisterSuccess(true);
        
        // Auto login after registration
        setTimeout(() => {
          const userRole = data.user.role || role || "student";
          setAuth(userRole);
          localStorage.setItem("userRole", userRole);
          localStorage.setItem("userEmail", data.user.email);
          localStorage.setItem("userName", `${data.user.firstName} ${data.user.surname}`);
          
          if (isHod || userRole === "hod") {
            navigate("/hod-dashboard");
          } else if (isFaculty || userRole === "faculty") {
            navigate("/faculty-dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 1500);
      } else {
        setRegisterErrors({ form: data.message || "Registration failed" });
      }
    } catch (error) {
      setRegisterErrors({ form: "Unable to connect to server. Please try again." });
      console.error("Registration error:", error);
    } finally {
      setRegisterLoading(false);
    }
  };

  // Check if login form is valid
  const isLoginValid = email.trim() && password.length >= 6 && validateEmail(email);

  // Get icon based on role
  const getIcon = () => {
    if (isHod) return Shield;
    if (isFaculty) return Users;
    return GraduationCap;
  };

  const getTitle = () => {
    if (showRegister) return "Complete Registration";
    if (isHod) return "HOD Login";
    if (isFaculty) return "Faculty Login";
    return "Student Login";
  };

  const getDescription = () => {
    if (showRegister) return "Please fill in your details to complete registration";
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

  // Render registration form
  if (showRegister) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portal
          </Link>

          {registerSuccess ? (
            <div className="animate-fade-in rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:bg-green-900/20">
              <div className="mb-4 inline-flex rounded-full bg-green-100 p-3 dark:bg-green-800">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-green-800 dark:text-green-200">
                Registration Successful!
              </h2>
              <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleRegisterSubmit}
              className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-lg"
            >
              <div className="mb-5 flex flex-col items-center">
                <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-3">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-xl font-bold text-foreground">
                  Complete Registration
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fill in your details to create your account
                </p>
              </div>

              {registerErrors.form && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20">
                  {registerErrors.form}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all ${
                      registerErrors.firstName 
                        ? "border-red-500 bg-red-50 dark:bg-red-950/20" 
                        : "border-input focus:border-primary"
                    }`}
                  />
                  {registerErrors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{registerErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Surname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={registerData.surname}
                    onChange={handleRegisterChange}
                    className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all ${
                      registerErrors.surname 
                        ? "border-red-500 bg-red-50 dark:bg-red-950/20" 
                        : "border-input focus:border-primary"
                    }`}
                  />
                  {registerErrors.surname && (
                    <p className="mt-1 text-xs text-red-500">{registerErrors.surname}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all ${
                    registerErrors.email 
                      ? "border-red-500 bg-red-50 dark:bg-red-950/20" 
                      : "border-input focus:border-primary"
                  }`}
                />
                {registerErrors.email && (
                  <p className="mt-1 text-xs text-red-500">{registerErrors.email}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all ${
                    registerErrors.password 
                      ? "border-red-500 bg-red-50 dark:bg-red-950/20" 
                      : "border-input focus:border-primary"
                  }`}
                />
                {registerErrors.password && (
                  <p className="mt-1 text-xs text-red-500">{registerErrors.password}</p>
                )}
              </div>

              {/* Only show USN, Branch, Semester for students */}
              {isStudent && (
                <>
                  <div className="mt-4">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      USN Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="usn"
                      value={registerData.usn || ""}
                      onChange={handleRegisterChange}
                      placeholder="e.g., 1BY21CS001"
                      className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all ${
                        registerErrors.usn 
                          ? "border-red-500 bg-red-50 dark:bg-red-950/20" 
                          : "border-input focus:border-primary"
                      }`}
                    />
                    {registerErrors.usn && (
                      <p className="mt-1 text-xs text-red-500">{registerErrors.usn}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Branch <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="branch"
                        value={registerData.branch}
                        onChange={handleRegisterChange}
                        placeholder="e.g., CSE"
                        className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all ${
                          registerErrors.branch 
                            ? "border-red-500 bg-red-50 dark:bg-red-950/20" 
                            : "border-input focus:border-primary"
                        }`}
                      />
                      {registerErrors.branch && (
                        <p className="mt-1 text-xs text-red-500">{registerErrors.branch}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Semester <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="semester"
                        value={registerData.semester || ""}
                        onChange={handleRegisterChange}
                        className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all ${
                          registerErrors.semester 
                            ? "border-red-500 bg-red-50 dark:bg-red-950/20" 
                            : "border-input focus:border-primary"
                        }`}
                      >
                        <option value="">Select</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                          <option key={s} value={s}>Semester {s}</option>
                        ))}
                      </select>
                      {registerErrors.semester && (
                        <p className="mt-1 text-xs text-red-500">{registerErrors.semester}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Show branch for HOD and Faculty */}
              {(isHod || isFaculty) && registerData.branch !== undefined && (
                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={registerData.branch}
                    onChange={handleRegisterChange}
                    placeholder="e.g., CSE"
                    className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all ${
                      registerErrors.branch 
                        ? "border-red-500 bg-red-50 dark:bg-red-950/20" 
                        : "border-input focus:border-primary"
                    }`}
                  />
                  {registerErrors.branch && (
                    <p className="mt-1 text-xs text-red-500">{registerErrors.branch}</p>
                  )}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRegister(false);
                    setRegisterData({
                      firstName: "",
                      surname: "",
                      email: "",
                      password: "",
                      branch: ""
                    });
                    setRegisterErrors({});
                  }}
                  className="flex-1"
                >
                  Back to Login
                </Button>
                <Button
                  type="submit"
                  disabled={registerLoading}
                  className="flex-1"
                >
                  {registerLoading ? "Registering..." : "Register"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Render login form
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
          onSubmit={handleLoginSubmit}
          className="animate-fade-in rounded-xl border border-border bg-card p-8 shadow-lg"
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

          {loginError && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20">
              {loginError}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="student@gmail.com"
              className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all ${
                errors.email 
                  ? "border-red-500 bg-red-50 dark:bg-red-950/20" 
                  : "border-input focus:border-primary"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all ${
                errors.password 
                  ? "border-red-500 bg-red-50 dark:bg-red-950/20" 
                  : "border-input focus:border-primary"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isLoginValid}
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
