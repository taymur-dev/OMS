import { Title } from "../Title";
import {
  FaProjectDiagram,
  FaTag,
  FaCalendarAlt,
  FaCalendarCheck,
  FaAlignLeft,
} from "react-icons/fa";

type AllProjectT = {
  id: number;
  projectName: string;
  projectCategory: string;
  description: string;
  startDate: string;
  endDate: string;
};

type CustomerDetailProps = {
  setIsOpenModal: () => void;
  viewProject: AllProjectT | null;
};

export const ViewProject = ({
  setIsOpenModal,
  viewProject,
}: CustomerDetailProps) => {
  if (!viewProject) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header Section */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>VIEW PROJECT DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Basic Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaProjectDiagram className="text-gray-400" /> Project Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewProject.projectName}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaTag className="text-gray-400" /> Category
                </label>
                <p className="text-gray-800 font-medium">
                  {viewProject.projectCategory}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Timeline */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Project Timeline
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-gray-400" /> Start Date
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(viewProject.startDate)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, "-")}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarCheck className="text-gray-400" /> End Date
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(viewProject.endDate)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, "-")}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Description */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Details
            </h3>
            <div className="pt-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                <FaAlignLeft className="text-gray-400" /> Description
              </label>
              <p className="text-gray-800 font-medium mt-1 leading-relaxed">
                {viewProject.description || "No description provided."}
              </p>
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
