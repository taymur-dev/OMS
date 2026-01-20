import { Title } from "../Title";
import { ALLPROGRESST } from "../../Pages/Progress";

type ViewProgressProps = {
  setIsOpenModal: () => void;
  viewProgress: ALLPROGRESST | null;
};

export const ViewProgress = ({
  setIsOpenModal,
  viewProgress,
}: ViewProgressProps) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs px-4  flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-900 rounded p-6 shadow-lg">
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setIsOpenModal}
              className="text-white text-lg font-semibold"
            >
              Progress Details
            </Title>
          </div>
          <div className="mt-6 space-y-4">
            {viewProgress?.employeeName && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Employee:
                </span>
                <p className="text-gray-600">{viewProgress.employeeName}</p>
              </div>
            )}

            {viewProgress?.projectName && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Project:
                </span>
                <p className="text-gray-600">{viewProgress.projectName}</p>
              </div>
            )}

            {viewProgress?.date && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Date:
                </span>
                <p className="text-gray-600">
                  {viewProgress.date.slice(0, 10)}
                </p>
              </div>
            )}

            {viewProgress?.note && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Note:
                </span>
                <p className="text-gray-600">{viewProgress.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
