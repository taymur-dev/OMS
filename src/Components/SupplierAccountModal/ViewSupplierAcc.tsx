import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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
};

type Supplier = {
  supplierName: string;
  supplierContact: string;
  supplierAddress: string;
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSupplier(supplierRes.data);

      const accountsRes = await axios.get(
        `${BASE_URL}/api/admin/getSupplierAccounts/${supplierId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

      return {
        ...acc,
        balance,
        prevBalance,
        netBalance,
      };
    });
  };

  if (loading) return <Loader />;
  if (!supplier) return null;

  const accountsWithBalance = calculateBalances(accounts);

  // return (
  //   <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-10">
  //     <div className="w-[60rem] max-h-[80vh] overflow-y-auto bg-white rounded border border-indigo-900 p-4">
  //       <div className="bg-indigo-900 rounded px-6">
  //         <Title
  //           setModal={setModal}
  //           className="text-white text-lg font-semibold"
  //         >
  //           Supplier Account Details
  //         </Title>
  //       </div>
  //       <div className="my-4 grid line-height-4">
  //         <div>
  //           <span className="font-semibold">Name: </span>
  //           {supplier.supplierName}
  //         </div>
  //         <div>
  //           <span className="font-semibold">Contact: </span>
  //           {supplier.supplierContact}
  //         </div>
  //         <div>
  //           <span className="font-semibold">Address: </span>
  //           {supplier.supplierAddress}
  //         </div>
  //       </div>

  //       <div className="overflow-x-auto">
  //         <div
  //           className="grid grid-cols-7 bg-indigo-900 text-white font-semibold
  //           border border-gray-600 text-sm p-2 sticky top-0 z-10"
  //         >
  //           <span>Sr#</span>
  //           <span>Ref No</span>
  //           <span>Debit</span>
  //           <span>Credit</span>
  //           <span>Balance</span>
  //           <span>Prev Balance</span>
  //           <span>Net Balance</span>
  //         </div>

  //         {accountsWithBalance.length === 0 ? (
  //           <div className="text-center text-gray-500 p-4 col-span-7">
  //             No account entries found
  //           </div>
  //         ) : (
  //           accountsWithBalance.map((acc, index) => (
  //             <div
  //               key={acc.id}
  //               className="grid grid-cols-7 border border-gray-600
  //               text-gray-800 text-sm p-2 hover:bg-gray-100 transition"
  //             >
  //               <span>{index + 1}</span>
  //               <span>{acc.refNo}</span>
  //               <span>{Number(acc.debit).toFixed(2)}</span>
  //               <span>{Number(acc.credit).toFixed(2)}</span>
  //               <span>{Number(acc.balance).toFixed(2)}</span>
  //               <span>{Number(acc.prevBalance).toFixed(2)}</span>
  //               <span>{Number(acc.netBalance).toFixed(2)}</span>
  //             </div>
  //           ))
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 px-2 sm:px-4">
    <div className="w-full max-w-5xl max-h-[80vh] overflow-y-auto bg-white rounded-xl border border-indigo-900 p-4">
      
      {/* Header */}
      <div className="bg-indigo-900 rounded px-4 py-2">
        <Title setModal={setModal} className="text-white text-lg font-semibold">
          Supplier Account Details
        </Title>
      </div>

      {/* Supplier Info */}
      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800">
        <div>
          <span className="font-semibold">Name: </span>
          {supplier.supplierName}
        </div>
        <div>
          <span className="font-semibold">Contact: </span>
          {supplier.supplierContact}
        </div>
        <div className="sm:col-span-2">
          <span className="font-semibold">Address: </span>
          {supplier.supplierAddress}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Table Header */}
          <div
            className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr] 
                       bg-indigo-900 text-white font-semibold text-sm p-2 sticky top-0 z-10"
          >
            <span>Sr#</span>
            <span>Ref No</span>
            <span>Debit</span>
            <span>Credit</span>
            <span>Balance</span>
            <span>Prev Balance</span>
            <span>Net Balance</span>
          </div>

          {/* Table Body */}
          {accountsWithBalance.length === 0 ? (
            <div className="text-center text-gray-500 p-4 col-span-7">
              No account entries found
            </div>
          ) : (
            accountsWithBalance.map((acc, index) => (
              <div
                key={acc.id}
                className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr] border border-gray-300
                           text-gray-800 text-sm p-2 hover:bg-gray-100 transition"
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
      </div>
    </div>
  </div>
);


};
