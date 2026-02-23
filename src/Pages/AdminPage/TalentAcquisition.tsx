import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { Jobs } from "./Jobs";
import { Applicants } from "./Applicants";
import { Footer } from "../../Components/Footer";
import { Briefcase, Users } from "lucide-react";

// Define Tab Types
type TabType = "JOBS" | "APPLICANTS";

export const TalentAcquisition = () => {
  const [activeTab, setActiveTab] = useState<TabType>("JOBS");

  // Trigger system (similar to AttendanceHub)
  const [triggerAction, setTriggerAction] = useState<{
    tab: TabType;
    count: number;
  }>({ tab: "JOBS", count: 0 });

  const handleActionClick = (tab: TabType) => {
    setTriggerAction((prev) => ({
      tab,
      count: prev.tab === tab ? prev.count + 1 : 1,
    }));
  };

  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        {/* 1) Title Section */}
        <TableTitle
          tileName="Talent Acquisition"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {activeTab === "JOBS" && (
                <CustomButton
                  label="+ Jobs"
                  handleToggle={() => handleActionClick("JOBS")}
                />
              )}
              {activeTab === "APPLICANTS" && (
                <CustomButton
                  label="+ Applicants"
                  handleToggle={() => handleActionClick("APPLICANTS")}
                />
              )}
            </div>
          }
        />

        {/* 2) Tab Navigation */}
        <div className="flex items-center gap-1 px-2 sm:px-4  bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("JOBS")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
              activeTab === "JOBS"
                ? "bg-indigo-900 text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <Briefcase size={16} />
            <span>Jobs</span>
          </button>

          <button
            onClick={() => setActiveTab("APPLICANTS")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
              activeTab === "APPLICANTS"
                ? "bg-indigo-900 text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <Users size={16} />
            <span>Applicants</span>
          </button>
        </div>

        {/* 3) Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "JOBS" && (
            <Jobs
              triggerRecruit={
                triggerAction.tab === "JOBS" ? triggerAction.count : 0
              }
            />
          )}

          {activeTab === "APPLICANTS" && (
            <Applicants
              triggerRecruit={
                triggerAction.tab === "APPLICANTS" ? triggerAction.count : 0
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
