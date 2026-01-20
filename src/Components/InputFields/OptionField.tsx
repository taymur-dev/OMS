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
    <div className="flex flex-col mt-4">
      <label className="mb-1 text-gray-700 text-sm font-medium">
        {labelName}
      </label>
      <select
        value={value}
        onChange={handlerChange}
        name={name}
        className="
          p-2
          mb-2
          rounded
          bg-white
          text-gray-900
          border
          border-indigo-900
          focus:border-indigo-900
          focus:ring
          focus:ring-indigo-900
          focus:outline-none
          transition
          duration-200
          shadow-sm
          hover:border-gray-400
        "
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
