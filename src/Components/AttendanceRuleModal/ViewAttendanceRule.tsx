import { Title } from "../Title";
import { FaClock, FaCalendarDay, FaUserClock, FaCoffee } from "react-icons/fa";

export type ConfigTimeDetailT = {
  id: number;
  startTime: string;
  endTime: string;
  offDay: string;
  lateTime: string;
  halfLeave: string;
  month: string;
  year: string;
  status: string;
};

type ViewConfigTimeProps = {
  setIsOpenModal: () => void;
  viewConfig: ConfigTimeDetailT | null;
};

export const ViewAttendanceRule = ({
  setIsOpenModal,
  viewConfig,
}: ViewConfigTimeProps) => {
  const formatTime = (time: string) => {
    if (!time) return "N/A";
    return time.slice(0, 5);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
        <div className="bg-white rounded-xl border-t-5 border-blue-400">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>ATTENDANCE RULE DETAILS</Title>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="border border-gray-200 rounded-md p-5 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              Shift & Schedule Info
            </h3>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaClock className="text-gray-500" /> Start Time
                </label>
                <p className="text-gray-800 font-semibold text-sm">
                  {formatTime(viewConfig?.startTime ?? "")}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaClock className="text-gray-500" /> End Time
                </label>
                <p className="text-gray-800 font-semibold text-sm">
                  {formatTime(viewConfig?.endTime ?? "")}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarDay className="text-gray-500" /> Weekly Off Day
                </label>
                <p className="text-indigo-900 font-bold text-sm">
                  {viewConfig?.offDay || "N/A"}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUserClock className="text-gray-600" /> Late Arrival After
                </label>
                <p className="text-gray-800 font-semibold text-sm">
                  {formatTime(viewConfig?.lateTime ?? "")}
                </p>
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCoffee className="text-gray-500" /> Half Leave Threshold
                </label>
                <p className="text-gray-800 font-semibold text-sm">
                  {formatTime(viewConfig?.halfLeave ?? "")}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUserClock className="text-gray-600" /> Month
                </label>
                <p className="text-gray-800 font-semibold text-sm">
                  {formatTime(viewConfig?.month ?? "")}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUserClock className="text-gray-600" /> Year
                </label>
                <p className="text-gray-800 font-semibold text-sm">
                  {formatTime(viewConfig?.year ?? "")}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUserClock className="text-gray-600" /> Status
                </label>
                <p className="text-gray-800 font-semibold text-sm">
                  {formatTime(viewConfig?.status ?? "")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 flex justify-end">
          <button
            onClick={setIsOpenModal}
            className="bg-gray-200 hover:bg-white text-gray-800 border border-1 border-gray-400 text-sm font-bold py-1 px-6 rounded
             shadow-sm transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
