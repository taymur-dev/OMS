import { useState , useEffect } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";

import { UsersDetails } from "./UsersDetails";
import { CustomerDetail } from "./CustomerDetail";
import { Suppliers } from "./Suppliers";

import { Users, UserRound, Truck } from "lucide-react";

import { useSearchParams } from "react-router-dom";
import { Footer } from "../../Components/Footer";

type TabType = "USERS" | "CUSTOMERS" | "SUPPLIERS";

export const People = () => {
  const [searchParams] = useSearchParams();
  const tabFromURL = searchParams.get("tab") as TabType | null;

  const [activeTab, setActiveTab] = useState<TabType>(
    tabFromURL === "CUSTOMERS" || tabFromURL === "SUPPLIERS"
      ? tabFromURL
      : "USERS",
  );

  // Trigger state (same pattern as AttendanceHub)
  const [triggerModal, setTriggerModal] = useState<{
    tab: TabType;
    count: number;
  }>({ tab: "USERS", count: 0 });

  const handleActionClick = (tab: TabType) => {
    setTriggerModal((prev) => ({
      tab,
      count: prev.tab === tab ? prev.count + 1 : 1,
    }));
  };


  useEffect(() => {
  if (
    tabFromURL === "USERS" ||
    tabFromURL === "CUSTOMERS" ||
    tabFromURL === "SUPPLIERS"
  ) {
    setActiveTab(tabFromURL);
  }
}, [tabFromURL]);


  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        {/* Header */}
        <TableTitle
          tileName="People Management"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {activeTab === "USERS" && (
                <CustomButton
                  label="+ Users"
                  handleToggle={() => handleActionClick("USERS")}
                />
              )}

              {activeTab === "CUSTOMERS" && (
                <CustomButton
                  label="+ Customers"
                  handleToggle={() => handleActionClick("CUSTOMERS")}
                />
              )}

              {activeTab === "SUPPLIERS" && (
                <CustomButton
                  label="+ Suppliers"
                  handleToggle={() => handleActionClick("SUPPLIERS")}
                />
              )}
            </div>
          }
        />

        {/* Responsive Tabs - Wrap on all screens except desktop (lg) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap items-center gap-1 px-2 sm:px-4 bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("USERS")}
            className={`flex items-center justify-center gap-2 flex-1 lg:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "USERS"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <Users size={16} />
            <span>Users</span>
          </button>

          <button
            onClick={() => setActiveTab("CUSTOMERS")}
            className={`flex items-center justify-center gap-2 flex-1 lg:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "CUSTOMERS"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <UserRound size={16} />
            <span>Customers</span>
          </button>

          <button
            onClick={() => setActiveTab("SUPPLIERS")}
            className={`flex items-center justify-center gap-2 flex-1 lg:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "SUPPLIERS"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <Truck size={16} />
            <span>Suppliers</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "USERS" && (
            <UsersDetails
              triggerAdd={triggerModal.tab === "USERS" ? triggerModal.count : 0}
            />
          )}

          {activeTab === "CUSTOMERS" && (
            <CustomerDetail
              triggerAdd={
                triggerModal.tab === "CUSTOMERS" ? triggerModal.count : 0
              }
            />
          )}

          {activeTab === "SUPPLIERS" && (
            <Suppliers
              triggerAdd={
                triggerModal.tab === "SUPPLIERS" ? triggerModal.count : 0
              }
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
