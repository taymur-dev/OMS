import { Title } from "../Title";
import {
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaAlignLeft,
} from "react-icons/fa";

export type AdvanceSalaryType = {
  id: number;
  employee_id: number;
  employee_name: string;
  date: string;
  amount: number;
  approvalStatus: string;
  description: string;
};

type ViewAdvanceSalaryProps = {
  setIsOpenModal: () => void;
  viewAdvance: AdvanceSalaryType | null;
};

export const ViewAdvanceSalary = ({
  setIsOpenModal,
  viewAdvance,
}: ViewAdvanceSalaryProps) => {
  if (!viewAdvance) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>ADVANCE SALARY DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Employee Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-blue-400" /> Employee Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewAdvance.employee_name}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-orange-400" /> Request Date
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(viewAdvance.date)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, "-")}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Financial Details
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaMoneyBillWave className="text-red-400" /> Amount
                </label>
                <p className="text-gray-800 font-medium">
                  {viewAdvance.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCheckCircle className="text-green-400" /> Approval Status
                </label>
                <p
                  className={`font-bold ${
                    viewAdvance.approvalStatus.toLowerCase() === "approved"
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {viewAdvance.approvalStatus}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Additional Notes
            </h3>
            <div className="grid grid-cols-1 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaAlignLeft className="text-yellow-400" /> Description
                </label>
                <p className="text-gray-800 font-medium italic">
                  {viewAdvance.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        </div>

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
