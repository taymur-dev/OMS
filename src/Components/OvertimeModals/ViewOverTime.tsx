import { Title } from "../Title";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

type OVERTIMET = {
  id: number;
  name: string;
  date: string;
  totalTime: string;
  approvalStatus: string;
};

type ViewOvertimeProps = {
  setModal: () => void;
  data: OVERTIMET;
};

export const ViewOverTimeModal = ({ setModal, data }: ViewOvertimeProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header Section */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setModal}>OVERTIME DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 pb-2">
           
            <div>
              <h2 className="text-xl font-bold text-indigo-900">{data.name}</h2>
              <p className="text-xs font-bold text-black uppercase tracking-widest">
                Employee
              </p>
            </div>
          </div>

          {/* Section 1: Time Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Time Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-red-400" /> Date
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(data.date)
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
                  <FaClock className="text-green-400" /> Overtime Duration
                </label>
                <p className="text-gray-800 font-medium">{data.totalTime}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Status & Tracking */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Status & Tracking
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCheckCircle className="text-yellow-400" /> Approval Status
                </label>
                <span
                  className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase ${
                    data.approvalStatus.toLowerCase() === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {data.approvalStatus}
                </span>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaInfoCircle className="text-blue-400" /> Request ID
                </label>
                <p className="text-gray-800 font-medium">#OT-{data.id}</p>
              </div>
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
