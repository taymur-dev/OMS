import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { Promotion } from "./Promotion";
import { Resignation } from "./Resignation";
import { Rejoin } from "./Rejoin";
import { useAppSelector } from "../../redux/Hooks";
import { ArrowUpCircle, LogOut, RotateCcw } from "lucide-react";
import { Footer } from "../../Components/Footer";

// Define Tab Types
type TabType = "PROMOTION" | "RESIGNATION" | "REJOIN";

export const UserPropulsive = () => {
  const [activeTab, setActiveTab] = useState<TabType>("PROMOTION");
  const { currentUser } = useAppSelector((state) => state.officeState);
  const isAdmin = currentUser?.role === "admin";

  // Trigger state for Add buttons
  const [triggerModal, setTriggerModal] = useState<{
    tab: TabType;
    count: number;
  }>({ tab: "PROMOTION", count: 0 });

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
          tileName="Dynamics"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {!isAdmin && activeTab === "PROMOTION" && (
                <CustomButton
                  label="+ Promotion Request"
                  handleToggle={() => handleActionClick("PROMOTION")}
                />
              )}

              {activeTab === "RESIGNATION" && (
                <CustomButton
                  label="+ Resignation Request"
                  handleToggle={() => handleActionClick("RESIGNATION")}
                />
              )}

              {activeTab === "REJOIN" && (
                <CustomButton
                  label="+ Rejoining Request"
                  handleToggle={() => handleActionClick("REJOIN")}
                />
              )}
            </div>
          }
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-2 sm:px-4 bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("PROMOTION")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
              text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                activeTab === "PROMOTION"
                  ? "bg-indigo-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            <ArrowUpCircle size={16} />
            <span>Promotion</span>
          </button>

          <button
            onClick={() => setActiveTab("RESIGNATION")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
              text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                activeTab === "RESIGNATION"
                  ? "bg-indigo-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            <LogOut size={16} />
            <span>Resignation</span>
          </button>

          <button
            onClick={() => setActiveTab("REJOIN")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
              text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                activeTab === "REJOIN"
                  ? "bg-indigo-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            <RotateCcw size={16} />
            <span>Rejoining</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "PROMOTION" && (
            <Promotion
              triggerModal={
                triggerModal.tab === "PROMOTION" ? triggerModal.count : 0
              }
            />
          )}

          {activeTab === "RESIGNATION" && (
            <Resignation
              triggerModal={
                triggerModal.tab === "RESIGNATION" ? triggerModal.count : 0
              }
            />
          )}

          {activeTab === "REJOIN" && (
            <Rejoin
              triggerModal={
                triggerModal.tab === "REJOIN" ? triggerModal.count : 0
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