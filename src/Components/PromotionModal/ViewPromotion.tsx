import { Title } from "../Title";

type PromotionType = {
  employee_name: string;
  current_designation: string;
  requested_designation: string;
  note: string;
  date: string;
  approval: string;
};

type ViewPromotionModalProps = {
  setModal: () => void;
  promotionData: PromotionType;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

export const ViewPromotion = ({
  setModal,
  promotionData,
}: ViewPromotionModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-900 rounded p-6 shadow-lg">
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Employee Promotion Details
            </Title>
          </div>
          <div className="mt-6 space-y-4">
            {promotionData.employee_name && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Employee:
                </span>
                <p className="text-gray-600">{promotionData.employee_name}</p>
              </div>
            )}

            {promotionData.current_designation && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Current Designation:
                </span>
                <p className="text-gray-600">
                  {promotionData.current_designation}
                </p>
              </div>
            )}

            {promotionData.requested_designation && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Requested Designation:
                </span>
                <p className="text-gray-600">
                  {promotionData.requested_designation}
                </p>
              </div>
            )}

            {promotionData.approval && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Approval Status:
                </span>
                <p className="text-gray-600">{promotionData.approval}</p>
              </div>
            )}

            {promotionData.note && (
              <div className="flex justify-between border-b pb-2 gap-4">
                <span className="text-lg font-semibold text-gray-800">
                  Note:
                </span>
                <p className="text-gray-600 text-right max-w-[60%] whitespace-pre-wrap">
                  {promotionData.note}
                </p>
              </div>
            )}

            {promotionData.date && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Date:
                </span>
                <p className="text-gray-600">
                  {formatDate(promotionData.date)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
