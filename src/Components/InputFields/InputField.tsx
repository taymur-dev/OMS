import { ReactNode } from "react";

type InputFieldProps = {
  type?: string;
  labelName?: string;
  placeHolder?: string;
  handlerChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string | number;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  min?: string;
  icon?: ReactNode;
  minLength?: number;
  maxLength?: number;
};

export const InputField = ({
  type,
  labelName,
  placeHolder,
  handlerChange,
  onKeyDown,
  name,
  value,
  disabled,
  className,
  readOnly,
  icon,
  minLength,
  maxLength,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col">
      <label className="text-gray-600 text-xs font-semibold">{labelName}</label>

      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-black z-10">
            {icon}
          </div>
        )}

        <input
          type={type}
          className={`w-full p-2.5 ${icon ? "pl-10" : "pl-3"} border border-gray-200 rounded-lg shadow text-gray-800
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
            focus:outline-none focus:ring-1 focus:ring-blue-500
            ${type === "date" ? "relative" : ""}
            ${className || ""}`}
          placeholder={placeHolder}
          onChange={handlerChange}
          onKeyDown={onKeyDown}
          name={name}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          minLength={minLength}
          maxLength={maxLength}
        />
      </div>
    </div>
  );
};
