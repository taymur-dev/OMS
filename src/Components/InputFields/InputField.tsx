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
  readOnly
}: InputFieldProps) => {
  return (
    <div>
      <div className="flex flex-col">
        <label className="text-black text-xs font-semibold">
          {labelName}
        </label>
        <input
          type={type}
          className={`w-full p-2.5 border-1 border-indigo-900 rounded-lg text-gray-800
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
            focus:ring-2 focus:ring-indigo-900 focus:outline-none
            ${className || ""}`}
          placeholder={placeHolder}
          onChange={handlerChange}
          onKeyDown={onKeyDown} 
          name={name}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};