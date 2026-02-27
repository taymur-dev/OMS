import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { MarkAttendance } from "../AdminPage/MarkAttendance";
import { Footer } from "../../Components/Footer";

export const UserAttendanceHub = () => {
  return (
    <div className="flex flex-col flex-grow shadow-lg p-1 sm:p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white rounded-md">
        <TableTitle tileName="Mark Attendance" />

        <div className="px-4 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4" />

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
