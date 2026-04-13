import { useEffect, useState } from "react";
import { CheckCircle2, Send, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [hodAvailable] = useState(true);
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [requestStatus, setRequestStatus] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [isRequesting, setIsRequesting] = useState(false);
  useEffect(() => {
    if (!isRequesting) {
      return;
    }

    const timer = window.setTimeout(() => {
      const nextStatus = Math.random() > 0.5 ? "Approved" : "Rejected";
      setRequestStatus(nextStatus);
      setIsRequesting(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [isRequesting]);

  const statusMessage =
    requestStatus === "Pending"
      ? "Your meeting request is pending review. Please wait a few seconds."
      : requestStatus === "Approved"
      ? "Great news — your meeting request has been approved."
      : "Your meeting request was rejected. You can try again later.";

  return (
    <div className="relative min-h-screen overflow-hidden animated-dashboard-background px-4 py-10 text-slate-900">
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
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Student Dashboard</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Check HOD availability, submit your meeting request, and send access details with topic and notes.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.95fr]">
            <div className="space-y-6">
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

              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Your Meeting Request</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Badge
                        variant={requestStatus === "Pending" ? "secondary" : requestStatus === "Approved" ? "default" : "destructive"}
                        className="rounded-full px-4 py-2 text-sm"
                      >
                        {requestStatus}
                      </Badge>
                      <span className="text-sm text-slate-300">{statusMessage}</span>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-900/70 px-4 py-3 text-sm text-slate-400">
                    <div className="font-semibold text-white">Request flow</div>
                    <div>Submit topic & notes</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
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

                <div className="grid gap-4">
                  <label className="grid gap-2 text-slate-300">
                    <span className="text-sm font-medium text-slate-300">Meeting Topic</span>
                    <input
                      value={topic}
                      onChange={(event) => setTopic(event.target.value)}
                      placeholder="Enter meeting topic"
                      className="rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-1 ring-transparent transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                    />
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

                  <Button
                    className="w-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-[0_18px_30px_rgba(59,130,246,0.24)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_40px_rgba(37,99,235,0.28)]"
                    onClick={() => {
                      if (!topic.trim()) {
                        return;
                      }
                      setRequestStatus("Pending");
                      setIsRequesting(true);
                    }}
                    disabled={isRequesting || topic.trim().length === 0}
                  >
                    {isRequesting ? "Requesting..." : "Submit Request"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
