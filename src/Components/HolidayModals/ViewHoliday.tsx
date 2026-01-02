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
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-2xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          <Title setModal={setIsOpenModal}>Holiday Detail</Title>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Holiday Name:
              </span>
              <p className="text-gray-600">{viewHoliday?.holiday}</p>
            </div>

            {viewHoliday?.date && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Date:
                </span>
                <p className="text-gray-600">
                  {new Date(viewHoliday.date).toLocaleDateString("en-GB")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
