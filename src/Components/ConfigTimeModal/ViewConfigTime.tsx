import { Title } from "../Title";
import { FaClock, FaCogs } from "react-icons/fa";

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
    if (!time) return "N/A";
    return time.slice(0, 5);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-300">
        {/* Header */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>CONFIGURATION DETAILS</Title>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4">
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Time Configuration Info
            </h3>
            
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              {/* Configure Type */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCogs className="text-gray-400" /> Configure Type
                </label>
                <p className="text-gray-800 font-medium">
                  {viewConfig?.configureType || "N/A"}
                </p>
              </div>

              {/* Configure Time */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaClock className="text-gray-400" /> Configure Time
                </label>
                <p className="text-gray-800 font-medium">
                  {formatTime(viewConfig?.configureTime ?? "")}
                </p>
              </div>
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