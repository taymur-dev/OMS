import { ReactNode } from "react";
import { UserPlusIcon } from "lucide-react"; // Solid version

type ButtonProps = {
  label: ReactNode;
  handleToggle: () => void;
  className?: string;
  showIcon?: boolean;
};

export const CustomButton = ({
  label,
  handleToggle,
  className = "",
  showIcon = true,
}: ButtonProps) => {
  return (
    <button
      onClick={handleToggle}
      className={`bg-blue-500 text-white 
      px-2 py-1 sm:px-4 sm:py-1.5 
      text-[10px] sm:text-sm font-medium
      rounded-lg sm:rounded-xl shadow-md
      hover:opacity-95 active:scale-95 transition-all duration-300 
      flex items-center gap-2 ${className}`}
    >
      {showIcon && (
        <UserPlusIcon
          size={16}
          className="sm:w-5 sm:h-5 fill-current"
        />
      )}
      <span>{label}</span>
    </button>
  );
};