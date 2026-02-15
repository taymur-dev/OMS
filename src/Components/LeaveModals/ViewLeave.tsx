import { Title } from "../Title";
import { FaUser, FaCalendarAlt, FaInfoCircle, FaFileAlt } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";

type ViewLeaveProps = {
  setIsOpenModal: () => void;
  data: {
    id: number;
    leaveSubject: string;
    leaveReason: string;
    fromDate: string;
    toDate: string;
    leaveStatus: string;
    status: string;
    name: string;
  } | null;
};

export const ViewLeave = ({ setIsOpenModal, data }: ViewLeaveProps) => {
  if (!data) return null;

  // Logic for status color badge
  const statusColor =
    data.leaveStatus.toLowerCase() === "approved"
      ? "text-green-600"
      : data.leaveStatus.toLowerCase() === "pending"
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>LEAVE DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Employee Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Request Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Employee Name
                </label>
                <p className="text-gray-800 font-medium">{data.name}</p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-gray-400" /> From Date
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(data.fromDate)
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
                  <FaCalendarAlt className="text-gray-400" /> To Date
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(data.toDate)
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

          {/* Section 2: Leave Summary */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Subject & Status
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaFileAlt className="text-gray-400" /> Subject
                </label>
                <p className="text-gray-800 font-medium">{data.leaveSubject}</p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaInfoCircle className="text-gray-400" /> Status
                </label>
                <p
                  className={`font-bold uppercase text-xs mt-1 ${statusColor}`}
                >
                  {data.leaveStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Reason (Full Width) */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Reason / Remarks
            </h3>
            <div className="pt-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase mb-1">
                <HiOutlineDocumentText className="text-gray-400 text-sm" />{" "}
                Detailed Reason
              </label>
              <div className="bg-gray-50 p-3 rounded border border-gray-100 min-h-[80px] max-h-40 overflow-y-auto">
                <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                  {data.leaveReason || "No reason provided."}
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
