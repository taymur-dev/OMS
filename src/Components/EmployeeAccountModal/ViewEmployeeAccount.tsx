import { useEffect, useCallback, useState } from "react";
import axios from "axios";

import { Title } from "../Title";
import { CancelBtn } from "../CustomButtons/CancelBtn";
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
  debit: number;
  credit: number;
  paymentMethod: string;
  payment_date: string;
};

export const ViewEmployeeAccount = ({ setModal, employee }: Props) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [accounts, setAccounts] = useState<AccountEntry[]>([]);
  const [loading, setLoading] = useState(false);

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
      <div className="w-[42rem] bg-white rounded-xl border border-indigo-500">
        <Title setModal={setModal}>Employee Account Details</Title>

        {/* Employee Info */}
        <div className="mx-4 text-sm text-gray-800 space-y-1">
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Contact:</strong> {employee.contact}</p>
        </div>

        {/* Account Entries */}
        <div className="mx-2 my-3 max-h-[22rem] overflow-y-auto border">
          <div className="grid grid-cols-5 bg-gray-200 font-semibold text-sm p-2">
            <span>Sr#</span>
            <span>Debit</span>
            <span>Credit</span>
            <span>Method</span>
            <span>Date</span>
          </div>

          {accounts.length === 0 && (
            <p className="text-center text-gray-500 p-3">
              No account records found
            </p>
          )}

          {accounts.map((acc, idx) => (
            <div
              key={acc.id}
              className="grid grid-cols-5 text-sm border-t p-2"
            >
              <span>{idx + 1}</span>
              <span>{acc.debit || "-"}</span>
              <span>{acc.credit || "-"}</span>
              <span>{acc.paymentMethod}</span>
              <span>{acc.payment_date}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center m-2">
          <CancelBtn setModal={setModal} />
        </div>
      </div>
    </div>
  );
};



