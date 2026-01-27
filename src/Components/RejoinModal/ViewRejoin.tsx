import { Title } from "../Title";
import { REJOIN_T } from "../../Pages/AdminPage/Rejoin";
import {
  FaUser,
  FaBriefcase,
  FaCalendarTimes,
  FaCalendarCheck,
  FaInfoCircle,
} from "react-icons/fa";

type ViewRejoinProps = {
  setIsOpenModal: () => void;
  viewRejoin: REJOIN_T | null;
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? "N/A"
    : date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
};

export const ViewRejoin = ({ setIsOpenModal, viewRejoin }: ViewRejoinProps) => {
  if (!viewRejoin) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-300">
        {/* Header Section */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>REJOINING DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Employee Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Employment Details
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Employee Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewRejoin.employee_name || "N/A"}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaBriefcase className="text-gray-400" /> Designation
                </label>
                <p className="text-gray-800 font-medium">
                  {viewRejoin.designation || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Timeline */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Timeline & Request
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarTimes className="text-gray-400" /> Resignation Date
                </label>
                <p className="text-gray-800 font-medium">
                  {formatDate(viewRejoin.resignation_date)}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarCheck className="text-gray-400" /> Rejoin Date
                </label>
                <p className="text-gray-800 font-medium">
                  {formatDate(viewRejoin.rejoinRequest_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Status */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Status Information
            </h3>
            <div className="grid grid-cols-1 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaInfoCircle className="text-gray-400" /> Approval Status
                </label>
                <p
                  className={`font-bold ${
                    viewRejoin.approval_status === "Approved"
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {viewRejoin.approval_status || "Pending"}
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
