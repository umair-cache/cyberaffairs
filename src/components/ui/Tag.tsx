import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagProps {
  label: string;
  href?: string;
  variant?: "default" | "outline" | "solid";
  size?: "sm" | "md";
  color?: string;
  className?: string;
  onClick?: () => void;
}

const variants: Record<string, string> = {
  default:
    "bg-[#F5F3FF] text-[#4F46E5] border border-[#E5E7EB] hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5]",
  outline:
    "bg-transparent text-[#6B7280] border border-[#E5E7EB] hover:text-[#4F46E5] hover:border-[#4F46E5] hover:bg-[#F5F3FF]",
  solid:
    "text-white border border-transparent",
};

const sizes: Record<string, string> = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-[11px] px-2.5 py-1",
};

export default function Tag({
  label,
  href,
  variant = "default",
  size = "md",
  color,
  className,
  onClick,
}: TagProps) {
  const base = cn(
    "inline-flex items-center font-sans font-semibold tracking-wider uppercase rounded transition-all duration-150 cursor-pointer",
    variants[variant],
    sizes[size],
    className
  );

  const style =
    variant === "solid" && color ? { backgroundColor: color } : undefined;

  if (href) {
    return (
      <Link href={href} className={base} style={style}>
        {label}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={base}
        style={style}
      >
        {label}
      </button>
    );
  }

  return (
    <span className={base} style={style}>
      {label}
    </span>
  );
}