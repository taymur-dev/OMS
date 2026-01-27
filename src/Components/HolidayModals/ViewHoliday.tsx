import { Title } from "../Title";
import { FaCalendarAlt, FaUmbrellaBeach } from "react-icons/fa";

export type HolidayDetailT = {
  holiday: string;
  date: string;
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

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-300">
        {/* Header Section */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>VIEW HOLIDAY</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Holiday Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Holiday Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUmbrellaBeach className="text-gray-400" /> Holiday Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewHoliday.holiday}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-gray-400" /> Occasion Date
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(viewHoliday.date)
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

          {/* You can add more sections here in the future following the same pattern */}
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
