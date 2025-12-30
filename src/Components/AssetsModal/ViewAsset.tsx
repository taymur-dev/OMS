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
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          <Title setModal={setIsOpenModal}>Asset Detail</Title>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Category Name:
              </span>
              <p className="text-gray-600">{viewAsset?.category_name}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Asset Name:
              </span>
              <p className="text-gray-600">{viewAsset?.asset_name}</p>
            </div>

            {viewAsset?.description && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Description:
                </span>
                <p className="text-gray-600">{viewAsset.description}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};
