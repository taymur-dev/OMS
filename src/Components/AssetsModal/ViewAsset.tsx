import { Title } from "../Title";

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
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-900 rounded-lg p-6 shadow-lg">
          {/* Title */}
          <div className="bg-indigo-900 rounded">
            <Title
              setModal={setIsOpenModal}
              className="text-white text-lg font-semibold"
            >
              Asset Details
            </Title>
          </div>

          {/* Asset Details */}
          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Category Name:
              </span>
              <p className="text-gray-600">{viewAsset?.category_name || "-"}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Asset Name:
              </span>
              <p className="text-gray-600">{viewAsset?.asset_name || "-"}</p>
            </div>

            {viewAsset?.description && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Description:
                </span>
                <p className="text-gray-600 text-right max-w-[60%]">
                  {viewAsset.description}
                </p>
              </div>
            )}

            {viewAsset?.date && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Date:
                </span>
                <p className="text-gray-600">{viewAsset.date.slice(0, 10)}</p>
              </div>
            )}

            {/* Optional Status (matches Project UI feel) */}
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Status:
              </span>
              <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
