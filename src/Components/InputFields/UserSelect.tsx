import React from "react";

export type SelectOption = {
  value: number | string;
  label: string;
  active?: boolean; 
};

type OptionFieldProps = {
  labelName: string;
  handlerChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  value?: string;
  optionData: SelectOption[] | null;
  disabled?: boolean;
};

export const UserSelect = ({
  labelName,
  handlerChange,
  name,
  value,
  optionData,
  disabled,
}: OptionFieldProps) => {
  return (
    <div className="flex flex-col mt-3">
      <label className="text-gray-900 text-xs font-semibold">{labelName}</label>
      <select
        value={value}
        onChange={handlerChange}
        name={name}
        disabled={disabled}
        className="p-1 rounded bg-white text-gray-800 border border-gray-300 focus:outline-indigo-900"
      >
        <option value="">Please Select User</option>
        {optionData?.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
