import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { EmployeeAccount } from "./EmployeeAccount";
import { CustomerAccount } from "./CustomerAccount";
import { SupplierAccount } from "./SupplierAccount";
import { useAppSelector } from "../../redux/Hooks";
import { Users, UserPlus, Truck } from "lucide-react";
import { Footer } from "../../Components/Footer";

// Define Tab Types
type TabType = "EMPLOYEE" | "CUSTOMER" | "SUPPLIER";

export const Ledgers = () => {
  const [activeTab, setActiveTab] = useState<TabType>("EMPLOYEE");
  const { currentUser } = useAppSelector((state) => state.officeState);
  const isAdmin = currentUser?.role === "admin";

  // Trigger state for Add buttons
  const [triggerModal, setTriggerModal] = useState<{
    tab: TabType;
    count: number;
  }>({ tab: "EMPLOYEE", count: 0 });

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
          tileName="Accounts"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {isAdmin && activeTab === "EMPLOYEE" && (
                <CustomButton
                  label="+ Employee"
                  handleToggle={() => handleActionClick("EMPLOYEE")}
                />
              )}
              {isAdmin && activeTab === "CUSTOMER" && (
                <CustomButton
                  label="+ Customer"
                  handleToggle={() => handleActionClick("CUSTOMER")}
                />
              )}
              {isAdmin && activeTab === "SUPPLIER" && (
                <CustomButton
                  label="+ Supplier"
                  handleToggle={() => handleActionClick("SUPPLIER")}
                />
              )}
            </div>
          }
        />

        {/* Tab Navigation */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-1 px-2 sm:px-4  bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("EMPLOYEE")}
            className={`flex items-center justify-center gap-2 flex-1 lg:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "EMPLOYEE"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <Users size={16} className="sm:w-4 sm:h-4" />
            <span className="truncate">Employee</span>
            <span className="hidden sm:inline"> Accounts</span>
          </button>

          <button
            onClick={() => setActiveTab("CUSTOMER")}
            className={`flex items-center justify-center gap-2 flex-1 lg:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "CUSTOMER"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <UserPlus size={16} className="sm:w-4 sm:h-4" />
            <span className="truncate">Customer</span>
            <span className="hidden sm:inline"> Accounts</span>
          </button>

          <button
            onClick={() => setActiveTab("SUPPLIER")}
            className={`flex items-center justify-center gap-2 flex-1 lg:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "SUPPLIER"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <Truck size={16} className="sm:w-4 sm:h-4" />
            <span className="truncate">Supplier</span>
            <span className="hidden sm:inline"> Accounts</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "EMPLOYEE" && (
            <EmployeeAccount
              triggerModal={
                triggerModal.tab === "EMPLOYEE" ? triggerModal.count : 0
              }
            />
          )}
          {activeTab === "CUSTOMER" && (
            <CustomerAccount
              triggerModal={
                triggerModal.tab === "CUSTOMER" ? triggerModal.count : 0
              }
            />
          )}
          {activeTab === "SUPPLIER" && (
            <SupplierAccount
              triggerModal={
                triggerModal.tab === "SUPPLIER" ? triggerModal.count : 0
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
