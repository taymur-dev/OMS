import { ReactNode } from "react";

type buttonProps = {
  label: ReactNode;
  handleToggle: () => void;
  className?: string;
};

export const CustomButton = ({
  label,
  handleToggle,
  className = "",
}: buttonProps) => {
  return (
    <button
      onClick={handleToggle}
      className={`bg-indigo-900 text-white 
      px-2 py-1 sm:px-4 sm:py-1.5 
      text-[10px] sm:text-sm font-medium
      rounded-lg sm:rounded-xl shadow-md
      hover:opacity-95 active:scale-95 transition-all duration-300 ${className}`}
    >
      {label}
    </button>
  );
};
