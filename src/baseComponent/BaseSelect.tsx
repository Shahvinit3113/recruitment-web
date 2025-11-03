import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

type DropdownSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface DropdownMenuProps {
  label?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  size?: DropdownSize;
  containerClassName?: string;
  loading?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
}

const SIZE_STYLES: Record<DropdownSize, string> = {
  xs: "px-3 py-1.5 text-xs h-8",
  sm: "px-3 py-2 text-sm h-9",
  md: "px-4 py-2.5 text-base h-11",
  lg: "px-5 py-3 text-lg h-12",
  xl: "px-6 py-3.5 text-xl h-14",
};

const LABEL_SIZE_STYLES: Record<DropdownSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

const OPTION_SIZE_STYLES: Record<DropdownSize, string> = {
  xs: "px-3 py-1.5 text-xs",
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-5 py-3 text-lg",
  xl: "px-6 py-3.5 text-xl",
};

const BaseSelect: React.FC<DropdownMenuProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  fullWidth = true,
  size = "md",
  required = false,
  disabled = false,
  loading = false,
  placeholder = "Select an option",
  searchable = false,
  containerClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const isDisabled = disabled || loading;

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current && isOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const toggleDropdown = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
    }
  };

  const buttonClasses = `
    w-full rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    flex items-center justify-between
    ${SIZE_STYLES[size]}
    ${
      error
        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
        : isOpen
        ? "border-blue-500 ring-2 ring-blue-500/20"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-400"
    }
    ${
      isDisabled
        ? "bg-gray-50 cursor-not-allowed text-gray-400"
        : "bg-white text-gray-900 cursor-pointer"
    }
  `.trim();

  const dropdownMenu = isOpen && (
    <div
      ref={dropdownRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-hidden"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        zIndex: 9999,
      }}
    >
      {searchable && (
        <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
          <input
            type="text"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <div className="overflow-y-auto max-h-56">
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No options found
          </div>
        ) : (
          filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`
                w-full text-left transition-colors duration-150
                flex items-center gap-3
                ${OPTION_SIZE_STYLES[size]}
                ${
                  option.value === value
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }
              `}
              onClick={() => handleSelect(option.value)}
            >
              {option.icon && (
                <span className="flex-shrink-0">{option.icon}</span>
              )}
              <div className="flex-1 min-w-0">
                <div className="truncate">{option.label}</div>
                {option.description && (
                  <div className="text-xs text-gray-500 truncate mt-0.5">
                    {option.description}
                  </div>
                )}
              </div>
              {option.value === value && (
                <svg
                  className="h-5 w-5 text-blue-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
      {label && (
        <label
          className={`block font-medium text-gray-700 mb-2 ${LABEL_SIZE_STYLES[size]}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          className={buttonClasses}
          onClick={toggleDropdown}
          disabled={isDisabled}
        >
          <span className="flex items-center gap-2 truncate">
            {loading ? (
              <>
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-gray-400">Loading...</span>
              </>
            ) : selectedOption ? (
              <>
                {selectedOption.icon && <span>{selectedOption.icon}</span>}
                <span className="truncate">{selectedOption.label}</span>
              </>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </span>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {typeof document !== "undefined" &&
          createPortal(dropdownMenu, document.body)}
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
};

export default BaseSelect;
