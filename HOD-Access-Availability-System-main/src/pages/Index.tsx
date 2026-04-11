import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, GraduationCap, Shield, Briefcase, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="animate-fade-in text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Shield className="h-3.5 w-3.5 text-primary" />
            Access & Availability System
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            HOD Access Portal
          </h1>

          <p className="mx-auto mb-12 max-w-md text-base text-muted-foreground sm:text-lg">
            A streamlined platform to manage HOD schedules, availability, and student access — all in one place.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid w-full max-w-4xl gap-5 sm:grid-cols-3" style={{ animationDelay: "0.15s", animationFillMode: "both" }}>
          <button
            onClick={() => navigate("/login/hod")}
            onMouseEnter={() => setHoveredRole("hod")}
            onMouseLeave={() => setHoveredRole(null)}
            className="group animate-fade-in rounded-xl border border-border bg-card p-8 text-left shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-1.5 text-lg font-semibold text-foreground">HOD Login</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Manage your schedule and availability for students.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all duration-200 group-hover:gap-2.5">
              Continue <ArrowRight className="h-4 w-4" />
            </span>
          </button>

          <button
            onClick={() => navigate("/login/student")}
            onMouseEnter={() => setHoveredRole("student")}
            onMouseLeave={() => setHoveredRole(null)}
            className="group animate-fade-in rounded-xl border border-border bg-card p-8 text-left shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md"
            style={{ animationDelay: "0.35s", animationFillMode: "both" }}
          >
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-1.5 text-lg font-semibold text-foreground">Student Login</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Check HOD availability and book appointments.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all duration-200 group-hover:gap-2.5">
              Continue <ArrowRight className="h-4 w-4" />
            </span>
          </button>

          <button
            onClick={() => navigate("/login/faculty")}
            onMouseEnter={() => setHoveredRole("faculty")}
            onMouseLeave={() => setHoveredRole(null)}
            className="group animate-fade-in rounded-xl border border-border bg-card p-8 text-left shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md"
            style={{ animationDelay: "0.5s", animationFillMode: "both" }}
          >
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-1.5 text-lg font-semibold text-foreground">Faculty Login</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Manage schedules and coordinate with HOD.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all duration-200 group-hover:gap-2.5">
              Continue <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HOD Access Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
