import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  default:
    "bg-[#F5F3FF] text-[#4F46E5] border-[#E5E7EB]",
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning:
    "bg-amber-50 text-amber-700 border-amber-200",
  danger:
    "bg-red-50 text-red-700 border-red-200",
  info:
    "bg-sky-50 text-sky-700 border-sky-200",
  outline:
    "bg-transparent text-[#6B7280] border-[#E5E7EB]",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[#4F46E5]",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger:  "bg-red-500",
  info:    "bg-sky-500",
  outline: "bg-[#9CA3AF]",
};

export default function Badge({
  children,
  variant = "default",
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "inline-block w-1.5 h-1.5 rounded-full flex-shrink-0",
            dotColors[variant]
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}