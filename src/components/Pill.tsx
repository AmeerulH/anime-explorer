import type { ReactNode } from "react";

interface PillProps {
  children: ReactNode;
  size?: "sm" | "xs";
  roundedFull?: boolean;
  className?: string;
}

const Pill = ({
  children,
  size = "sm",
  roundedFull = false,
  className = "",
}: PillProps) => {
  const sizeClass = size === "xs" ? "px-3 py-1 text-xs" : "px-2 py-1 text-sm";
  const radiusClass = roundedFull ? "rounded-full" : "rounded";

  return (
    <span
      className={`inline-flex items-center bg-slate-100 font-medium text-slate-800 ${sizeClass} ${radiusClass} ${className}`}
    >
      {children}
    </span>
  );
};

export default Pill;

