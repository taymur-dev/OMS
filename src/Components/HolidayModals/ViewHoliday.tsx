import { Title } from "../Title";
import { FaCalendarAlt, FaUmbrellaBeach, FaArrowRight } from "react-icons/fa";

export type HolidayDetailT = {
  holiday: string;
  fromDate: string;
  toDate: string;
};

type ViewHolidayProps = {
  setIsOpenModal: () => void;
  viewHoliday: HolidayDetailT | null;
};

export const ViewHoliday = ({
  setIsOpenModal,
  viewHoliday,
}: ViewHolidayProps) => {
  if (!viewHoliday) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-300">
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>HOLIDAY DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Holiday Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 pt-2">
              <div className="col-span-1">
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUmbrellaBeach className="text-gray-400" /> Holiday Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewHoliday.holiday}
                </p>
              </div>

              <div className="col-span-1">
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-gray-400" /> From Date
                </label>
                <p className="text-gray-800 font-medium">
                  {formatDate(viewHoliday.fromDate)}
                </p>
              </div>

              <div className="col-span-1">
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaArrowRight className="text-gray-400 text-[8px]" /> To Date
                </label>
                <p className="text-gray-800 font-medium">
                  {formatDate(viewHoliday.toDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

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
