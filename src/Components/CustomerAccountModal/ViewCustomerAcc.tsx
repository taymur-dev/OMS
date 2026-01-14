import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { Loader } from "../LoaderComponent/Loader";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type ViewCustomerAccProps = {
  setModal: () => void;
  customerId: number;
};

type CustomerAccountEntry = {
  id: number;
  refNo: string;
  debit: number;
  credit: number;
};

type Customer = {
  customerName: string;
  customerContact: string;
  customerAddress: string;
};

export const ViewCustomerAcc = ({
  setModal,
  customerId,
}: ViewCustomerAccProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [accounts, setAccounts] = useState<CustomerAccountEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomerAccounts = useCallback(async () => {
    try {
      setLoading(true);

      const customerRes = await axios.get(
        `${BASE_URL}/api/admin/getCustomerById/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCustomer(customerRes.data);

      const accountsRes = await axios.get(
        `${BASE_URL}/api/admin/getCustomerAccounts/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAccounts(accountsRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch customer accounts");
    } finally {
      setLoading(false);
    }
  }, [customerId, token]);

  useEffect(() => {
    fetchCustomerAccounts();
  }, [fetchCustomerAccounts]);

  const calculateBalances = (accounts: CustomerAccountEntry[]) => {
    let runningBalance = 0;

    return accounts.map((acc) => {
      const balance = Number(acc.debit) - Number(acc.credit);
      const prevBalance = runningBalance;
      const netBalance = prevBalance + balance;

      runningBalance = netBalance;

      return {
        ...acc,
        balance,
        prevBalance,
        netBalance,
      };
    });
  };

  if (loading) return <Loader />;

  if (!customer) return null;

  const accountsWithBalance = calculateBalances(accounts);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[60rem] max-h-[80vh] overflow-y-auto bg-white rounded-xl border border-indigo-500 p-4">
        <Title setModal={setModal}>Customer Account Details</Title>

        <div className="my-4 grid line-height-4">
          <div>
            <span className="font-semibold">Name: </span>{" "}
            {customer.customerName}
          </div>
          <div>
            <span className="font-semibold">Contact: </span>{" "}
            {customer.customerContact}
          </div>
          <div>
            <span className="font-semibold">Address: </span>{" "}
            {customer.customerAddress}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div
            className="grid grid-cols-7 bg-indigo-500 text-white font-semibold border border-gray-600
           text-sm p-2 sticky top-0 z-10"
          >
            <span>Sr#</span>
            <span>Ref No</span>
            <span>Debit</span>
            <span>Credit</span>
            <span>Balance</span>
            <span>Prev Balance</span>
            <span>Net Balance</span>
          </div>

          {accountsWithBalance.length === 0 ? (
            <div className="text-center text-gray-500 p-4 col-span-7">
              No account entries found
            </div>
          ) : (
            accountsWithBalance.map((acc, index) => (
              <div
                key={acc.id}
                className="grid grid-cols-7 border border-gray-600 text-gray-800 text-sm p-2 hover:bg-gray-100 transition"
              >
                <span>{index + 1}</span>
                <span>{acc.refNo}</span>
                <span>{Number(acc.debit).toFixed(2)}</span>
                <span>{Number(acc.credit).toFixed(2)}</span>
                <span>{Number(acc.balance).toFixed(2)}</span>
                <span>{Number(acc.prevBalance).toFixed(2)}</span>
                <span>{Number(acc.netBalance).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center mt-4">
          <CancelBtn setModal={setModal} />
        </div>
      </div>
    </div>
  );
};
