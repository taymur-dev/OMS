import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { Footer } from "../../Components/Footer";

import { ProgressReports } from "./ProgressReports";
import { AttendanceReports } from "./AttendanceReports";
import { ProcessReports } from "./ProcessReports";

type TabType = "ATTENDANCE_REPORT" | "PROGRESS_REPORT" | "TASK_REPORT";
const entriesOptions = [5, 10, 15, 20, 30];

export const UserReports = () => {
  // 1. Lifted states for UI synchronization
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState(10);
  const [activeTab, setActiveTab] = useState<TabType>("ATTENDANCE_REPORT");

  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        {/* 1. Main Title Section */}
        <TableTitle tileName="Reports" />

        {/* 2. Controls Section (Tabs, Search, and Entries) */}
        <div className="px-4 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          {/* Tab Navigation (Matching People.tsx Pill Style) */}
          <div className="flex w-full sm:w-auto p-1 bg-[#F1F5F9] rounded-xl border border-gray-200">
            {(
              [
                "ATTENDANCE_REPORT",
                "PROGRESS_REPORT",
                "TASK_REPORT",
              ] as TabType[]
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 text-sm font-bold transition-all duration-200 rounded-lg ${
                  activeTab === tab
                    ? "bg-white text-[#334155] shadow-sm"
                    : "text-[#64748B] hover:text-[#334155]"
                }`}
              >
                {tab.split("_")[0].charAt(0) +
                  tab.split("_")[0].slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search and Entries Controls */}
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

        {/* 3. Content Area - Props passed here fix the TS errors */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "ATTENDANCE_REPORT" && (
            <AttendanceReports
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
            />
          )}
          {activeTab === "PROGRESS_REPORT" && (
            <ProgressReports
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
            />
          )}
          {activeTab === "TASK_REPORT" && (
            <ProcessReports
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
            />
          )}
        </div>
      </div>

      <div className="mt-auto border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
