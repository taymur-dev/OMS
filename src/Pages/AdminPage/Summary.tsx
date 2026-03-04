import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { Footer } from "../../Components/Footer";

import { SalesReports } from "./SalesReports";
import { ProgressReports } from "./ProgressReports";
import { AttendanceReports } from "./AttendanceReports";
// import { PaymentsReports } from "./PaymentsReports";
import { ProcessReports } from "./ProcessReports";
import { ExpenseReports } from "./ExpenseReports";

type TabType =
  | "SALE_REPORT"
  | "PROGRESS_REPORT"
  // | "PAYMENT_REPORT"
  | "TASK_REPORT"
  | "ATTENDANCE_REPORT"
  | "EXPENSE_REPORT";

const entriesOptions = [5, 10, 15, 20, 30];

export const Summary = () => {
  const [activeTab, setActiveTab] = useState<TabType>("SALE_REPORT");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState(10);

  const tabs: { id: TabType; label: string }[] = [
    { id: "SALE_REPORT", label: "Sale" },
    { id: "PROGRESS_REPORT", label: "Progress" },
    // { id: "PAYMENT_REPORT", label: "Payment" },
    { id: "TASK_REPORT", label: "Task" },
    { id: "ATTENDANCE_REPORT", label: "Attendance" },
    { id: "EXPENSE_REPORT", label: "Expense" },
  ];

  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        <TableTitle tileName="Reports" />

        <div className="px-4 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap w-full lg:w-auto p-1 bg-[#F1F5F9] rounded-xl border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 sm:px-5 py-2 text-[12px] sm:text-sm font-bold transition-all duration-200 rounded-lg text-center ${
                  activeTab === tab.id
                    ? "bg-white text-[#334155] shadow-sm"
                    : "text-[#64748B] hover:text-[#334155]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Search and Entries Select */}
          <div className="flex items-center flex-grow justify-end gap-3 max-w-2xl">
            <div className="flex-grow">
              <TableInputField
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>

            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-3 bg-white shadow-sm min-w-[110px]">
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
          {activeTab === "SALE_REPORT" && (
            <SalesReports
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
          {/* {activeTab === "PAYMENT_REPORT" && (
            <PaymentsReports
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
            />
          )} */}
          {activeTab === "TASK_REPORT" && (
            <ProcessReports
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
            />
          )}
          {activeTab === "ATTENDANCE_REPORT" && (
            <AttendanceReports
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
            />
          )}
          {activeTab === "EXPENSE_REPORT" && (
            <ExpenseReports
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
            />
          )}
        </div>
      </div>

      <div className="mt-auto border-t-4 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
