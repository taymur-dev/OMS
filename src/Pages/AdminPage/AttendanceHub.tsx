import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { MarkAttendance } from "./MarkAttendance";
import { UserAttendance } from "./UserAttendance";
import { LeaveRequests } from "./LeaveRequests";
import { useAppSelector } from "../../redux/Hooks";
import { Footer } from "../../Components/Footer";

type TabType = "MARK" | "USER" | "LEAVE";
const entriesOptions = [5, 10, 15, 20, 30];

export const AttendanceHub = () => {
  const [activeTab, setActiveTab] = useState<TabType>("MARK");
  const { currentUser } = useAppSelector((state) => state.officeState);
  const isAdmin = currentUser?.role === "admin";

  // States for search and pagination to match People.tsx header
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState(10);

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
        {/* 1. Main Title Section */}
        <TableTitle
          tileName="Attendance"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {activeTab === "USER" && isAdmin && (
                <CustomButton
                  label="Add User Attendance"
                  handleToggle={() => handleActionClick("USER")}
                />
              )}

              {activeTab === "LEAVE" && (
                <CustomButton
                  label="Add Leave"
                  handleToggle={() => handleActionClick("LEAVE")}
                />
              )}
            </div>
          }
        />

        {/* 2. Tabs and Controls Section (Styled like People.tsx) */}
        <div className="px-4 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex w-full sm:w-auto p-1 bg-[#F1F5F9] rounded-xl border border-gray-200">
            {(["MARK", "USER", "LEAVE"] as TabType[]).map((tab) => {
              // Hide USER tab if not admin
              if (tab === "USER" && !isAdmin) return null;

              const labels = {
                MARK: "Mark Attendance",
                USER: "User Attendance",
                LEAVE: "Leave Requests",
              };

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 text-sm font-bold transition-all duration-200 rounded-lg ${
                    activeTab === tab
                      ? "bg-white text-[#334155] shadow-sm"
                      : "text-[#64748B] hover:text-[#334155]"
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {activeTab !== "MARK" && (
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
          )}
        </div>

        {/* 3. Content Area */}
        {/* 3. Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "MARK" && (
            <MarkAttendance
              triggerMark={triggerModal.tab === "MARK" ? triggerModal.count : 0}
            />
          )}

          {activeTab === "USER" && isAdmin && (
            <UserAttendance
              triggerAdd={triggerModal.tab === "USER" ? triggerModal.count : 0}
              // Pass the search and pagination states here:
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
            />
          )}

          {activeTab === "LEAVE" && (
            <LeaveRequests
              triggerAdd={triggerModal.tab === "LEAVE" ? triggerModal.count : 0}
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
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
