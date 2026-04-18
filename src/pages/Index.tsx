import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, GraduationCap, Shield, Users, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background page-enter">
      {/* Hero Section */}
      <div className="flex flex-1 flex-col items-center justify-center px-3 py-10 md:px-4 md:py-16">
        <div className="fade-in-up text-center px-2">
          <div className="mb-4 md:mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 md:px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="hidden xs:inline">Access & Availability System</span>
            <span className="xs:hidden">System</span>
          </div>

          <h1 className="mb-3 md:mb-4 text-2xl md:text-4xl font-bold tracking-tight text-foreground">
            HOD Access Portal
          </h1>

          <p className="mx-auto mb-8 md:mb-12 max-w-xs md:max-w-md text-sm md:text-base text-muted-foreground">
            A streamlined platform to manage HOD schedules, availability, and student access — all in one place.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid w-full max-w-4xl gap-3 md:gap-5 sm:grid-cols-2 lg:grid-cols-3 px-2">
          <button
            onClick={() => navigate("/login/hod")}
            onMouseEnter={() => setHoveredRole("hod")}
            onMouseLeave={() => setHoveredRole(null)}
            className="group fade-in-up rounded-xl border border-border bg-card p-5 md:p-8 text-left shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md card-animate"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="mb-3 md:mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 md:p-3 transition-colors duration-300 group-hover:bg-primary/20">
              <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <h2 className="mb-1 md:mb-1.5 text-base md:text-lg font-semibold text-foreground">HOD Login</h2>
            <p className="mb-3 md:mb-4 text-xs md:text-sm text-muted-foreground">
              Manage your schedule and availability for students.
            </p>
            <span className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-primary transition-all duration-200 group-hover:gap-2">
              Continue <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </span>
          </button>

          <button
            onClick={() => navigate("/login/faculty")}
            onMouseEnter={() => setHoveredRole("faculty")}
            onMouseLeave={() => setHoveredRole(null)}
            className="group fade-in-up rounded-xl border border-border bg-card p-5 md:p-8 text-left shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md card-animate"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="mb-3 md:mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 md:p-3 transition-colors duration-300 group-hover:bg-primary/20">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <h2 className="mb-1 md:mb-1.5 text-base md:text-lg font-semibold text-foreground">Faculty Login</h2>
            <p className="mb-3 md:mb-4 text-xs md:text-sm text-muted-foreground">
              Access faculty resources and manage your profile.
            </p>
            <span className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-primary transition-all duration-200 group-hover:gap-2">
              Continue <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </span>
          </button>

          <button
            onClick={() => navigate("/login/student")}
            onMouseEnter={() => setHoveredRole("student")}
            onMouseLeave={() => setHoveredRole(null)}
            className="group fade-in-up rounded-xl border border-border bg-card p-5 md:p-8 text-left shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md sm:col-span-2 lg:col-span-1 card-animate"
            style={{ animationDelay: "0.35s" }}
          >
            <div className="mb-3 md:mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 md:p-3 transition-colors duration-300 group-hover:bg-primary/20">
              <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <h2 className="mb-1 md:mb-1.5 text-base md:text-lg font-semibold text-foreground">Student Login</h2>
            <p className="mb-3 md:mb-4 text-xs md:text-sm text-muted-foreground">
              Check HOD availability and book appointments.
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
