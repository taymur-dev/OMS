import React from "react";
import { ClipLoader } from "react-spinners";

type ButtonProps<T = void> = {
  label: string;
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>, param?: T) => void;
  param?: T;
  loading?: boolean;
  disabled?: boolean;
};

export const AddButton = <T,>({
  label,
  handleClick,
  param,
  loading,
}: ButtonProps<T>) => {
  return (
    <div>
      <button
        disabled={loading}
        className="bg-blue-500 text-white py-1 px-4 rounded-lg duration-300 
               hover:cursor-pointer hover:scale-105 active:scale-95
               shadow-lg shadow-gray-400 hover:shadow-xl hover:shadow-gray-400
               disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        onClick={(e) => handleClick && handleClick(e, param)}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <span>{label}</span>
            {loading && <ClipLoader size={18} color="#3b82f6" />}
          </div>
        ) : (
          label
        )}
      </button>
    </div>
  );
};
