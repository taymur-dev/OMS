type InputFieldProps = {
  type?: string;
  labelName?: string;
  placeHolder?: string;
  handlerChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
};

export const InputField = ({
  type,
  labelName,
  placeHolder,
  handlerChange,
  name,
  value,
  disabled,
  className,
}: InputFieldProps) => {
  return (
    <div>
      <div className="flex flex-col">
        <label className="text-black text-xs font-semibold">
          {labelName}
        </label>
        <input
          type={type}
          // Added w-full here 👇
          className={`w-full p-2 rounded border-1 border-indigo-900 rounded-lg text-gray-800
    ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
    focus:ring-2 focus:ring-indigo-900 focus:outline-none
    ${className || ""}`}
          placeholder={placeHolder}
          onChange={handlerChange}
          name={name}
          value={value}
          disabled={disabled}
        />
      </div>
    </div>
  );
};