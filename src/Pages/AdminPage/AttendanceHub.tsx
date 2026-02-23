import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { MarkAttendance } from "./MarkAttendance";
import { UserAttendance } from "./UserAttendance";
import { LeaveRequests } from "./LeaveRequests";
import { useAppSelector } from "../../redux/Hooks";
import { ClipboardCheck, Users, FileText } from "lucide-react";
import { Footer } from "../../Components/Footer";

type TabType = "MARK" | "USER" | "LEAVE" | "";

export const AttendanceHub = () => {
  const [activeTab, setActiveTab] = useState<TabType>("MARK");
  const { currentUser } = useAppSelector((state) => state.officeState);
  const isAdmin = currentUser?.role === "admin";

  const [triggerModal, setTriggerModal] = useState<{
    tab: TabType;
    count: number;
  }>({ tab: "MARK", count: 0 });

  const handleActionClick = (tab: TabType) => {
    setTriggerModal((prev) => ({
      tab,
      count: prev.tab === tab ? prev.count + 1 : 1,
    }));
  };

  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        <TableTitle
          tileName="Attendance"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {activeTab === "USER" && isAdmin && (
                <CustomButton
                  label="+ Attendance"
                  handleToggle={() => handleActionClick("USER")}
                />
              )}

              {activeTab === "LEAVE" && (
                <CustomButton
                  label="+ Leave"
                  handleToggle={() => handleActionClick("LEAVE")}
                />
              )}
            </div>
          }
        />

        {/* Responsive tabs - wrap on all screens except desktop (lg breakpoint) */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-1 px-2 sm:px-4  bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("MARK")}
            className={`flex items-center justify-center gap-2 flex-1 lg:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "MARK"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <ClipboardCheck size={16} className="sm:w-4 sm:h-4" />
            <span className="truncate">Mark</span>
            <span className="hidden sm:inline"> Attendance</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab("USER")}
              className={`flex items-center justify-center gap-2 flex-1 lg:flex-none px-2 sm:px-6
                 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                   activeTab === "USER"
                     ? "bg-indigo-900 text-white shadow-md"
                     : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                 }`}
            >
              <Users size={16} className="sm:w-4 sm:h-4" />
              <span className="truncate">User</span>
              <span className="hidden sm:inline"> Attendance</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("LEAVE")}
            className={`flex items-center justify-center gap-2 flex-1 lg:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "LEAVE"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <FileText size={16} className="sm:w-4 sm:h-4" />
            <span className="truncate">Leave</span>
            <span className="hidden sm:inline"> Requests</span>
          </button>
        </div>

        {/* 3) Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "MARK" && (
            <MarkAttendance
              triggerMark={triggerModal.tab === "MARK" ? triggerModal.count : 0}
            />
          )}

          {activeTab === "USER" && isAdmin && (
            <UserAttendance
              triggerAdd={triggerModal.tab === "USER" ? triggerModal.count : 0}
            />
          )}

          {activeTab === "LEAVE" && (
            <LeaveRequests
              triggerAdd={triggerModal.tab === "LEAVE" ? triggerModal.count : 0}
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