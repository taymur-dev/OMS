import { Title } from "../Title";

type WithdrawEmployeeT = {
  withdrawalId: number;
  employeeId: number;
  name: string;
  withdrawDate: string;
  withdrawReason: string;
};

type CustomerDetailProps = {
  setIsOpenModal: () => void;
  viewReason: WithdrawEmployeeT | null;
};

export const ViewReasonWithDraw = ({
  setIsOpenModal,
  viewReason,
}: CustomerDetailProps) => {
  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          {/* Title */}
          <Title setModal={setIsOpenModal}>Employee Withdraw Reason</Title>

          {/* Profile Section */}
          <div className="flex items-center gap-6 bg-white p-6 shadow-md rounded-lg">
            {/* User Info */}

            {/* User Details List */}
            <div className=" space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Reason:
                </span>
                <p className="text-gray-600">{viewReason?.withdrawReason}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
