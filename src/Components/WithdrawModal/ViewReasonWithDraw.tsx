import { Title } from "../Title";
import {
  FaUser,
  FaCalendarAlt,
  FaFileAlt,
  FaHashtag,
} from "react-icons/fa";

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
  if (!viewReason) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-300">
        {/* Header Section */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>VIEW WITHDRAW REASON</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Employee Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Employee Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Employee Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewReason.name}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaHashtag className="text-gray-400" /> Withdrawal ID
                </label>
                <p className="text-gray-800 font-medium">
                  #{viewReason.withdrawalId}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Withdrawal Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Withdrawal Details
            </h3>
            <div className="grid grid-cols-1 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-gray-400" /> Date of Withdrawal
                </label>
                <p className="text-gray-800 font-medium">
                  {viewReason.withdrawDate.slice(0, 10)}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaFileAlt className="text-gray-400" /> Reason for Withdrawal
                </label>
                <div className="mt-1 p-3 bg-gray-50 border border-gray-100 rounded text-gray-700 leading-relaxed italic">
                  "{viewReason.withdrawReason}"
                </div>
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