import React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

type SelectSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface BaseSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  size?: SelectSize;
  containerClassName?: string;
}

const SIZE_STYLES: Record<SelectSize, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-2.5 text-lg",
  xl: "px-6 py-3 text-xl",
};

const LABEL_SIZE_STYLES: Record<SelectSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

const BaseSelect: React.FC<BaseSelectProps> = ({
  label,
  options,
  error,
  helperText,
  fullWidth = true,
  size = "md",
  required = false,
  disabled = false,
  className = "",
  containerClassName = "",
  ...props
}) => {
  // Base select classes
  const selectClasses = `
    w-full rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${SIZE_STYLES[size]}
    ${
      error
        ? "border-red-500 focus:border-red-600 focus:ring-red-500"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
    }
    ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
    ${className}
  `.trim();

  return (
    <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
      {label && (
        <label
          className={`block font-medium text-gray-700 mb-1.5 ${LABEL_SIZE_STYLES[size]}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        className={selectClasses}
        disabled={disabled}
        required={required}
        {...props}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {(helperText || error) && (
        <p
          className={`mt-1.5 text-sm ${
            error ? "text-red-600" : "text-gray-500"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default BaseSelect;
