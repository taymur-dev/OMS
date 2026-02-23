import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { AssignProjects } from "../AdminPage/AssignProjects";
import { UserPlus } from "lucide-react";
import { Footer } from "../../Components/Footer";

type TabType = "ASSIGN" | "";

export const UserAssignedProjects = () => {
  const [activeTab, setActiveTab] = useState<TabType>("ASSIGN");

  const [triggerModal] = useState<{
    tab: TabType;
    count: number;
  }>({ tab: "ASSIGN", count: 0 });

  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">

        {/* Header */}
        <TableTitle tileName="Assigned Projects" />

        {/* Tabs */}
        <div className="flex items-center gap-1 px-2 sm:px-4  bg-white border-b border-gray-300">
          <button
            onClick={() => setActiveTab("ASSIGN")}
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "ASSIGN"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <UserPlus size={16} />
            <span>Assigned Projects</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "ASSIGN" && (
            <AssignProjects
              triggerModal={triggerModal.tab === "ASSIGN" ? triggerModal.count : 0}
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