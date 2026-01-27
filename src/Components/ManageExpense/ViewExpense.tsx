import { Title } from "../Title";
import {
  FaTag,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";

type allExpenseT = {
  expenseName: string;
  expenseCategoryId: number;
  categoryName: string;
  date: string;
  expenseStatus: string;
  amount: number | string;
};

type CustomerDetailProps = {
  setIsOpenModal: () => void;
  viewExpense: allExpenseT | null;
};

export const ViewExpense = ({
  setIsOpenModal,
  viewExpense,
}: CustomerDetailProps) => {
  if (!viewExpense) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-3xl bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-300">
        {/* Header Section */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>EXPENSE DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Classification */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Classification
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaTag className="text-gray-400" />
                  Expense Category
                </label>
                <p className="text-gray-800 font-medium">
                  {viewExpense.categoryName}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaFileInvoiceDollar className="text-gray-400" /> Expense Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewExpense.expenseName}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Financial Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Financial Details
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaMoneyBillWave className="text-gray-400" /> Amount
                </label>
                <p className="text-indigo-700 font-bold text-lg">
                  ${Number(viewExpense.amount).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaInfoCircle className="text-gray-400" /> Status
                </label>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    viewExpense.expenseStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {viewExpense.expenseStatus || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Timeline */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Timeline
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-gray-400" /> Transaction Date
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(viewExpense.date)
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
