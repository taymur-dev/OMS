import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { AssetCategory } from "./AssetCategory";
import { Assets } from "./Assets";
import { useAppSelector } from "../../redux/Hooks";
import { Footer } from "../../Components/Footer";
import { FolderTree, Package } from "lucide-react";

// Define Tab Types
type TabType = "ASSET_CATEGORY" | "ASSET";

export const Capital = () => {
  const [activeTab, setActiveTab] = useState<TabType>("ASSET_CATEGORY");
  const { currentUser } = useAppSelector((state) => state.officeState);
  const isAdmin = currentUser?.role === "admin";

  // Trigger state for Add buttons
  const [triggerModal, setTriggerModal] = useState<{
    tab: TabType;
    count: number;
  }>({ tab: "ASSET_CATEGORY", count: 0 });

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
          tileName="Assets"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {isAdmin && activeTab === "ASSET_CATEGORY" && (
                <CustomButton
                  label="+ Asset Category"
                  handleToggle={() => handleActionClick("ASSET_CATEGORY")}
                />
              )}

              {isAdmin && activeTab === "ASSET" && (
                <CustomButton
                  label="+ Asset"
                  handleToggle={() => handleActionClick("ASSET")}
                />
              )}
            </div>
          }
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-2 sm:px-4  bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("ASSET_CATEGORY")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "ASSET_CATEGORY"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <FolderTree size={16} />
            <span>Asset Category</span>
          </button>

          <button
            onClick={() => setActiveTab("ASSET")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "ASSET"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <Package size={16} />
            <span>Asset</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "ASSET_CATEGORY" && (
            <AssetCategory
              triggerModal={
                triggerModal.tab === "ASSET_CATEGORY" ? triggerModal.count : 0
              }
            />
          )}

          {activeTab === "ASSET" && (
            <Assets
              triggerModal={
                triggerModal.tab === "ASSET" ? triggerModal.count : 0
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
