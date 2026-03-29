import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-[#888888] text-xs">{label}</label>}
      <input
        className={`h-12 px-4 rounded-lg bg-[#1A1A24] border border-[#2A2A35] text-white focus:border-[#E8003D] focus:outline-none transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}
