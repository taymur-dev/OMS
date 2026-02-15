import { Title } from "../Title";
import {
  FaUser,
  FaMoneyBillWave,
  FaCreditCard,
  FaCalendarAlt,
  FaFileAlt,
} from "react-icons/fa";

export type PaymentDetailT = {
  customerId: number;
  amount: string;
  paymentMethod: string;
  description?: string;
  date: string;
};

type ViewPaymentProps = {
  setIsOpenModal: () => void;
  viewPayment: PaymentDetailT | null;
};

export const ViewPayment = ({
  setIsOpenModal,
  viewPayment,
}: ViewPaymentProps) => {
  if (!viewPayment) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>VIEW PAYMENT</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Transaction Summary */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Transaction Summary
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Customer Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewPayment.customerId}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaMoneyBillWave className="text-gray-400" /> Amount
                </label>
                <p className="text-green-700 font-bold">{viewPayment.amount}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Logistics */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Payment Logistics
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCreditCard className="text-gray-400" /> Method
                </label>
                <p className="text-gray-800 font-medium uppercase">
                  {viewPayment.paymentMethod}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-gray-400" /> Transaction Date
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(viewPayment.date) 
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

          {/* Section 3: Additional Details (Conditional) */}
          {viewPayment.description && (
            <div className="border border-gray-200 rounded-md p-4 relative">
              <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
                Notes
              </h3>
              <div className="pt-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaFileAlt className="text-gray-400" /> Description
                </label>
                <p className="text-gray-800 font-medium">
                  {viewPayment.description}
                </p>
              </div>
            </div>
          )}
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
