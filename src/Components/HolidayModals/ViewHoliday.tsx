import { Title } from "../Title";

export type HolidayDetailT = {
  holiday: string;
  date: string;
};

type ViewHolidayProps = {
  setIsOpenModal: () => void;
  viewHoliday: HolidayDetailT | null;
};

export const ViewHoliday = ({ setIsOpenModal, viewHoliday }: ViewHolidayProps) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex  px-4 items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl rounded shadow-xl overflow-hidden">
        <div className="bg-indigo-900 px-6">
          <Title setModal={setIsOpenModal} className="text-white text-xl font-semibold">
            Leave Details
          </Title>
        </div>

        <div className="px-6 py-6 space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="text-lg font-semibold text-gray-800">Holiday Name:</span>
            <p className="text-gray-600">{viewHoliday?.holiday}</p>
          </div>

          {viewHoliday?.date && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Date:</span>
              <p className="text-gray-600">
                {new Date(viewHoliday.date).toLocaleDateString("sv-SE")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
