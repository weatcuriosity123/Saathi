import { cn } from "@/utils/cn";

export default function ProgressBar({ value = 0, className }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-2 w-full rounded-full bg-slate-200", className)}>
      <div
        className="h-2 rounded-full bg-primary transition-all"
        style={{ width: `${safeValue}%` }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
        role="progressbar"
      />
    </div>
  );
}
