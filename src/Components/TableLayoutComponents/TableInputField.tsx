import React from "react";

interface TableInputFieldProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export const TableInputField: React.FC<TableInputFieldProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-2">
      <span className="text-gray-900 font-sans">Search: </span>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="border placeholder-gray-500 border-gray-800 mt-1 p-[0.20rem] outline-none rounded "
      />
    </div>
  );
};
