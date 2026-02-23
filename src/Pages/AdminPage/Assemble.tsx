import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { AttendanceRule } from "./AttendanceRule";
import { Holidays } from "./Holidays";
import { useAppSelector } from "../../redux/Hooks";
import { CalendarCheck, CalendarDays } from "lucide-react";
import { Footer } from "../../Components/Footer";

// Define Tab Types
type TabType = "ATTENDANCE_RULES" | "CONFIGURE_HOLIDAYS";

export const Assemble = () => {
  const [activeTab, setActiveTab] = useState<TabType>("ATTENDANCE_RULES");
  const { currentUser } = useAppSelector((state) => state.officeState);
  const isAdmin = currentUser?.role === "admin";

  // Trigger state for Add buttons (if needed)
  const [triggerModal, setTriggerModal] = useState<{
    tab: TabType;
    count: number;
  }>({ tab: "ATTENDANCE_RULES", count: 0 });

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
          tileName="Configuration"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {isAdmin && activeTab === "CONFIGURE_HOLIDAYS" && (
                <CustomButton
                  label="+ Holiday"
                  handleToggle={() => handleActionClick("CONFIGURE_HOLIDAYS")}
                />
              )}
            </div>
          }
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-2 sm:px-4  bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("ATTENDANCE_RULES")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "ATTENDANCE_RULES"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <CalendarCheck size={16} />
            <span>Attendance Rules</span>
          </button>

          <button
            onClick={() => setActiveTab("CONFIGURE_HOLIDAYS")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "CONFIGURE_HOLIDAYS"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <CalendarDays size={16} />
            <span>Configure Holidays</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "ATTENDANCE_RULES" && (
            <AttendanceRule
              triggerModal={
                triggerModal.tab === "ATTENDANCE_RULES" ? triggerModal.count : 0
              }
            />
          )}
          {activeTab === "CONFIGURE_HOLIDAYS" && (
            <Holidays
              triggerModal={
                triggerModal.tab === "CONFIGURE_HOLIDAYS"
                  ? triggerModal.count
                  : 0
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
