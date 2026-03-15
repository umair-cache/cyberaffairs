import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  narrow?: boolean;   // content-max (750px) — for article bodies
  wide?: boolean;     // full bleed with only minimal padding
}

export default function Container({
  children,
  className,
  as: Tag = "div",
  narrow = false,
  wide = false,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        !narrow && !wide && "max-w-[1280px]",
        narrow && "max-w-[750px]",
        wide && "max-w-full",
        className
      )}
    >
      {children}
    </Tag>
  );
}