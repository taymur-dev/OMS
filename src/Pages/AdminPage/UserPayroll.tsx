import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";

import { OverTime } from "./OverTime";
import { AdvanceSalary } from "./AdvanceSalary";
import { Loan } from "./Loan";

import { useAppSelector } from "../../redux/Hooks";
import { Footer } from "../../Components/Footer";

// Define Tab Types
type TabType = "OVERTIME" | "ADVANCE_SALARY" | "LOAN_MANAGEMENT";
const entriesOptions = [5, 10, 15, 20, 30];

export const UserPayroll = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const isAdmin = currentUser?.role === "admin";

  // Lifted states to keep the header synced with the table
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState(10);
  const [activeTab, setActiveTab] = useState<TabType>("OVERTIME");

  // Trigger state for Add buttons
  const [triggerModal, setTriggerModal] = useState<{
    tab: TabType;
    count: number;
  }>({ tab: "OVERTIME", count: 0 });

  const handleActionClick = (tab: TabType) => {
    setTriggerModal((prev) => ({
      tab,
      count: prev.tab === tab ? prev.count + 1 : 1,
    }));
  };

  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        {/* 1. Main Title Section */}
        <TableTitle
          tileName="Payroll"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {!isAdmin && activeTab === "OVERTIME" && (
                <CustomButton
                  label="Add Overtime"
                  handleToggle={() => handleActionClick("OVERTIME")}
                />
              )}

              {activeTab === "ADVANCE_SALARY" && (
                <CustomButton
                  label="Add Advance"
                  handleToggle={() => handleActionClick("ADVANCE_SALARY")}
                />
              )}

              {activeTab === "LOAN_MANAGEMENT" && (
                <CustomButton
                  label="Add Loan"
                  handleToggle={() => handleActionClick("LOAN_MANAGEMENT")}
                />
              )}
            </div>
          }
        />

        {/* 2. Controls Section (Tabs, Search, Page Size) */}
        <div className="px-4 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex w-full sm:w-auto p-1 bg-[#F1F5F9] rounded-xl border border-gray-200">
            {(
              ["OVERTIME", "ADVANCE_SALARY", "LOAN_MANAGEMENT"] as TabType[]
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
                {tab === "OVERTIME" && "Overtime"}
                {tab === "ADVANCE_SALARY" && "Advance"}
                {tab === "LOAN_MANAGEMENT" && "Loan"}
              </button>
            ))}
          </div>

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
          {activeTab === "OVERTIME" && (
            <OverTime
              triggerModal={
                triggerModal.tab === "OVERTIME" ? triggerModal.count : 0
              }
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
            />
          )}

          {activeTab === "ADVANCE_SALARY" && (
            <AdvanceSalary
              triggerModal={
                triggerModal.tab === "ADVANCE_SALARY" ? triggerModal.count : 0
              }
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
            />
          )}

          {activeTab === "LOAN_MANAGEMENT" && (
            <Loan
              triggerModal={
                triggerModal.tab === "LOAN_MANAGEMENT" ? triggerModal.count : 0
              }
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
