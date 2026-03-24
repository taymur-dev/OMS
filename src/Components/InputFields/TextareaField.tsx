type TextareaFieldProps = {
  labelName: string;
  placeHolder?: string;
  handlerChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
  inputVal: string;
  disabled?: boolean;
  className?: string;
  readOnly?: boolean;
  minLength: number;
  maxLength: number;
};

export const TextareaField = ({
  labelName,
  placeHolder,
  handlerChange,
  name,
  inputVal,
  readOnly,
  minLength,
  maxLength,
}: TextareaFieldProps) => {
  return (
    <div>
      <div className="flex flex-col">
        <label className="text-gray-600 text-xs font-semibold">
          {labelName}
        </label>
        <textarea
          className="rounded bg-white text-black shadow border-1 border-gray-200 px-2   rounded-lg"
          placeholder={placeHolder}
          onChange={handlerChange}
          name={name}
          value={inputVal}
          readOnly={readOnly}
          minLength={minLength}
          maxLength={maxLength}
        />
      </div>
    </div>
  );
};
