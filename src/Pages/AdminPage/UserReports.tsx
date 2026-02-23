import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { TrendingUp, CreditCard, ClipboardList } from "lucide-react";
import { Footer } from "../../Components/Footer";

import { ProgressReports } from "./ProgressReports";
import { AttendanceReports } from "./AttendanceReports";
import { ProcessReports } from "./ProcessReports";

type TabType = "PROGRESS_REPORT" | "ATTENDANCE_REPORT" | "TASK_REPORT" | "";

export const UserReports = () => {
  const [activeTab, setActiveTab] = useState<TabType>("PROGRESS_REPORT");

  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        {/* Table Title */}
        <TableTitle tileName="Reports" />

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-2 sm:px-4  bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("PROGRESS_REPORT")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 
              py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                activeTab === "PROGRESS_REPORT"
                  ? "bg-indigo-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            <TrendingUp size={16} />
            <span>Progress</span>
          </button>

          <button
            onClick={() => setActiveTab("TASK_REPORT")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "TASK_REPORT"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <ClipboardList size={16} />
            <span>Task Reports</span>
          </button>

          <button
            onClick={() => setActiveTab("ATTENDANCE_REPORT")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5 
              text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                activeTab === "ATTENDANCE_REPORT"
                  ? "bg-indigo-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            <CreditCard size={16} />
            <span>Attendance</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "PROGRESS_REPORT" && <ProgressReports />}
          {activeTab === "TASK_REPORT" && <ProcessReports />}
          {activeTab === "ATTENDANCE_REPORT" && <AttendanceReports />}
        </div>
      </div>

      <div className="mt-auto border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
