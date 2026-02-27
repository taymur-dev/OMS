import React from "react";
import { Search } from "lucide-react"; 

interface TableInputFieldProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string; // Add this line (the '?' makes it optional)
}

export const TableInputField: React.FC<TableInputFieldProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  placeholder = "Search..." // Set a default value here
}) => {
  return (
    <div className="flex justify-end w-full">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder} // Use the prop here
          className="block w-full pl-10 pr-4 py-3 text-sm text-gray-700 bg-white border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all duration-200"
        />
      </div>
    </div>
  );
};