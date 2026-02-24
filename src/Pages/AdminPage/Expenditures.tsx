import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { ExpensesCatogries } from "./ExpensesCatogries";
import { Expenses } from "./Expenses";
import { useAppSelector } from "../../redux/Hooks";
import { Layers, Wallet } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Footer } from "../../Components/Footer";

// Define Tab Types
type TabType = "CATEGORY" | "EXPENSE";

export const Expenditures = () => {
  
  const { currentUser } = useAppSelector((state) => state.officeState);
  const isAdmin = currentUser?.role === "admin";

  const [searchParams] = useSearchParams();
const tabFromURL = searchParams.get("tab") as TabType | null;

const [activeTab, setActiveTab] = useState<TabType>(
  tabFromURL === "EXPENSE" || tabFromURL === "CATEGORY"
    ? tabFromURL
    : "EXPENSE"
);

  // Trigger state for Add buttons (same pattern as SalesHub)
  const [triggerModal, setTriggerModal] = useState<{
    tab: TabType;
    count: number;
  }>({ tab: "EXPENSE", count: 0 });

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
          tileName="Expenses"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {isAdmin && activeTab === "EXPENSE" && (
                <CustomButton
                  label="+ Expense"
                  handleToggle={() => handleActionClick("EXPENSE")}
                />
              )}

              {isAdmin && activeTab === "CATEGORY" && (
                <CustomButton
                  label="+ Expense Category"
                  handleToggle={() => handleActionClick("CATEGORY")}
                />
              )}
            </div>
          }
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-2 sm:px-4 bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("EXPENSE")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
              text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                activeTab === "EXPENSE"
                  ? "bg-indigo-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            <Wallet size={16} />
            <span>Expense</span>
          </button>

          <button
            onClick={() => setActiveTab("CATEGORY")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
              text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                activeTab === "CATEGORY"
                  ? "bg-indigo-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            <Layers size={16} />
            <span>Expense Category</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "EXPENSE" && (
            <Expenses
              triggerModal={
                triggerModal.tab === "EXPENSE" ? triggerModal.count : 0
              }
            />
          )}

          {activeTab === "CATEGORY" && (
            <ExpensesCatogries
              triggerModal={
                triggerModal.tab === "CATEGORY" ? triggerModal.count : 0
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
