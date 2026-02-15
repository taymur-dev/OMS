import { Title } from "../Title";
import { ALLASSIGNPROJECTT } from "../../Pages/AdminPage/AssignProjects";
import {
  FaUser,
  FaProjectDiagram,
  FaCalendarCheck,
  FaBriefcase,
  FaIdBadge,
} from "react-icons/fa";

type ViewAssignProjectProps = {
  setIsOpenModal: () => void;
  viewProject: ALLASSIGNPROJECTT | null;
};

export const ViewAssignProject = ({
  setIsOpenModal,
  viewProject,
}: ViewAssignProjectProps) => {
  if (!viewProject) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>VIEW ASSIGNED PROJECT</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Assignment Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Assignment Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Employee Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewProject.name || "N/A"}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaIdBadge className="text-gray-400" /> Employee ID
                </label>
                <p className="text-gray-800 font-medium">#{viewProject.employee_id}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Project Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Project Details
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaProjectDiagram className="text-gray-400" /> Project Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewProject.projectName || "N/A"}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaBriefcase className="text-gray-400" /> Status
                </label>
                <p className="text-gray-800 font-medium">
                  {/* Fallback to Active if no status exists in your type */}
                  Active
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Timeline */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Timeline
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarCheck className="text-gray-400" /> Assigned Date
                </label>
                <p className="text-gray-800 font-medium">
                  {viewProject.date
                    ? new Date()
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(/ /g, "-")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-indigo-900 p-3 flex justify-end">
          <button
            onClick={setIsOpenModal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-1 px-8 rounded shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
