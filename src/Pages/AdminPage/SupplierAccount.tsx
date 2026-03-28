import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { AddSupplierAccount } from "../../Components/SupplierAccountModal/AddSupplierAcc";
import { ViewSupplierAcc } from "../../Components/SupplierAccountModal/ViewSupplierAcc";

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { RiInboxArchiveLine } from "react-icons/ri";

type SupplierAccountT = "ADD" | "VIEW" | "";

type Supplier = {
  supplierId: number;
  supplierName: string;
  supplierContact: string;
  supplierAddress: string;
};

interface SupplierAccountProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const SupplierAccount = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: SupplierAccountProps) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);

  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<SupplierAccountT>("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null,
  );

  const [pageNo, setPageNo] = useState(1);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Sync page number when search or page size changes
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(filteredSuppliers.length / externalPageSize);
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  const handleToggleViewModal = (
    type: SupplierAccountT,
    supplierId?: number,
  ) => {
    setIsOpenModal((prev) => (prev === type ? "" : type));
    if (supplierId !== undefined) setSelectedSupplierId(supplierId);
    else setSelectedSupplierId(null);
  };

  const fetchSupplierAccounts = useCallback(async () => {
    try {
      dispatch(navigationStart());
      const res = await axios.get(`${BASE_URL}/api/admin/getSupplierAcc`, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      setSuppliers((res.data || []).reverse());
      dispatch(navigationSuccess("Supplier Account"));
    } catch (error) {
      console.error("Error fetching supplier accounts:", error);
      dispatch(navigationSuccess("Supplier Account"));
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    fetchSupplierAccounts();
  }, [fetchSupplierAccounts]);

  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("ADD");
    }
  }, [triggerModal]);

  useEffect(() => {
    document.title = "(OMS) Supplier Account";
  }, []);

  if (loader) return <Loader />;

  // Filtering Logic
  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.supplierName.toLowerCase().includes(externalSearch.toLowerCase()) ||
      s.supplierContact.includes(externalSearch) ||
      s.supplierAddress.toLowerCase().includes(externalSearch.toLowerCase()),
  );

  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedSuppliers = filteredSuppliers.slice(
    startIndex,
    startIndex + externalPageSize,
  );

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          {" "}
          {/* Increased min-width to match UsersDetails */}
          {/* 1. Header Row - Aligned with UsersDetails */}
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[60px_1fr_1fr_1fr_auto]
            bg-blue-400 text-white rounded-lg items-center font-bold
            text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span className="text-left">Sr#</span>
              <span className="text-left">Supplier Name</span>
              <span className="text-left">Contact#</span>
              <span className="text-left">Address</span>
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>
          {/* 2. Body Section */}
          <div className="px-0.5 sm:px-1 py-2">
            {filteredSuppliers.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No records available!</p>
                <p className="text-sm">Try adjusting your search.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedSuppliers.map((supplier, index) => (
                  <div
                    key={supplier.supplierId}
                    className="grid grid-cols-[60px_1fr_1fr_1fr_auto]
                  items-center px-3 py-2 gap-3 text-sm bg-white 
                  border border-gray-100 rounded-lg 
                  hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    {/* Serial Number */}
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Supplier Name (Icon removed, styling aligned) */}
                    <div className="flex items-center min-w-0">
                      <span className="truncate text-gray-800">
                        {supplier.supplierName}
                      </span>
                    </div>

                    {/* Contact (Icon removed) */}
                    <div className="text-gray-600 truncate">
                      {supplier.supplierContact}
                    </div>

                    {/* Address (Icon removed) */}
                    <div className="text-gray-600 truncate">
                      {supplier.supplierAddress}
                    </div>

                    {/* Actions (Aligned with UsersDetails width) */}
                    <div className="flex items-center justify-end gap-1 w-[140px] pr-5">
                      <ViewButton
                        handleView={() =>
                          handleToggleViewModal("VIEW", supplier.supplierId)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Pagination Section */}
      <div className="flex flex-row items-center justify-between p-1 mt-auto">
        <ShowDataNumber
          start={filteredSuppliers.length === 0 ? 0 : startIndex + 1}
          end={Math.min(
            startIndex + externalPageSize,
            filteredSuppliers.length,
          )}
          total={filteredSuppliers.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

      {/* --- MODALS --- */}
      {isOpenModal === "ADD" && (
        <AddSupplierAccount
          setModal={() => handleToggleViewModal("")}
          refreshData={fetchSupplierAccounts}
        />
      )}

      {isOpenModal === "VIEW" && selectedSupplierId && (
        <ViewSupplierAcc
          setModal={() => handleToggleViewModal("")}
          supplierId={selectedSupplierId}
        />
      )}
    </div>
  );
};
