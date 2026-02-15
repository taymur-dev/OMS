import React from "react";
import { ClipLoader } from "react-spinners";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps<T = void> = {
  label: string;
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>, param?: T) => void;
  param?: T;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  className?: string;
};

export const LocalButton = <T,>({
  label,
  handleClick,
  param,
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
}: ButtonProps<T>) => {
  const isDisabled = loading || disabled;

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      disabled={isDisabled}
      onClick={(e) => handleClick && handleClick(e, param)}
      className={`px-4 py-2 rounded transition duration-300
        ${variantStyles[variant]}
        ${isDisabled ? "opacity-60 cursor-not-allowed hover:scale-100" : "hover:scale-105"}
        ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <span>{label}</span>
          <ClipLoader size={16} color="#ffffff" />
        </div>
      ) : (
        label
      )}
    </button>
  );
};
