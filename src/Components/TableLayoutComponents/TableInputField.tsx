import React from "react";

interface TableInputFieldProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export const TableInputField: React.FC<TableInputFieldProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex justify-end"> 
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search records..."
        className="border placeholder-gray-500 pl-3 pr-2 rounded-xl border-gray-400 mt-1 p-[0.25rem] outline-none text-sm w-40 sm:w-64 focus:border-indigo-900 transition-all"
      />
    </div>
  );
};