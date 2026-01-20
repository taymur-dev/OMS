import { Title } from "../Title";
import { UserLoanSummary } from "../../Pages/AdminPage/Loan";

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
    { loan: 0, return: 0, deduction: 0, remaining: 0 }
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs px-4  flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-4xl border border-indigo-900 rounded p-6 shadow-lg">
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setIsOpenModal}
              className="text-white text-lg font-semibold"
            >
              Loan Details
            </Title>
          </div>
          {/* User Info */}
          <div className="mt-4 mb-6 space-y-2">
            {viewLoan.employee_name && (
              <div className="flex">
                <span className="font-semibold">Name:&nbsp;</span>
                <p>{viewLoan.employee_name}</p>
              </div>
            )}
            {viewLoan.contact && (
              <div className="flex">
                <span className="font-semibold">Contact:&nbsp;</span>
                <p>{viewLoan.contact}</p>
              </div>
            )}
          </div>

          {/* Loan Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-left">
              <thead className="bg-indigo-900 text-white">
                <tr>
                  <th className="px-4 py-2 border">Sr#</th>
                  <th className="px-4 py-2 border">Ref No</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Loan</th>
                  <th className="px-4 py-2 border">Return</th>
                  <th className="px-4 py-2 border">Deduction</th>
                  <th className="px-4 py-2 border">Remaining</th>
                </tr>
              </thead>

              <tbody>
                {viewLoan.allLoans.map((loan, idx) => (
                  <tr key={loan.id}>
                    <td className="px-4 py-2 border">{idx + 1}</td>
                    <td className="px-4 py-2 border">{loan.refNo || "-"}</td>
                    <td className="px-4 py-2 border">
                      {loan.applyDate
                        ? new Date(loan.applyDate).toLocaleDateString("en-CA")
                        : "-"}
                    </td>
                    <td className="px-4 py-2 border">{loan.loanAmount}</td>
                    <td className="px-4 py-2 border">
                      {loan.return_amount || 0}
                    </td>
                    <td className="px-4 py-2 border">{loan.deduction || 0}</td>
                    <td className="px-4 py-2 border">{loan.remainingAmount}</td>
                  </tr>
                ))}

                {/* Totals Row */}
                <tr className="bg-gray-100 font-semibold">
                  <td colSpan={3} className="px-4 py-2 border text-right">
                    Total
                  </td>
                  <td className="px-4 py-2 border">{totals.loan}</td>
                  <td className="px-4 py-2 border">{totals.return}</td>
                  <td className="px-4 py-2 border">{totals.deduction}</td>
                  <td className="px-4 py-2 border">{totals.remaining}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
