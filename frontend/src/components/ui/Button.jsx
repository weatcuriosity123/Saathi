import { cn } from "@/utils/cn";

const variants = {
  primary: "bg-primary text-white hover:bg-indigo-700 focus-visible:ring-primary",
  secondary:
    "bg-secondary text-white hover:bg-emerald-700 focus-visible:ring-secondary",
  accent: "bg-accent text-white hover:bg-orange-600 focus-visible:ring-accent",
};

export default function Button({
  children,
  variant = "primary",
  className,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant] || variants.primary,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
