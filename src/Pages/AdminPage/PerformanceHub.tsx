import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { Todo } from "./Todo";
import { Progress } from "../Progress";
import { useAppSelector } from "../../redux/Hooks";
import { CheckSquare, TrendingUp } from "lucide-react";
import { Footer } from "../../Components/Footer";

// Define Tab Types
type TabType = "TODO" | "PROGRESS";

export const PerformanceHub = () => {
  const [activeTab, setActiveTab] = useState<TabType>("TODO");
  const { currentUser } = useAppSelector((state) => state.officeState);
  const isAdmin = currentUser?.role === "admin";

  // Trigger state for Add buttons (same logic as SalesHub)
  const [triggerModal, setTriggerModal] = useState<{
    tab: TabType;
    count: number;
  }>({ tab: "TODO", count: 0 });

  const handleActionClick = (tab: TabType) => {
    setTriggerModal((prev) => ({
      tab,
      count: prev.tab === tab ? prev.count + 1 : 1,
    }));
  };

  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        {/* Title + Add Button */}
        <TableTitle
          tileName="Performance"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {isAdmin && activeTab === "TODO" && (
                <CustomButton
                  label="+ Todo"
                  handleToggle={() => handleActionClick("TODO")}
                />
              )}
              {isAdmin && activeTab === "PROGRESS" && (
                <CustomButton
                  label="+ Progress"
                  handleToggle={() => handleActionClick("PROGRESS")}
                />
              )}
            </div>
          }
        />

        {/* Tabs */}
        <div className="flex items-center gap-1 px-2 sm:px-4  bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("TODO")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "TODO"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <CheckSquare size={16} />
            <span>Todo</span>
          </button>

          <button
            onClick={() => setActiveTab("PROGRESS")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "PROGRESS"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <TrendingUp size={16} />
            <span>Progress</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "TODO" && (
            <Todo
              triggerModal={
                triggerModal.tab === "TODO" ? triggerModal.count : 0
              }
            />
          )}

          {activeTab === "PROGRESS" && (
            <Progress
              triggerModal={
                triggerModal.tab === "PROGRESS"
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