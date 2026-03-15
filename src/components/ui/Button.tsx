import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  fullWidth?: boolean;
}

const variants: Record<string, string> = {
  primary:
    "bg-[#4F46E5] text-white border-transparent hover:bg-[#1E135C] shadow-sm hover:shadow-[0_0_24px_rgba(79,70,229,0.25)]",
  secondary:
    "bg-[#1E135C] text-white border-transparent hover:bg-[#0D0A2E]",
  outline:
    "bg-transparent text-[#4F46E5] border-[#4F46E5] hover:bg-[#4F46E5] hover:text-white",
  ghost:
    "bg-transparent text-[#6B7280] border-transparent hover:text-[#4F46E5] hover:bg-[#F5F3FF]",
};

const sizes: Record<string, string> = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2 gap-2",
  lg: "text-base px-6 py-3 gap-2.5",
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  external = false,
  disabled = false,
  type = "button",
  ariaLabel,
  fullWidth = false,
}: ButtonProps) {
  const base = cn(
    "inline-flex items-center justify-center font-sans font-semibold tracking-wide rounded-lg border transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={base}
        aria-label={ariaLabel}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={base}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}