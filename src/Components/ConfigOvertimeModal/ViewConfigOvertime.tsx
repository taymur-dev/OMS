import { Title } from "../Title";
import {
  FaClock,
  FaMoneyBillWave,
  FaHashtag,
  FaInfoCircle,
} from "react-icons/fa";

type allOvertimeT = {
  id: number;
  overtimeType: string;
  amount: number | string;
};

interface ViewOvertimeProps {
  setModal: () => void;
  data: allOvertimeT | null;
}

export const ViewConfigOvertime = ({ setModal, data }: ViewOvertimeProps) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
        {/* Header Section */}
        <div className="bg-white rounded-xl border-t-5 border-blue-400">
          <div className="text-white">
            <Title setModal={setModal}>VIEW OVERTIME CONFIGURATION</Title>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              Configuration Identity
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaHashtag className="text-gray-400" /> Config ID
                </label>
                <p className="text-gray-800 font-medium">#{data.id}</p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaInfoCircle className="text-gray-400" /> Status
                </label>
                <p className="text-green-600 font-bold text-xs">ACTIVE</p>
              </div>
            </div>
          </div>

          {/* Section 2: Rate Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              Work & Payment Details
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaClock className="text-gray-400" /> Overtime Type
                </label>
                <p className="text-gray-800 font-semibold text-lg">
                  {data.overtimeType}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaMoneyBillWave className="text-gray-400" /> Amount / Rate
                </label>
                <p className="text-blue-600 font-bold text-lg">
                  {Number(data.amount).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Optional: Calculation logic summary */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-[11px] text-blue-700 leading-relaxed">
              <strong>Note:</strong> This configuration is applied to employee
              payroll calculations. The rate is fixed based on the selected
              overtime hour type.
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-50 px-4 py-6 flex justify-end rounded-b-xl border-t border-gray-100">
          <button
            onClick={setModal}
            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 text-sm font-semibold py-1 px-5 rounded shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
