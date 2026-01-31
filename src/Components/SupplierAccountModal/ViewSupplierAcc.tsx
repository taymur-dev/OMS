import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

import { Title } from "../Title";
import { Loader } from "../LoaderComponent/Loader";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type ViewSupplierAccProps = {
  setModal: () => void;
  supplierId: number;
};

type SupplierAccountEntry = {
  id: number;
  refNo: string;
  debit: number;
  credit: number;
  paymentMethod: string;
  paymentDate: string;
};

type Supplier = {
  supplierName: string;
  supplierContact: string;
  supplierAddress: string;
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


export const ViewSupplierAcc = ({
  setModal,
  supplierId,
}: ViewSupplierAccProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [accounts, setAccounts] = useState<SupplierAccountEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSupplierAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const supplierRes = await axios.get(
        `${BASE_URL}/api/admin/getSupplierById/${supplierId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSupplier(supplierRes.data);

      const accountsRes = await axios.get(
        `${BASE_URL}/api/admin/getSupplierAccounts/${supplierId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAccounts(accountsRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch supplier accounts");
    } finally {
      setLoading(false);
    }
  }, [supplierId, token]);

  useEffect(() => {
    fetchSupplierAccounts();
  }, [fetchSupplierAccounts]);

  const calculateBalances = (accounts: SupplierAccountEntry[]) => {
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
  if (!supplier) return null;

  const accountsWithBalance = calculateBalances(accounts);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-5xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header Section */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setModal}>SUPPLIER ACCOUNT DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Supplier Information (Blueprint Style) */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Supplier Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Supplier Name
                </label>
                <p className="text-gray-800 font-medium">
                  {supplier.supplierName}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaPhoneAlt className="text-gray-400" /> Contact
                </label>
                <p className="text-gray-800 font-medium">
                  {supplier.supplierContact}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaMapMarkerAlt className="text-gray-400" /> Address
                </label>
                <p className="text-gray-800 font-medium">
                  {supplier.supplierAddress || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Ledger/Account Table */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 tracking-wider">
              Account Ledger
            </h3>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-2 text-[10px] font-bold text-gray-500 uppercase">
                      Sr#
                    </th>
                    <th className="p-2 text-[10px] font-bold text-gray-500 uppercase">
                      Ref No
                    </th>
                    <th className="p-2 text-[10px] font-bold text-gray-500 uppercase text-red-600">
                      Debit (-)
                    </th>
                    <th className="p-2 text-[10px] font-bold text-gray-500 uppercase text-green-600">
                      Credit (+)
                    </th>
                    <th className="p-2 text-[10px] font-bold text-gray-500 uppercase">
                      Prev Bal
                    </th>
                    <th className="p-2 text-[10px] font-bold text-gray-500 uppercase">
                      Net Bal
                    </th>
                    <th className="p-2 text-[10px] font-bold text-gray-500 uppercase">
                      Payment Meyhod
                    </th>
                    <th className="p-2 text-[10px] font-bold text-gray-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {accountsWithBalance.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-center text-gray-400 italic"
                      >
                        No account entries found
                      </td>
                    </tr>
                  ) : (
                    accountsWithBalance.map((acc, index) => (
                      <tr
                        key={acc.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-2 text-gray-600">{index + 1}</td>
                        <td className="p-2 font-medium text-indigo-900">
                          {acc.refNo}
                        </td>
                        <td className="p-2 text-gray-700">
                          {Number(acc.debit).toLocaleString()}
                        </td>
                        <td className="p-2 text-gray-700">
                          {Number(acc.credit).toLocaleString()}
                        </td>
                        <td className="p-2 text-gray-500">
                          {Number(acc.prevBalance).toLocaleString()}
                        </td>
                        <td
                          className={`p-2 font-bold ${acc.netBalance < 0 ? "text-red-600" : "text-green-700"}`}
                        >
                          {Number(acc.netBalance).toLocaleString()}
                        </td>

                        <td
                          className={`p-2 font-bold`}
                        >
                          {(acc.paymentMethod)}
                        </td>

                        <td
                          className={`p-2 font-bold`}
                        >
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

        {/* Footer Section */}
        <div className="bg-indigo-900 p-3 flex justify-end">
          <button
            onClick={setModal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-1 px-8 rounded shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
