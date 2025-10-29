import React, { useEffect, useRef } from "react";
import BaseButton from "./BaseButton";
import { useSelector } from "react-redux";
import type { RootState } from "@/Redux/Store";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  title?: string;
  children?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showFooter?: boolean;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  //   componentSize?: ButtonSize | InputSize;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  size = "md",
  showFooter = true,
  submitText = "Submit",
  cancelText = "Cancel",
  loading = false,
  closeOnOverlayClick = true,
  closeOnEsc = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const componentSize = useSelector(
    (state: RootState) => state.settings.componentSize
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, closeOnEsc]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    xs: "max-w-sm",
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              type="button"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </div>
        )}

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6">{children}</div>

          {/* Footer */}
          {showFooter && (
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <BaseButton
                type="button"
                variant="secondary"
                size={componentSize}
                onClick={onClose}
                disabled={loading}
                className="cursor-pointer"
              >
                {cancelText}
              </BaseButton>
              <BaseButton
                type="submit"
                variant="primary"
                size={componentSize}
                loading={loading}
                disabled={loading}
                className="cursor-pointer"
              >
                {submitText}
              </BaseButton>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BaseModal;
