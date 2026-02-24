import { Title } from "../Title";
import { FaBox, FaTag, FaFileAlt, FaCalendarAlt } from "react-icons/fa";

export type AssetDetailT = {
  asset_name: string;
  category_name: string;
  description?: string;
  date?: string;
};

type ViewAssetProps = {
  setIsOpenModal: () => void;
  viewAsset: AssetDetailT | null;
};

export const ViewAsset = ({ setIsOpenModal, viewAsset }: ViewAssetProps) => {
  if (!viewAsset) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header Section */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>VIEW ASSET</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Core Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Core Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaBox className="text-blue-400" /> Asset Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewAsset.asset_name}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaTag className="text-green-400" /> Category
                </label>
                <p className="text-gray-800 font-medium">
                  {viewAsset.category_name}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Timeline & Status */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Timeline
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-red-400" /> Date Added
                </label>
                <p className="text-gray-800 font-medium">
                  {viewAsset.date
                    ? new Date(viewAsset.date)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(/ /g, "-")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Additional Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Additional Details
            </h3>
            <div className="pt-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                <FaFileAlt className="text-yellow-400" /> Description
              </label>
              <p className="text-gray-800 font-medium mt-1 leading-relaxed">
                {viewAsset.description || "No description provided."}
              </p>
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
