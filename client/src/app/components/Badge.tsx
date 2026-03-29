interface BadgeProps {
  children: React.ReactNode;
  variant?: "red" | "green" | "grey" | "muted";
}

export function Badge({ children, variant = "red" }: BadgeProps) {
  const variantStyles = {
    red: "bg-[#E8003D]/15 text-[#E8003D]",
    green: "bg-green-500/15 text-green-500",
    grey: "bg-gray-500/15 text-gray-500",
    muted: "bg-[#888888]/15 text-[#888888]",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
