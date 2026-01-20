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
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4   flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-2xl border border-indigo-900 rounded p-6 shadow-lg">
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setIsOpenModal}
              className="text-white text-lg font-semibold"
            >
              Configuration Details
            </Title>
          </div>
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
              <p className="text-gray-600">
                {formatTime(viewConfig?.configureTime ?? "")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
