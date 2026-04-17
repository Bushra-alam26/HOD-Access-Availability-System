import React from "react";
import { XCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  className?: string;
  darkMode?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  multiline = false,
  className = "",
  darkMode = false,
}) => {
  const baseInputClasses = darkMode
    ? `rounded-3xl border bg-slate-950/70 px-4 py-3 text-white outline-none ring-1 ring-transparent transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 ${
        error ? "border-red-500 bg-red-950/20" : "border-white/10"
      }`
    : `w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary ${
        error ? "border-red-500 bg-red-50 dark:bg-red-950/20" : "border-input"
      }`;

  const labelClasses = darkMode
    ? "mb-1.5 block text-sm font-medium text-slate-300"
    : "mb-1.5 block text-sm font-medium text-foreground";

  const errorClasses = darkMode
    ? "mt-2 flex items-center gap-2 text-sm text-red-400"
    : "mt-1 flex items-center gap-2 text-xs text-red-600 dark:text-red-400";

  return (
    <div className={`grid gap-2 ${className}`}>
      <span className={labelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>

      {multiline ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${baseInputClasses} min-h-[120px] resize-none`}
          rows={4}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseInputClasses}
        />
      )}

      {error && (
        <p className={errorClasses}>
          <XCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};