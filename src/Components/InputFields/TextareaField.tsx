type TextareaFieldProps = {
  labelName: string;
  placeHolder?: string;
  handlerChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
  inputVal: string;
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
      <div className="flex flex-col mt-3">
        <label className="text-gray-900 text-xs font-semibold">
          {labelName}
        </label>
        <textarea
          className="p-1 rounded bg-white text-gray-800 border border-gray-300 focus:border-indigo-400"
          placeholder={placeHolder}
          onChange={handlerChange}
          name={name}
          value={inputVal}
        />
      </div>
    </div>
  );
};
