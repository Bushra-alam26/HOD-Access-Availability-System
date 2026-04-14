import React from "react";

type StatusBadgeProps = {
  status?: string;
};

const statusStyles: Record<
  string,
  { label: string; icon: string; className: string }
> = {
  pending: {
    label: "Pending",
    icon: "⏳",
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
  },
  approved: {
    label: "Approved",
    icon: "✔",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
  },
  rejected: {
    label: "Rejected",
    icon: "✖",
    className:
      "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200",
  },
  unknown: {
    label: "Unknown",
    icon: "?",
    className:
      "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200",
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalizedStatus = status?.toString().trim().toLowerCase() || "unknown";
  const { label, icon, className } =
    statusStyles[normalizedStatus] || statusStyles.unknown;

  return (
    <span
      role="status"
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-150 ${className}`}
      aria-label={`Request status: ${label}`}
      data-status={normalizedStatus}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
};

export default StatusBadge;
