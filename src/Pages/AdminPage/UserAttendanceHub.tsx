import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { MarkAttendance } from "../AdminPage/MarkAttendance";
import { ClipboardCheck } from "lucide-react";
import { Footer } from "../../Components/Footer";

export const UserAttendanceHub = () => {
  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        {/* Header */}
        <TableTitle tileName="My Attendance" />

        {/* Tab Header */}
        <div className="flex items-center gap-1 px-2 sm:px-4  bg-white border-b border-gray-300">
          <div className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-t-lg bg-indigo-900 text-white shadow-md">
            <ClipboardCheck size={16} />
            <span>Mark Attendance</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow p-2 sm:p-4 overflow-auto">
          <MarkAttendance triggerMark={0} />
        </div>
      </div>

      <div className="mt-auto border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
