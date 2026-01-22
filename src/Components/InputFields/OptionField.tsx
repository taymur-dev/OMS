type option = {
  id: number;
  label: string;
  value: string | number;
};

type OptionFieldProps = {
  labelName: string;
  handlerChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  value: string | number;
  optionData?: option[];
  inital?: string;
};

export const OptionField = ({
  labelName,
  handlerChange,
  name,
  value,
  optionData,
  inital,
}: OptionFieldProps) => {
  return (
    <div className="flex flex-col ">
      <label className="text-gray-700 text-sm font-medium">
        {labelName}
      </label>
      <select
        value={value}
        onChange={handlerChange}
        name={name}
        className="p-2 rounded bg-white text-gray-900 border rounded-lg border-indigo-900 
          transition duration-200 shadow-sm hover:border-gray-400"
      >
        <option value="">{inital}</option>
        {optionData?.map((options) => (
          <option value={options.value} key={options.id}>
            {options.label}
          </option>
        ))}
      </select>
    </div>
  );
};
