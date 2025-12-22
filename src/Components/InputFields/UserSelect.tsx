export type option = {
  id: number;
  name: string;
  value?: string;
  label?: string;
  loginStatus: string;
  projectName: string;
};

type OptionFieldProps = {
  labelName: string;
  handlerChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  value?: string;
  optionData: option[] | null;
  disabled?: boolean;
};

export const UserSelect = ({
  labelName,
  handlerChange,
  name,
  value,
  optionData,
}: OptionFieldProps) => {
  return (
    <div className=" flex flex-col  mt-3">
      <label className=" text-gray-900 text-xs font-semibold">
        {labelName}
      </label>
      <select
        value={value}
        onChange={handlerChange}
        name={name}
        className="p-1 rounded bg-white text-gray-800  border border-gray-300 focus:outline-indigo-500"
      >
        <option value={""}>Please Select User </option>

        {optionData?.map(
          (options, index) =>
            options.loginStatus === "Y" && (
              <option value={`${options.id}`} key={index}>
                {options.name}
              </option>
            )
        )}
      </select>
    </div>
  );
};
