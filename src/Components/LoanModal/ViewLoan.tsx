import { Title } from "../Title";
import { UserLoanSummary } from "../../Pages/AdminPage/Loan";
import { FaUser, FaPhoneAlt } from "react-icons/fa";

type ViewLoanProps = {
  setIsOpenModal: () => void;
  viewLoan: UserLoanSummary | null;
};

export const ViewLoan = ({ setIsOpenModal, viewLoan }: ViewLoanProps) => {
  if (!viewLoan) return null;

  // Calculate totals
  const totals = viewLoan.allLoans.reduce(
    (acc, loan) => {
      acc.loan += Number(loan.loanAmount) || 0;
      acc.return += Number(loan.return_amount) || 0;
      acc.deduction += Number(loan.deduction) || 0;
      acc.remaining += Number(loan.remainingAmount) || 0;
      return acc;
    },
    { loan: 0, return: 0, deduction: 0, remaining: 0 },
  );

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-300">
        {/* Header Section */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>VIEW LOAN DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Borrower Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Borrower Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Employee Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewLoan.employee_name || "N/A"}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaPhoneAlt className="text-gray-400" /> Contact
                </label>
                <p className="text-gray-800 font-medium">
                  {viewLoan.contact || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Loan Transaction History */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Transaction History
            </h3>
            <div className="mt-2 overflow-hidden rounded border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-indigo-900 text-white text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2  border-indigo-800">Sr#</th>
                      <th className="px-4 py-2  border-indigo-800">Ref No</th>
                      <th className="px-4 py-2  border-indigo-800">Date</th>
                      <th className="px-4 py-2  border-indigo-800">Loan</th>
                      <th className="px-4 py-2  border-indigo-800">Return</th>
                      <th className="px-4 py-2  border-indigo-800">
                        Deduction
                      </th>
                      <th className="px-4 py-2">Remaining</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {viewLoan.allLoans.map((loan, idx) => (
                      <tr key={loan.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 ">{idx + 1}</td>
                        <td className="px-4 py-2  font-mono text-xs">
                          {loan.refNo || "-"}
                        </td>
                        <td className="px-4 py-2 ">
                          {loan.applyDate
                            ? new Date(loan.applyDate)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                .replace(/ /g, "-")
                            : "-"}
                        </td>
                        <td className="px-4 py-2  font-medium text-blue-700">
                          {loan.loanAmount}
                        </td>
                        <td className="px-4 py-2  text-green-700">
                          {loan.return_amount || 0}
                        </td>
                        <td className="px-4 py-2  text-red-600">
                          {loan.deduction || 0}
                        </td>
                        <td className="px-4 py-2 font-bold">
                          {loan.remainingAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100 font-bold border-t-2 border-gray-300">
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-2 text-right uppercase text-[10px]"
                      >
                        Total
                      </td>
                      <td className="px-4 py-2  text-blue-700">
                        {totals.loan}
                      </td>
                      <td className="px-4 py-2  text-green-700">
                        {totals.return}
                      </td>
                      <td className="px-4 py-2  text-red-600">
                        {totals.deduction}
                      </td>
                      <td className="px-4 py-2 text-indigo-900">
                        {totals.remaining}
                      </td>
                    </tr>
                  </tfoot>
                </table>
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
