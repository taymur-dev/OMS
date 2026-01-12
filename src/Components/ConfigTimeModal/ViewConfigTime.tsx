import { Title } from "../Title";

export type ConfigTimeDetailT = {
  configureType: string;
  configureTime: string;
};

type ViewConfigTimeProps = {
  setIsOpenModal: () => void;
  viewConfig: ConfigTimeDetailT | null;
};

export const ViewConfigTime = ({
  setIsOpenModal,
  viewConfig,
}: ViewConfigTimeProps) => {
  const formatTime = (time: string) => {
    if (!time) return "";
    return time.slice(0, 5);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-2xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          <Title setModal={setIsOpenModal}>Configuration Detail</Title>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Configure Type:
              </span>
              <p className="text-gray-600">{viewConfig?.configureType}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Configure Time:
              </span>
              <p className="text-gray-600">{formatTime(viewConfig?.configureTime ?? "")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
