import { Title } from "../Title";
import {
  FaUser,
  FaTag,
  FaCalendarAlt,
  FaClock,
  FaHistory,
  FaClipboardCheck,
} from "react-icons/fa";

type AttendanceT = {
  id: number;
  attendanceStatus: string;
  clockIn: string;
  clockOut: string;
  date: string;
  day: string;
  leaveStatus: string | null;
  leaveReason: string | null;
  name: string;
  role: string;
  status: string;
  userId: number;
  workingHours: string;
};

type ViewAttendanceProps = {
  setIsOpenModal: () => void;
  viewAttendance: AttendanceT | null;
};

export const ViewAttendance = ({
  setIsOpenModal,
  viewAttendance,
}: ViewAttendanceProps) => {
  if (!viewAttendance) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header Section */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>USER ATTENDANCE DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: User Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              User Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> User Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewAttendance.name}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaTag className="text-gray-400" /> Role
                </label>
                <p className="text-gray-800 font-medium">
                  {viewAttendance.role}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Date & Day */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Timing Reference
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-gray-400" /> Date
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(viewAttendance.date)
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
                  <FaClipboardCheck className="text-gray-400" /> Day
                </label>
                <p className="text-gray-800 font-medium">
                  {viewAttendance.day}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Clock Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Shift Details
            </h3>
            <div className="grid grid-cols-3 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaClock className="text-gray-400" /> Clock In
                </label>
                <p className="text-gray-800 font-medium">
                  {viewAttendance.clockIn || "--:--"}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaClock className="text-gray-400" /> Clock Out
                </label>
                <p className="text-gray-800 font-medium">
                  {viewAttendance.clockOut || "--:--"}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaHistory className="text-gray-400" /> Total Hours
                </label>
                <p className="text-gray-800 font-medium">
                  {viewAttendance.workingHours || "00:00"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Status / Remarks (Optional Addition) */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Attendance Status
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  Status
                </label>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    viewAttendance.attendanceStatus === "Present"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {viewAttendance.attendanceStatus}
                </span>
              </div>
              {viewAttendance.leaveReason && (
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                    Reason
                  </label>
                  <p className="text-gray-800 font-medium text-sm">
                    {viewAttendance.leaveReason}
                  </p>
                </div>
              )}
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
