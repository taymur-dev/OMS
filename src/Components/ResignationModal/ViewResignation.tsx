import { Title } from "../Title";

type ViewResignationProps = {
  setModal: () => void;
  resignationData: {
    employee_name: string;
    designation: string;
    note: string;
    resignation_date: string;
    approval_status: string;
  };
};

export const ViewResignation = ({
  setModal,
  resignationData,
}: ViewResignationProps) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-900 rounded p-6 shadow-lg">
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Resignation Details
            </Title>
          </div>
          <div className="mt-6 space-y-4">
            {resignationData.employee_name && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Employee Name:
                </span>
                <p className="text-gray-600">{resignationData.employee_name}</p>
              </div>
            )}

            {resignationData.designation && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Designation:
                </span>
                <p className="text-gray-600">{resignationData.designation}</p>
              </div>
            )}

            {resignationData.resignation_date && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Resignation Date:
                </span>
                <p className="text-gray-600">
                  {new Date(
                    resignationData.resignation_date
                  ).toLocaleDateString("en-CA")}
                </p>
              </div>
            )}

            {resignationData.note && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Note:
                </span>
                <p className="text-gray-600">{resignationData.note}</p>
              </div>
            )}

            {resignationData.approval_status && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Approval Status:
                </span>
                <p className="text-gray-600">
                  {resignationData.approval_status}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
