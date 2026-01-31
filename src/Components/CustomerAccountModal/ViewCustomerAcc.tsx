import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUser,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";

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
  paymentMethod: string;
  paymentDate: string;
};

type Customer = {
  customerName: string;
  customerContact: string;
  customerAddress: string;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");
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
      const [customerRes, accountsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin/getCustomerById/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/admin/getCustomerAccounts/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setCustomer(customerRes.data);
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

      return { ...acc, balance, prevBalance, netBalance };
    });
  };

  if (loading) return <Loader />;
  if (!customer) return null;

  const accountsWithBalance = calculateBalances(accounts);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-5xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setModal}>CUSTOMER ACCOUNT DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Customer Basic Info */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Name
                </label>
                <p className="text-gray-800 font-medium">
                  {customer.customerName}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaPhoneAlt className="text-gray-400" /> Contact
                </label>
                <p className="text-gray-800 font-medium">
                  {customer.customerContact}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaMapMarkerAlt className="text-gray-400" /> Address
                </label>
                <p
                  className="text-gray-800 font-medium truncate pr-2"
                  title={customer.customerAddress}
                >
                  {customer.customerAddress || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Ledger Table */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Transaction Ledger
            </h3>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-indigo-50 text-indigo-900 text-[11px] uppercase font-bold border-b border-gray-200">
                    <th className="px-3 py-2">Sr#</th>
                    <th className="px-3 py-2">Ref No</th>
                    <th className="px-3 py-2 text-right">Debit</th>
                    <th className="px-3 py-2 text-right">Credit</th>
                    <th className="px-3 py-2 text-right">Balance</th>
                    <th className="px-3 py-2 text-right">Prev Balance</th>
                    <th className="px-3 py-2 text-right">Net Balance</th>
                    <th className="px-3 py-2 text-right">Payment Method</th>
                    <th className="px-3 py-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {accountsWithBalance.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-8 text-gray-400 italic"
                      >
                        No transactions found for this customer.
                      </td>
                    </tr>
                  ) : (
                    accountsWithBalance.map((acc, index) => (
                      <tr
                        key={acc.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-2 text-gray-500">{index + 1}</td>
                        <td className="px-3 py-2 font-semibold text-gray-700">
                          {acc.refNo}
                        </td>
                        <td className="px-3 py-2 text-right text-red-600">
                          {Number(acc.debit).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right text-green-600">
                          {Number(acc.credit).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right font-medium">
                          {Number(acc.balance).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-500">
                          {Number(acc.prevBalance).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-indigo-900 bg-indigo-50/30">
                          {Number(acc.netBalance).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right font-medium">{acc.paymentMethod}</td>
                        <td className="px-3 py-2 text-right font-medium">
                          {formatDate(acc.paymentDate)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-indigo-900 p-3 flex justify-between items-center">
          <div className="text-white/70 text-[10px] flex items-center gap-2 px-2">
            <FaFileInvoiceDollar /> Total Entries: {accounts.length}
          </div>
          <button
            onClick={setModal}
            className="bg-gray-200 hover:bg-white text-gray-800 text-sm font-semibold py-1 px-8 rounded shadow-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
