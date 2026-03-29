import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-[#888888] text-xs">{label}</label>}
      <select
        className={`h-12 px-4 rounded-lg bg-[#1A1A24] border border-[#2A2A35] text-white focus:border-[#E8003D] focus:outline-none transition-colors ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
