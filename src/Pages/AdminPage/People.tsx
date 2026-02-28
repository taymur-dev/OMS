import { useState, useEffect } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";

import { UsersDetails } from "./UsersDetails";
// import { CustomerDetail } from "./CustomerDetail";
// import { Suppliers } from "./Suppliers";

import { useSearchParams } from "react-router-dom";
import { Footer } from "../../Components/Footer";

type TabType = "USERS" | "CUSTOMERS" | "SUPPLIERS";
const entriesOptions = [5 , 10, 15, 20, 30];

export const People = () => {
  const [searchParams] = useSearchParams();
  const tabFromURL = searchParams.get("tab") as TabType | null;

  // Lifted states to keep the header synced with the table
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState(10);

  const [activeTab, setActiveTab] = useState<TabType>(
    tabFromURL === "CUSTOMERS" || tabFromURL === "SUPPLIERS"
      ? tabFromURL
      : "USERS",
  );

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
        {/* 1. Main Title Section */}
        <TableTitle
          tileName="People Management"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {activeTab === "USERS" && (
                <CustomButton
                  label="Add User"
                  handleToggle={() => handleActionClick("USERS")}
                />
              )}
              {activeTab === "CUSTOMERS" && (
                <CustomButton
                  label="Customers"
                  handleToggle={() => handleActionClick("CUSTOMERS")}
                />
              )}
              {activeTab === "SUPPLIERS" && (
                <CustomButton
                  label="Suppliers"
                  handleToggle={() => handleActionClick("SUPPLIERS")}
                />
              )}
            </div>
          }
        />

        {/* 2. Unified Header (Tabs + Search + Page Size) */}
        <div className="px-4 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Tab Pills */}
          <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl border border-gray-200">
            {(["USERS", "CUSTOMERS", "SUPPLIERS"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 text-sm font-bold transition-all duration-200 rounded-lg ${
                  activeTab === tab
                    ? "bg-white text-[#334155] shadow-sm"
                    : "text-[#64748B] hover:text-[#334155]"
                }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Right: Search and Entries (Matched to screenshot) */}
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
        </div>

        {/* 3. Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "USERS" && (
            <UsersDetails
              triggerAdd={triggerModal.tab === "USERS" ? triggerModal.count : 0}
              // Pass the lifted states down
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
            />
          )}

          {/* {activeTab === "CUSTOMERS" && (
            <CustomerDetail
              triggerAdd={triggerModal.tab === "CUSTOMERS" ? triggerModal.count : 0}
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
            />
          )}

          {activeTab === "SUPPLIERS" && (
            <Suppliers
              triggerAdd={triggerModal.tab === "SUPPLIERS" ? triggerModal.count : 0}
              externalSearch={searchTerm}
              externalPageSize={selectedValue}
            />
          )} */}
        </div>
      </div>

      <div className="mt-auto border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};