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
        className="bg-white text-indigo-900 py-1 px-2 rounded hover:cursor-pointer hover:scale-105 duration-300"
        onClick={(e) => handleClick && handleClick(e, param)}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <span>{label}</span>
            {loading && <ClipLoader size={18} color="#120988" />}
          </div>
        ) : (
          label
        )}
      </button>
    </div>
  );
};
