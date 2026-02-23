import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { useAppSelector } from "../../redux/Hooks";
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  CreditCard,
  Settings,
} from "lucide-react";
import { Footer } from "../../Components/Footer";

// Import your tab components
import { Calendar } from "./Calendar";
import { SalaryCycle } from "./SalaryCycle";
import { OverTime } from "./OverTime";
import { AdvanceSalary } from "./AdvanceSalary";
import { Loan } from "./Loan";
import { ConfigEmpSalary } from "./ConfigEmpSalary"; // Check path

type TabType =
  | "CALENDAR"
  | "SALARY_CYCLE"
  | "OVERTIME"
  | "ADVANCE_SALARY"
  | "LOAN_MANAGEMENT"
  | "CONFIG_SALARIES";

export const Wages = () => {
  const [activeTab, setActiveTab] = useState<TabType>("CALENDAR");
  const { currentUser } = useAppSelector((state) => state.officeState);
  const isAdmin = currentUser?.role === "admin";

  const [triggerModal, setTriggerModal] = useState<{
    tab: TabType;
    count: number;
  }>({
    tab: "CALENDAR",
    count: 0,
  });

  const handleActionClick = (tab: TabType) => {
    setTriggerModal((prev) => ({
      tab,
      count: prev.tab === tab ? prev.count + 1 : 1,
    }));
  };

  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        {/* Table Title */}
        <TableTitle
          tileName="Payroll"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {isAdmin && activeTab === "CALENDAR" && (
                <CustomButton
                  label="+ Calendar"
                  handleToggle={() => handleActionClick("CALENDAR")}
                />
              )}
              {isAdmin && activeTab === "SALARY_CYCLE" && (
                <CustomButton
                  label="+ Salary Cycle"
                  handleToggle={() => handleActionClick("SALARY_CYCLE")}
                />
              )}
              {isAdmin && activeTab === "OVERTIME" && (
                <CustomButton
                  label="+ Overtime"
                  handleToggle={() => handleActionClick("OVERTIME")}
                />
              )}
              {isAdmin && activeTab === "ADVANCE_SALARY" && (
                <CustomButton
                  label="+ Advance Salary"
                  handleToggle={() => handleActionClick("ADVANCE_SALARY")}
                />
              )}
              {isAdmin && activeTab === "LOAN_MANAGEMENT" && (
                <CustomButton
                  label="+ Loan"
                  handleToggle={() => handleActionClick("LOAN_MANAGEMENT")}
                />
              )}
              {isAdmin && activeTab === "CONFIG_SALARIES" && (
                <CustomButton
                  label="+ Salaries"
                  handleToggle={() => handleActionClick("CONFIG_SALARIES")}
                />
              )}
            </div>
          }
        />

        {/* RESPONSIVE TAB NAVIGATION */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap items-center gap-1 px-2 sm:px-4 bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("CALENDAR")}
            className={`flex items-center justify-center gap-2 px-2 sm:px-4 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "CALENDAR"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               } lg:flex-1`}
          >
            <CalendarIcon size={16} />
            <span className="truncate">Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab("SALARY_CYCLE")}
            className={`flex items-center justify-center gap-2 px-2 sm:px-4 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "SALARY_CYCLE"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               } lg:flex-1`}
          >
            <Clock size={16} />
            <span className="truncate">Cycle</span>
          </button>

          <button
            onClick={() => setActiveTab("OVERTIME")}
            className={`flex items-center justify-center gap-2 px-2 sm:px-4 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "OVERTIME"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               } lg:flex-1`}
          >
            <Clock size={16} />
            <span className="truncate">Overtime</span>
          </button>

          <button
            onClick={() => setActiveTab("ADVANCE_SALARY")}
            className={`flex items-center justify-center gap-2 px-2 sm:px-4 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "ADVANCE_SALARY"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               } lg:flex-1`}
          >
            <DollarSign size={16} />
            <span className="truncate">Advance</span>
          </button>

          <button
            onClick={() => setActiveTab("LOAN_MANAGEMENT")}
            className={`flex items-center justify-center gap-2 px-2 sm:px-4 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "LOAN_MANAGEMENT"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               } lg:flex-1`}
          >
            <CreditCard size={16} />
            <span className="truncate">Loan</span>
          </button>

          <button
            onClick={() => setActiveTab("CONFIG_SALARIES")}
            className={`flex items-center justify-center gap-2 px-2 sm:px-2 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "CONFIG_SALARIES"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               } lg:flex-1`}
          >
            <Settings size={16} />
            <span className="truncate">Salary</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "CALENDAR" && (
            <Calendar
              triggerModal={
                triggerModal.tab === "CALENDAR" ? triggerModal.count : 0
              }
            />
          )}
          {activeTab === "SALARY_CYCLE" && (
            <SalaryCycle
              triggerModal={
                triggerModal.tab === "SALARY_CYCLE" ? triggerModal.count : 0
              }
            />
          )}
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
          {activeTab === "CONFIG_SALARIES" && (
            <ConfigEmpSalary
              triggerModal={
                triggerModal.tab === "CONFIG_SALARIES" ? triggerModal.count : 0
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