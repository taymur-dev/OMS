import { useState } from "react";
import { EmployeeLifeline } from "./EmployeeLifeline";
import { EmployeeWithdraw } from "./EmployeeWithdraw";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { UserCheck, WalletCards } from "lucide-react";
import { Footer } from "../../Components/Footer";

type HRTab = "LIFELINE" | "WITHDRAW";

export const HumanResources = () => {
  const [activeTab, setActiveTab] = useState<HRTab>("LIFELINE");
  const [triggerModal, setTriggerModal] = useState<{
    tab: HRTab;
    count: number;
  }>({ tab: "LIFELINE", count: 0 });

  const handleAddClick = (tab: HRTab) => {
    setTriggerModal((prev) => ({
      tab,
      count: prev.tab === tab ? prev.count + 1 : 1,
    }));
  };

  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        {/* 1) Header - Matching AttendanceHub flex logic */}
        <TableTitle
          tileName="Human Resources"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {activeTab === "LIFELINE" && (
                <CustomButton
                  label="+ Employee"
                  handleToggle={() => handleAddClick("LIFELINE")}
                />
              )}
              
              {activeTab === "WITHDRAW" && (
                <CustomButton
                  label="+ Withdraw"
                  handleToggle={() => handleAddClick("WITHDRAW")}
                />
              )}
              
            </div>
          }
        />

        {/* 2) Tab Navigation - Optimized for Mobile Consistency */}
        <div className="flex items-center gap-1 px-2 sm:px-4  bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("LIFELINE")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
              activeTab === "LIFELINE"
                ? "bg-indigo-900 text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <UserCheck size={16} />
            <span className="hidden xs:block">Lifeline</span>
            <span className="block xs:hidden">Employee Lifeline</span>
          </button>

          <button
            onClick={() => setActiveTab("WITHDRAW")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
              activeTab === "WITHDRAW"
                ? "bg-indigo-900 text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <WalletCards size={16} />
            <span className="hidden xs:block">Withdraw</span>
            <span className="block xs:hidden">Employee Withdraw</span>
          </button>
        </div>

        {/* 3) Dynamic Content Area - Matching Padding */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "LIFELINE" ? (
            <EmployeeLifeline
              triggerAdd={
                triggerModal.tab === "LIFELINE" ? triggerModal.count : 0
              }
            />
          ) : (
            <EmployeeWithdraw
              triggerAdd={
                triggerModal.tab === "WITHDRAW" ? triggerModal.count : 0
              }
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
