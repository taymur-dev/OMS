import { ReactNode } from "react";

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
  disabled?: boolean;
  icon?: ReactNode;
};

export const OptionField = ({
  labelName,
  handlerChange,
  name,
  value,
  optionData,
  inital,
  icon,
}: OptionFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-600 text-xs font-semibold uppercase">{labelName}</label>

      {/* 1. Added relative wrapper */}
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-slate-500 z-10">
            {icon}
          </div>
        )}
        
        <select
          value={value}
          onChange={handlerChange}
          name={name}
          // 2. Added pl-10 for icon spacing and w-full for layout consistency
          className={`w-full p-3 ${icon ? "pl-10" : "pl-3"} rounded-lg bg-white text-gray-900 border border-gray-200 shadow 
            transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none`}
        >
          <option value="">{inital}</option>
          {optionData?.map((options) => (
            <option value={options.value} key={options.id}>
              {options.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 pointer-events-none">
           <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );
};
