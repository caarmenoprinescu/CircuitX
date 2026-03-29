import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  const baseStyles = "h-12 px-6 rounded-lg transition-colors";
  const variantStyles = {
    primary: "bg-[#E8003D] text-white hover:bg-[#c00034]",
    secondary: "border border-white text-white hover:bg-white hover:text-[#0A0A0F]",
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
