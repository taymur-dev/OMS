import { Title } from "../Title";
import {
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
  FaStickyNote,
  FaCheckCircle,
} from "react-icons/fa";

type ViewResignationProps = {
  setModal: () => void;
  resignationData: {
    employee_name: string;
    designation: string;
    note: string;
    resignation_date: string;
    approval_status: string;
  };
};

export const ViewResignation = ({
  setModal,
  resignationData,
}: ViewResignationProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setModal}>RESIGNATION DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Employee Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Employee Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-blue-400" /> Employee Name
                </label>
                <p className="text-gray-800 font-medium">
                  {resignationData.employee_name}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaBriefcase className="text-green-400" />Current Position
                </label>
                <p className="text-gray-800 font-medium">
                  {resignationData.designation}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Request Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Submission Details
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-yellow-400" /> Resignation Date
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(resignationData.resignation_date)
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
                  <FaCheckCircle className="text-orange-400" /> Approval Status
                </label>
                <p
                  className={`font-bold ${
                    resignationData.approval_status.toLowerCase() === "accepted"
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {resignationData.approval_status}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Additional Remarks */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Remarks & Notes
            </h3>
            <div className="pt-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                <FaStickyNote className="text-purple-400" /> Resignation Note
              </label>
              <p className="text-gray-800 font-medium mt-1 leading-relaxed">
                {resignationData.note || "No additional notes provided."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-indigo-900 p-3 flex justify-end">
          <button
            onClick={setModal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-1 px-8 rounded shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
