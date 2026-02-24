import { Title } from "../Title";
import { ALLPROGRESST } from "../../Pages/Progress";
import {
  FaUser,
  FaProjectDiagram,
  FaCalendarAlt,
  FaStickyNote,
  FaTasks,
} from "react-icons/fa";

type ViewProgressProps = {
  setIsOpenModal: () => void;
  viewProgress: ALLPROGRESST | null;
};

export const ViewProgress = ({
  setIsOpenModal,
  viewProgress,
}: ViewProgressProps) => {
  if (!viewProgress) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>VIEW PROGRESS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Assignment Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Assignment Details
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-blue-400" /> Employee Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewProgress.employeeName || "N/A"}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaProjectDiagram className="text-red-400" /> Project
                </label>
                <p className="text-gray-800 font-medium">
                  {viewProgress.projectName || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Timeline & Status */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Timeline
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-green-400" /> Submission Date
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(viewProgress.date)
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
                  <FaTasks className="text-yellow-400" /> Progress Type
                </label>
                <p className="text-gray-800 font-medium">Daily Update</p>
              </div>
            </div>
          </div>

          {/* Section 3: Notes/Description */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Work Summary & Notes
            </h3>
            <div className="pt-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                <FaStickyNote className="text-purple-400" /> Detailed Note
              </label>
              <p className="text-gray-800 font-medium mt-1 leading-relaxed">
                {viewProgress.note || "No additional notes provided."}
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
