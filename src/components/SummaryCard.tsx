import { useEffect, useMemo, useState } from "react";
import type { ComponentType, SVGProps } from "react";

interface SummaryCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: "orange" | "blue" | "green" | "purple";
}

export const SummaryCard = ({ title, value, subtitle, icon: Icon, color }: SummaryCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 650;
    const steps = 25;
    const increment = value / steps;
    const interval = window.setInterval(() => {
      start += increment;
      const next = Math.min(value, Math.round(start));
      setDisplayValue(next);
      if (next >= value) {
        window.clearInterval(interval);
      }
    }, Math.max(10, Math.round(duration / steps)));

    return () => window.clearInterval(interval);
  }, [value]);

  const colorStyles = useMemo(
    () => ({
      orange: "from-orange-100 via-orange-50 to-orange-100 text-orange-900 border-orange-200",
      blue: "from-sky-100 via-sky-50 to-sky-100 text-sky-900 border-sky-200",
      green: "from-emerald-100 via-emerald-50 to-emerald-100 text-emerald-900 border-emerald-200",
      purple: "from-violet-100 via-violet-50 to-violet-100 text-violet-900 border-violet-200",
    }),
    []
  );

  const formattedValue = useMemo(
    () => new Intl.NumberFormat("en-US").format(displayValue),
    [displayValue]
  );

  return (
    <div
      className={`group h-full overflow-hidden rounded-3xl border border-opacity-70 bg-gradient-to-br p-5 shadow-md transition-transform duration-300 hover:-translate-y-1 ${colorStyles[color]}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] opacity-80">{title}</p>
          <p className="mt-3 text-4xl font-semibold leading-none">{formattedValue}</p>
          {subtitle ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-current shadow-sm transition-all duration-300 group-hover:scale-[1.05]
          dark:bg-slate-900/80">
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
};

export const SummaryCardSkeleton = () => (
  <div className="h-full rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm animate-pulse dark:border-slate-700 dark:bg-slate-800/80" />
);
