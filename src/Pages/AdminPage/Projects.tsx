import { useState } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { ProjectsDetails } from "./ProjectsDetails";
import { ProjectsCatogries } from "../ProjectsCategories";
import { AssignProjects } from "./AssignProjects";
import { useAppSelector } from "../../redux/Hooks";
import { FolderKanban, Layers, UserPlus } from "lucide-react";
import { Footer } from "../../Components/Footer";

type TabType = "CATEGORY" | "DETAILS" | "ASSIGN" | "";

export const Projects = () => {
  const [activeTab, setActiveTab] = useState<TabType>("DETAILS");
  const { currentUser } = useAppSelector((state) => state.officeState);
  const isAdmin = currentUser?.role === "admin";

  const [triggerModal, setTriggerModal] = useState<{
    tab: TabType;
    count: number;
  }>({ tab: "DETAILS", count: 0 });

  const handleActionClick = (tab: TabType) => {
    setTriggerModal((prev) => ({
      tab,
      count: prev.tab === tab ? prev.count + 1 : 1,
    }));
  };

  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        {/* Header */}
        <TableTitle
          tileName="Projects"
          rightElement={
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {activeTab === "DETAILS" && isAdmin && (
                <CustomButton
                  label="+ Projects"
                  handleToggle={() => handleActionClick("DETAILS")}
                />
              )}

              {activeTab === "CATEGORY" && isAdmin && (
                <CustomButton
                  label="+ Categories"
                  handleToggle={() => handleActionClick("CATEGORY")}
                />
              )}

              {activeTab === "ASSIGN" && (
                <CustomButton
                  label="+ Assign"
                  handleToggle={() => handleActionClick("ASSIGN")}
                />
              )}
            </div>
          }
        />

        {/* Tab Navigation */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-1 px-2 sm:px-4  bg-white border-b border-gray-300">
          {isAdmin && (
            <button
              onClick={() => setActiveTab("DETAILS")}
              className={`flex items-center justify-center gap-2 flex-1 lg:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "DETAILS"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
            >
              <FolderKanban size={16} className="sm:w-4 sm:h-4" />
              <span className="truncate">Projects</span>
              <span className="hidden sm:inline">Details</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setActiveTab("CATEGORY")}
              className={`flex items-center justify-center gap-2 flex-1 lg:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "CATEGORY"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
            >
              <Layers size={16} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Project</span>
              <span className="truncate"> Categories</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("ASSIGN")}
            className={`flex items-center justify-center gap-2 flex-1 lg:flex-none px-2 sm:px-6 py-2.5
               text-xs sm:text-sm font-semibold transition-all duration-200 rounded-t-lg ${
                 activeTab === "ASSIGN"
                   ? "bg-indigo-900 text-white shadow-md"
                   : "bg-gray-100 text-gray-500 hover:bg-gray-200"
               }`}
          >
            <UserPlus size={16} className="sm:w-4 sm:h-4" />
            <span className="truncate">Assign</span>
            <span className="hidden sm:inline">Projects</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          {activeTab === "DETAILS" && isAdmin && (
            <ProjectsDetails
              triggerModal={
                triggerModal.tab === "DETAILS" ? triggerModal.count : 0
              }
            />
          )}

          {activeTab === "CATEGORY" && isAdmin && (
            <ProjectsCatogries
              triggerModal={
                triggerModal.tab === "CATEGORY" ? triggerModal.count : 0
              }
            />
          )}

          {activeTab === "ASSIGN" && (
            <AssignProjects
              triggerModal={
                triggerModal.tab === "ASSIGN" ? triggerModal.count : 0
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
