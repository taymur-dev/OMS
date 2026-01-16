import { useEffect, useCallback, useState } from "react";
import axios from "axios";

import { Title } from "../Title";
import { Loader } from "../LoaderComponent/Loader";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type Props = {
  setModal: () => void;
  employee: {
    id: number;
    name: string;
    email: string;
    contact: string;
  };
};

type AccountEntry = {
  id: number;
  refNo: string;
  debit: number;
  credit: number;
  payment_method: string;
  payment_date: string;
};

export const ViewEmployeeAccount = ({ setModal, employee }: Props) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [accounts, setAccounts] = useState<AccountEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("sv-SE");
  };

  const fetchEmployeeAccounts = useCallback(async () => {
    if (!employee?.id) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/getEmployeeAccount/${employee.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAccounts(res.data.accounts || []);
    } catch (error) {
      console.error("Failed to fetch employee account details", error);
    } finally {
      setLoading(false);
    }
  }, [employee.id, token]);

  useEffect(() => {
    fetchEmployeeAccounts();
  }, [fetchEmployeeAccounts]);

  if (loading) return <Loader />;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[56rem] bg-white rounded border border-indigo-900">
        <div className="bg-indigo-900 rounded px-6">
          <Title
            setModal={setModal}
            className="text-white text-lg font-semibold"
          >
            Employee Account Details
          </Title>
        </div>
        {/* Employee Info */}
        <div className="mx-4 text-sm text-gray-800 space-y-1">
          <p>
            <strong>Name:</strong> {employee.name}
          </p>
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Contact:</strong> {employee.contact}
          </p>
        </div>

        {/* Account Entries */}
        <div className="mx-2 my-3 max-h-[22rem] overflow-y-auto overflow-x-hidden border">
          <div className="grid grid-cols-9 bg-indigo-900 text-white font-semibold text-sm p-2 sticky top-0 z-10">
            <span>Sr#</span>
            <span>Ref No</span>
            <span>Debit</span>
            <span>Credit</span>
            <span>Prev Balance</span>
            <span>Balance</span>
            <span>Net Balance</span>
            <span>Payment</span>
            <span>Date</span>
          </div>

          {accounts.length === 0 && (
            <p className="text-center text-gray-500 p-3">
              No account records found
            </p>
          )}

          {accounts.map((acc, idx) => {
            const previousBalance =
              idx === 0
                ? 0
                : accounts[idx - 1].debit - accounts[idx - 1].credit;

            const balance = acc.debit - acc.credit;
            const netBalance = previousBalance - balance;

            return (
              <div
                key={acc.id}
                className="grid grid-cols-9 text-sm border-t p-2"
              >
                <span>{idx + 1}</span>
                <span>{acc.refNo || "-"}</span>
                <span>{acc.debit || "-"}</span>
                <span>{acc.credit || "-"}</span>
                <span>{previousBalance}</span>
                <span className="font-medium">{balance}</span>
                <span
                  className={
                    netBalance < 0
                      ? "text-red-600 font-medium"
                      : "text-green-600 font-medium"
                  }
                >
                  {netBalance}
                </span>
                <span>{acc.payment_method}</span>
                <span>{formatDate(acc.payment_date)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
