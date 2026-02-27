import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { AssignProjects } from "../AdminPage/AssignProjects";
import { Footer } from "../../Components/Footer";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";

const entriesOptions = [5, 10, 15, 20, 30];

export const UserAssignedProjects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState(10);

  // Keep triggerModal as is if required by AssignProjects props
  const [triggerModal] = useState({ tab: "ASSIGN", count: 0 });

  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        {/* 1. Main Title Section */}
        <TableTitle tileName="Assigned Projects" />

        {/* 2. Controls Section (Search and Pagination) */}
        <div className="px-4 py-4 border-b border-gray-100 flex flex-wrap items-center justify-end gap-4">
          {/* Search and Entries Selector */}
          <div className="flex items-center flex-grow justify-end gap-3 max-w-2xl">
            <div className="flex-grow">
              <TableInputField
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>

            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-3 bg-white shadow-sm min-w-[140px]">
              <select
                value={selectedValue}
                onChange={(e) => setSelectedValue(Number(e.target.value))}
                className="bg-transparent outline-none text-sm font-medium text-gray-700 cursor-pointer w-full"
              >
                {entriesOptions.map((num) => (
                  <option key={num} value={num}>
                    {num} per page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3. Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          <AssignProjects
            triggerModal={triggerModal.count}
            externalSearch={searchTerm}
            externalPageSize={selectedValue}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
