import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type Employee = {
  id: number;
  name: string;
  email: string;
  contact: string;
};

type Payment = {
  id: number;
  invoiceNumber: string;
  withdrawAmount: number;
  balance: number;
  date: string;
};

type Refund = {
  id: number;
  invoiceNumber: string;
  refundAmount: number;
  balance: number;
  date: string;
};

type Transaction = {
  invoiceNumber: string;
  debit: number;
  credit: number;
  previousBalance: number;
  netBalance: number;
  date: string;
};

type ViewEmployeeAccountProps = {
  employee: Employee;
  setModal: () => void;
};

export const ViewEmployeeAccount = ({
  employee,
  setModal,
}: ViewEmployeeAccountProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const [paymentsRes, refundsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin/getEmployeePayments/${employee.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/admin/getEmployeeRefunds/${employee.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const payments: Payment[] = paymentsRes.data || [];
      const refunds: Refund[] = refundsRes.data || [];

      // Combine and sort by date
      const combined: Transaction[] = [];

      let previousBalance = 0;

      const sorted = [
        ...payments.map((p) => ({
          invoiceNumber: p.invoiceNumber,
          debit: p.withdrawAmount,
          credit: 0,
          previousBalance,
          netBalance: previousBalance + 0 - p.withdrawAmount,
          date: p.date,
        })),
        ...refunds.map((r) => ({
          invoiceNumber: r.invoiceNumber,
          debit: 0,
          credit: r.refundAmount,
          previousBalance,
          netBalance: previousBalance + r.refundAmount - 0,
          date: r.date,
        })),
      ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Update previousBalance iteratively
      sorted.forEach((tx) => {
        tx.previousBalance = previousBalance;
        tx.netBalance = previousBalance + tx.credit - tx.debit;
        previousBalance = tx.netBalance;
        combined.push(tx);
      });

      setTransactions(combined);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch employee transactions");
    } finally {
      setLoading(false);
    }
  }, [employee.id, token]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[50rem] max-h-[80vh] overflow-y-auto bg-white rounded-xl border border-indigo-500">
        <Title setModal={setModal}>Employee Account Details</Title>

        <div className="p-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <strong>Name:</strong> {employee.name}
            </div>
            <div>
              <strong>Email:</strong> {employee.email}
            </div>
            <div>
              <strong>Contact:</strong> {employee.contact}
            </div>
          </div>

          {/* Transaction Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="border px-2 py-1">Invoice#</th>
                  <th className="border px-2 py-1">Debit</th>
                  <th className="border px-2 py-1">Credit</th>
                  <th className="border px-2 py-1">Previous Balance</th>
                  <th className="border px-2 py-1">Net Balance</th>
                  <th className="border px-2 py-1">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-100 transition duration-200"
                    >
                      <td className="border px-2 py-1">{tx.invoiceNumber}</td>
                      <td className="border px-2 py-1 text-right">
                        {tx.debit.toFixed(2)}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {tx.credit.toFixed(2)}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {tx.previousBalance.toFixed(2)}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {tx.netBalance.toFixed(2)}
                      </td>
                      <td className="border px-2 py-1">
                        {new Date(tx.date).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4">
            <CancelBtn setModal={setModal} />
          </div>
        </div>
      </div>
    </div>
  );
};
