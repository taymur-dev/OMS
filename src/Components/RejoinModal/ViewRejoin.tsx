import { Title } from "../Title";
import { REJOIN_T } from "../../Pages/AdminPage/Rejoin";

type ViewRejoinProps = {
  setIsOpenModal: () => void;
  viewRejoin: REJOIN_T | null;
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

export const ViewRejoin = ({ setIsOpenModal, viewRejoin }: ViewRejoinProps) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-900 rounded p-6 shadow-lg">
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setIsOpenModal}
              className="text-white text-lg font-semibold"
            >
              Rejoining Details
            </Title>
          </div>
          <div className="mt-6 space-y-4">
            {viewRejoin?.employee_name && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Employee:
                </span>
                <p className="text-gray-600">{viewRejoin.employee_name}</p>
              </div>
            )}

            {viewRejoin?.designation && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Designation:
                </span>
                <p className="text-gray-600">{viewRejoin.designation}</p>
              </div>
            )}

            {viewRejoin?.resignation_date && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Resignation Date:
                </span>
                <p className="text-gray-600">
                  {formatDate(viewRejoin.resignation_date)}
                </p>
              </div>
            )}

            {viewRejoin?.rejoinRequest_date && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Rejoin Date:
                </span>
                <p className="text-gray-600">
                  {formatDate(viewRejoin.rejoinRequest_date)}
                </p>
              </div>
            )}

            {viewRejoin?.approval_status && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Approval Status:
                </span>
                <p className="text-gray-600">{viewRejoin.approval_status}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
