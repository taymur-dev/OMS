type TextareaFieldProps = {
  labelName: string;
  placeHolder?: string;
  handlerChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
  inputVal: string;
  disabled?: boolean;
  className?: string;
};

export const TextareaField = ({
  labelName,
  placeHolder,
  handlerChange,
  name,
  inputVal,
}: TextareaFieldProps) => {
  return (
    <div>
      <div className="flex flex-col">
        <label className="text-black text-xs font-semibold">
          {labelName}
        </label>
        <textarea
          className="rounded bg-white text-gray-800 border-1 border-indigo-900 px-2   rounded-lg"
          placeholder={placeHolder}
          onChange={handlerChange}
          name={name}
          value={inputVal}
        />
      </div>
    </div>
  );
};
