import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import {
  FileText,
  TrendingUp,
  UserCheck,
  CreditCard,
  ClipboardList,
  Receipt,
} from "lucide-react";
import { Footer } from "../../Components/Footer";

import { SalesReports } from "./SalesReports";
import { ProgressReports } from "./ProgressReports";
import { AttendanceReports } from "./AttendanceReports";
import { PaymentsReports } from "./PaymentsReports";
import { ProcessReports } from "./ProcessReports";
import { ExpenseReports } from "./ExpenseReports";

type TabType =
  | "SALE_REPORT"
  | "PROGRESS_REPORT"
  | "PAYMENT_REPORT"
  | "TASK_REPORT"
  | "ATTENDANCE_REPORT"
  | "EXPENSE_REPORT";

export const Summary = () => {
  const [activeTab, setActiveTab] = useState<TabType>("SALE_REPORT");

  // Helper to reduce repetitive class logic
  const getTabClass = (tab: TabType) => {
    const isActive = activeTab === tab;
    return `flex items-center justify-center gap-2 
            flex-1 min-w-[120px] sm:min-w-[140px] lg:min-w-0 lg:flex-1
            px-2 sm:px-3 lg:px-6 py-2 sm:py-2.5 lg:py-3
            text-xs sm:text-sm lg:text-base font-semibold transition-all duration-200 
            rounded-md lg:rounded-t-lg lg:rounded-b-none
            whitespace-nowrap
            ${
              isActive
                ? "bg-indigo-900 text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`;
  };

  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        {/* Table Title */}
        <TableTitle tileName="Reports" />

        {/* Tab Navigation - Responsive Wrap */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap items-center gap-1 px-2 sm:px-4 bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("SALE_REPORT")}
            className={getTabClass("SALE_REPORT")}
          >
            <FileText size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            <span>Sale</span>
          </button>

          <button
            onClick={() => setActiveTab("PROGRESS_REPORT")}
            className={getTabClass("PROGRESS_REPORT")}
          >
            <TrendingUp size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            <span className="truncate">Progress</span>
          </button>

          <button
            onClick={() => setActiveTab("PAYMENT_REPORT")}
            className={getTabClass("PAYMENT_REPORT")}
          >
            <UserCheck size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            <span className="truncate">Payment</span>
          </button>

          <button
            onClick={() => setActiveTab("TASK_REPORT")}
            className={getTabClass("TASK_REPORT")}
          >
            <ClipboardList size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            <span className="truncate">Task</span>
          </button>

          <button
            onClick={() => setActiveTab("ATTENDANCE_REPORT")}
            className={getTabClass("ATTENDANCE_REPORT")}
          >
            <CreditCard size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            <span className="truncate">Attendance</span>
          </button>

          <button
            onClick={() => setActiveTab("EXPENSE_REPORT")}
            className={getTabClass("EXPENSE_REPORT")}
          >
            <Receipt size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            <span className="truncate">Expense</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-2 sm:p-3 lg:p-4 overflow-auto">
          {activeTab === "SALE_REPORT" && <SalesReports />}
          {activeTab === "PROGRESS_REPORT" && <ProgressReports />}
          {activeTab === "PAYMENT_REPORT" && <PaymentsReports />}
          {activeTab === "TASK_REPORT" && <ProcessReports />}
          {activeTab === "ATTENDANCE_REPORT" && <AttendanceReports />}
          {activeTab === "EXPENSE_REPORT" && <ExpenseReports />}
        </div>
      </div>

      <div className="mt-auto border-t-4 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
