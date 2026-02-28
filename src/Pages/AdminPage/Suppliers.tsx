import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";

import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddSupplier } from "../../Components/SupplierModal/AddSupplier";
import { UpdateSupplier } from "../../Components/SupplierModal/UpdateSupplier";
import { ViewSupplierModal } from "../../Components/SupplierModal/ViewSupplier";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { BASE_URL } from "../../Content/URL";

// Icons to match UsersDetails style
import {
  RiPhoneLine,
  RiMapPinLine,
  RiInboxArchiveLine,
  RiUserFill,
} from "react-icons/ri";

interface Supplier {
  supplierId: number;
  supplierName: string;
  supplierEmail: string;
  supplierContact: string;
  supplierAddress: string;
}

interface SuppliersProps {
  triggerAdd: number;
  externalSearch: string;
  externalPageSize: number;
}

type SuppliersT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

export const Suppliers = ({
  triggerAdd,
  externalSearch,
  externalPageSize,
}: SuppliersProps) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<SuppliersT>("");
  const [pageNo, setPageNo] = useState(1);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  const handleToggleViewModal = (active: SuppliersT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleGetAllSupplier = useCallback(async () => {
    dispatch(navigationStart());
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getSuppliers`, {
        headers: { Authorization: token || "" },
      });
      const sortedData = (res.data.data || []).sort(
        (a: Supplier, b: Supplier) => a.supplierId - b.supplierId,
      );
      setSuppliers(sortedData);
      dispatch(navigationSuccess("All Suppliers"));
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("Failed to fetch suppliers");
    }
  }, [token, dispatch]);

  useEffect(() => {
    document.title = "(OMS) All Suppliers";
    handleGetAllSupplier();
  }, [handleGetAllSupplier]);

  // Sync with external filters
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerAdd && triggerAdd > 0) {
      setIsOpenModal("ADD");
    }
  }, [triggerAdd]);

  const filteredSuppliers = suppliers.filter(
    (item) =>
      item.supplierName.toLowerCase().includes(externalSearch.toLowerCase()) ||
      item.supplierEmail.toLowerCase().includes(externalSearch.toLowerCase()) ||
      item.supplierContact.includes(externalSearch) ||
      item.supplierAddress.toLowerCase().includes(externalSearch.toLowerCase()),
  );

  const totalNum = filteredSuppliers.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedData = filteredSuppliers.slice(startIndex, endIndex);

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(totalNum / externalPageSize);
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  const handleDeleteSupplier = async () => {
    if (!deleteId) return;
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/admin/deleteSupplier/${deleteId}`,
        { headers: { Authorization: token || "" } },
      );
      toast.success(res.data.message);
      handleGetAllSupplier();
      setIsOpenModal("");
      setDeleteId(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete supplier");
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto">
        <div className="min-w-[1000px]">
          {/* Header Row */}
          <div className="px-4 pt-0.5">
            <div
              className="grid grid-cols-[60px_1.5fr_1fr_1.5fr_auto] bg-blue-400 text-white rounded-lg items-center font-bold
    text-xs  tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span>Sr#</span>
              <span>Name & Email</span>
              <span>Contact</span>
              <span>Address</span>
              <span className="text-right pr-10">Actions</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="px-4 py-2">
            {paginatedData.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No records available!</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedData.map((item, index) => (
                  <div
                    key={item.supplierId}
                    className="grid grid-cols-[60px_1.5fr_1fr_1.5fr_auto] items-center p-1 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    {/* Sr# */}
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Name with Avatar placeholder */}
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center
               text-white flex-shrink-0 overflow-hidden border-2 border-gray-100 shadow-sm"
                      >
                        <RiUserFill size={28} />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-semibold text-gray-800 text-sm">
                          {item.supplierName}
                        </span>
                        <span className="truncate text-gray-400 text-xs">
                          {item.supplierEmail}
                        </span>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <RiPhoneLine
                        className="text-purple-700 flex-shrink-0"
                        size={14}
                      />
                      <span>{item.supplierContact}</span>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <RiMapPinLine
                        className="text-orange-400 flex-shrink-0"
                        size={14}
                      />
                      <span className="truncate">{item.supplierAddress}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1 pr-2">
                      <ViewButton
                        handleView={() => {
                          setSelectedSupplier(item);
                          handleToggleViewModal("VIEW");
                        }}
                      />
                      <EditButton
                        handleUpdate={() => {
                          setSelectedSupplier(item);
                          handleToggleViewModal("EDIT");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setDeleteId(item.supplierId);
                          handleToggleViewModal("DELETE");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex flex-row items-center justify-between py-4">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

      {/* Modals */}
      {isOpenModal === "ADD" && (
        <AddSupplier
          setModal={() => handleToggleViewModal("")}
          handleGetAllSupplier={handleGetAllSupplier}
        />
      )}

      {isOpenModal === "EDIT" && selectedSupplier && (
        <UpdateSupplier
          setModal={() => handleToggleViewModal("")}
          supplierData={selectedSupplier}
          refreshSuppliers={handleGetAllSupplier}
        />
      )}

      {isOpenModal === "VIEW" && (
        <ViewSupplierModal
          setModal={() => handleToggleViewModal("")}
          supplier={selectedSupplier}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("")}
          onClose={() => handleToggleViewModal("")}
          onConfirm={handleDeleteSupplier}
          message="Are you sure you want to delete this Supplier?"
        />
      )}
    </div>
  );
};
