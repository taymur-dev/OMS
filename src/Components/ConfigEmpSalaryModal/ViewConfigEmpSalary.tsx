import { Title } from "../Title";
import {
  FaUser,
  FaMoneyBillWave,
  FaHome,
  FaCarSide,
  FaPlusSquare,
  FaCalendarAlt,
  FaWallet,
} from "react-icons/fa";

export type ConfigEmpSalaryT = {
  employeeName: string;
  employeeSalary: string;
  empMonthAllowance?: string;
  transportAllowance?: string;
  medicalAllowance?: string;
  totalSalary?: string;
  date?: string;
};

type ViewConfigEmpSalaryProps = {
  setModal: () => void;
  viewSalary: ConfigEmpSalaryT | null;
};

export const ViewConfigEmpSalary = ({
  setModal,
  viewSalary,
}: ViewConfigEmpSalaryProps) => {
  if (!viewSalary) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header Section */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setModal}>EMPLOYEE SALARY DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Basic Info */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Employee Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewSalary.employeeName}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaMoneyBillWave className="text-gray-400" /> Base Salary
                </label>
                <p className="text-gray-800 font-medium">
                  {viewSalary.employeeSalary}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Allowances & Totals */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Salary Components
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              {viewSalary.empMonthAllowance && (
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                    <FaHome className="text-gray-400" /> House Rent
                  </label>
                  <p className="text-gray-800 font-medium">
                    {viewSalary.empMonthAllowance}
                  </p>
                </div>
              )}
              {viewSalary.transportAllowance && (
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                    <FaCarSide className="text-gray-400" /> Transport Allowance
                  </label>
                  <p className="text-gray-800 font-medium">
                    {viewSalary.transportAllowance}
                  </p>
                </div>
              )}
              {viewSalary.medicalAllowance && (
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                    <FaPlusSquare className="text-gray-400" /> Medical Allowance
                  </label>
                  <p className="text-gray-800 font-medium">
                    {viewSalary.medicalAllowance}
                  </p>
                </div>
              )}
              {viewSalary.totalSalary && (
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                    <FaWallet className="text-gray-400" /> Total Salary
                  </label>
                  <p className="text-indigo-700 font-bold">
                    {viewSalary.totalSalary}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: History/Date */}
          {viewSalary.date && (
            <div className="border border-gray-200 rounded-md p-4 relative">
              <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
                Records
              </h3>
              <div className="grid grid-cols-2 gap-y-4 pt-2">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                    <FaCalendarAlt className="text-gray-400" /> Configuration
                    Date
                  </label>
                  <p className="text-gray-800 font-medium">
                    {new Date(viewSalary.date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                    <FaCalendarAlt className="text-gray-400" /> With Effect from
                    Date
                  </label>
                  <p className="text-gray-800 font-medium">
                    {new Date(viewSalary.date)
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
          )}
        </div>

        {/* Footer Section */}
        <div className="bg-indigo-900 p-3 flex justify-end">
          <button
            onClick={setModal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-1 px-8 rounded shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
