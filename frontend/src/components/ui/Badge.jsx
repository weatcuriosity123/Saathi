import { cn } from "@/utils/cn";

const toneClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
};

export default function Badge({ children, tone = "primary", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone] || toneClasses.primary,
        className
      )}
    >
      {children}
    </span>
  );
}
