import React, { useState, useMemo, memo, forwardRef } from "react";

type InputVariant = "default" | "success" | "error" | "warning";
type InputSize = "xs" | "sm" | "md" | "lg" | "xl";

interface BaseInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  helperText?: string;
  error?: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  showPasswordToggle?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  multiline?: boolean; // 🆕 key to render textarea instead of input
  rows?: number; // optional, for textarea rows
}

const VARIANT_STYLES: Record<InputVariant, string> = {
  default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
  success: "border-green-500 focus:border-green-600 focus:ring-green-500",
  error: "border-red-500 focus:border-red-600 focus:ring-red-500",
  warning: "border-yellow-500 focus:border-yellow-600 focus:ring-yellow-500",
};

const SIZE_STYLES: Record<InputSize, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-2.5 text-lg",
  xl: "px-6 py-3 text-xl",
};

const LABEL_SIZE_STYLES: Record<InputSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

const BASE_INPUT_STYLES =
  "w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed";

const Spinner = memo(() => (
  <svg
    className="animate-spin h-4 w-4 text-gray-400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
));

Spinner.displayName = "Spinner";

const EyeIcon = memo<{ isVisible: boolean }>(({ isVisible }) =>
  isVisible ? (
    <svg
      className="w-5 h-5 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ) : (
    <svg
      className="w-5 h-5 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  )
);

EyeIcon.displayName = "EyeIcon";

const ClearIcon = memo(() => (
  <svg
    className="w-4 h-4 text-gray-400 hover:text-gray-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
));

ClearIcon.displayName = "ClearIcon";

const BaseInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  BaseInputProps
>(
  (
    {
      variant = "default",
      size = "md",
      label,
      helperText,
      error,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = true,
      showPasswordToggle = false,
      clearable = false,
      onClear,
      multiline = false, // 🆕
      rows = 4, // 🆕
      className = "",
      type = "text",
      disabled = false,
      value,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const actualVariant = error ? "error" : variant;

    const inputClassName = useMemo(() => {
      const paddingLeft = leftIcon ? "pl-10" : "";
      const paddingRight =
        loading ||
        rightIcon ||
        (showPasswordToggle && type === "password") ||
        clearable
          ? "pr-10"
          : "";

      return [
        BASE_INPUT_STYLES,
        VARIANT_STYLES[actualVariant],
        SIZE_STYLES[size],
        paddingLeft,
        paddingRight,
        className,
        multiline ? "resize-none" : "", // 🆕 prevent resizing if multiline
      ]
        .filter(Boolean)
        .join(" ");
    }, [
      actualVariant,
      size,
      leftIcon,
      loading,
      rightIcon,
      showPasswordToggle,
      type,
      clearable,
      className,
      multiline,
    ]);

    const handlePasswordToggle = () => {
      setShowPassword(!showPassword);
    };

    const handleClear = () => {
      onClear?.();
    };

    const showClearButton = clearable && value && !loading && !disabled;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            className={`block font-medium text-gray-700 mb-1.5 ${LABEL_SIZE_STYLES[size]}`}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* 🆕 Conditional Rendering for Input or Textarea */}
          {multiline ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              rows={rows}
              className={inputClassName}
              disabled={disabled || loading}
              value={value}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              type={type === "password" && showPassword ? "text" : type}
              className={inputClassName}
              disabled={disabled || loading}
              value={value}
              {...props}
            />
          )}

          {/* Right Icons */}
          {!multiline && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {loading && <Spinner />}

              {!loading && showClearButton && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="hover:bg-gray-100 rounded p-0.5 transition-colors"
                  tabIndex={-1}
                >
                  <ClearIcon />
                </button>
              )}

              {!loading && type === "password" && showPasswordToggle && (
                <button
                  type="button"
                  onClick={handlePasswordToggle}
                  className="hover:bg-gray-100 rounded p-0.5 transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon isVisible={showPassword} />
                </button>
              )}

              {!loading && rightIcon && !showClearButton && (
                <span>{rightIcon}</span>
              )}
            </div>
          )}
        </div>

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
  }
);

BaseInput.displayName = "BaseInput";

export default memo(BaseInput);
