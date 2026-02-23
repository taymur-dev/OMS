import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { OverTime } from "./OverTime";
import { AdvanceSalary } from "./AdvanceSalary";
import { Loan } from "./Loan";
import { useAppSelector } from "../../redux/Hooks";
import { ArrowUpCircle, LogOut, RotateCcw } from "lucide-react";
import { Footer } from "../../Components/Footer";

// Define Tab Types
type TabType = "OVERTIME" | "ADVANCE_SALARY" | "LOAN_MANAGEMENT";

export const UserPayroll = () => {
  const [activeTab, setActiveTab] = useState<TabType>("OVERTIME");
  const { currentUser } = useAppSelector((state) => state.officeState);
  const isAdmin = currentUser?.role === "admin";

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
        {/* Table Title with Add buttons */}
        <TableTitle
          tileName="Payroll"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {!isAdmin && activeTab === "OVERTIME" && (
                <CustomButton
                  label="+ Overtime"
                  handleToggle={() => handleActionClick("OVERTIME")}
                />
              )}

              {activeTab === "ADVANCE_SALARY" && (
                <CustomButton
                  label="+ Advance"
                  handleToggle={() => handleActionClick("ADVANCE_SALARY")}
                />
              )}

              {activeTab === "LOAN_MANAGEMENT" && (
                <CustomButton
                  label="+ Loan"
                  handleToggle={() => handleActionClick("LOAN_MANAGEMENT")}
                />
              )}
            </div>
          }
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-2 sm:px-4  bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("OVERTIME")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
              text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                activeTab === "OVERTIME"
                  ? "bg-indigo-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            <ArrowUpCircle size={16} />
            <span>Overtime</span>
          </button>

          <button
            onClick={() => setActiveTab("ADVANCE_SALARY")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
              text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                activeTab === "ADVANCE_SALARY"
                  ? "bg-indigo-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            <LogOut size={16} />
            <span>Advance</span>
          </button>

          <button
            onClick={() => setActiveTab("LOAN_MANAGEMENT")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
              text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                activeTab === "LOAN_MANAGEMENT"
                  ? "bg-indigo-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            <RotateCcw size={16} />
            <span>Loan</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "OVERTIME" && (
            <OverTime
              triggerModal={
                triggerModal.tab === "OVERTIME" ? triggerModal.count : 0
              }
            />
          )}

          {activeTab === "ADVANCE_SALARY" && (
            <AdvanceSalary
              triggerModal={
                triggerModal.tab === "ADVANCE_SALARY" ? triggerModal.count : 0
              }
            />
          )}

          {activeTab === "LOAN_MANAGEMENT" && (
            <Loan
              triggerModal={
                triggerModal.tab === "LOAN_MANAGEMENT" ? triggerModal.count : 0
              }
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
