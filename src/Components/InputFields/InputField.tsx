type InputFieldProps = {
  type?: string;
  labelName?: string;
  placeHolder?: string;
  handlerChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string;
  disabled?: boolean;
  readOnly?: boolean;
};
export const InputField = ({
  type,
  labelName,
  placeHolder,
  handlerChange,
  name,
  value,
  disabled,
}: InputFieldProps) => {
  return (
    <div>
      <div className=" flex flex-col  mt-3">
        <label className=" text-gray-900 text-xs font-semibold">
          {labelName}
        </label>
        <input
          type={type}
          className={`p-1 rounded border border-gray-300 text-gray-800
    ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
    focus:indigo-400`}
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
