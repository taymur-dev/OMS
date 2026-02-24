import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { Quotation } from "./Quotation";
import { Sales } from "./Sales";
import { useAppSelector } from "../../redux/Hooks";
import { FileText, ShoppingCart } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Footer } from "../../Components/Footer";

// Define Tab Types
type TabType = "QUOTATION" | "SALE";

export const SalesHub = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const isAdmin = currentUser?.role === "admin";

  const [searchParams] = useSearchParams();
  const tabFromURL = searchParams.get("tab") as TabType | null;

  const [activeTab, setActiveTab] = useState<TabType>(
    tabFromURL === "QUOTATION" || tabFromURL === "SALE"
      ? tabFromURL
      : "QUOTATION",
  );

  // Trigger state for Add buttons
  const [triggerModal, setTriggerModal] = useState<{
    tab: TabType;
    count: number;
  }>({ tab: "SALE", count: 0 });

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
          tileName="Sales"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {isAdmin && activeTab === "QUOTATION" && (
                <CustomButton
                  label="+ Quotation"
                  handleToggle={() => handleActionClick("QUOTATION")}
                />
              )}
              {isAdmin && activeTab === "SALE" && (
                <CustomButton
                  label="+ Sale"
                  handleToggle={() => handleActionClick("SALE")}
                />
              )}
            </div>
          }
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-2 sm:px-4  bg-white border-b border-gray-100">
          <button
            onClick={() => setActiveTab("QUOTATION")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "QUOTATION"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <FileText size={16} />
            <span>Quotation</span>
          </button>

          <button
            onClick={() => setActiveTab("SALE")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "SALE"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <ShoppingCart size={16} />
            <span>Sale</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "QUOTATION" && (
            <Quotation
              triggerModal={
                triggerModal.tab === "QUOTATION" ? triggerModal.count : 0
              }
            />
          )}

          {activeTab === "SALE" && (
            <Sales
              triggerModal={
                triggerModal.tab === "SALE" ? triggerModal.count : 0
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
