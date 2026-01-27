import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddSupplier } from "../../Components/SupplierModal/AddSupplier";
import { UpdateSupplier } from "../../Components/SupplierModal/UpdateSupplier";
import { ViewSupplierModal } from "../../Components/SupplierModal/ViewSupplier";
import { Footer } from "../../Components/Footer";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { BASE_URL } from "../../Content/URL";

const numbers = [10, 25, 50, 100];

type SuppliersT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

interface Supplier {
  supplierId: number;
  supplierName: string;
  supplierEmail: string;
  supplierContact: string;
  supplierAddress: string;
}

export const Suppliers = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<SuppliersT>("");
  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  const handleToggleViewModal = (active: SuppliersT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedValue(Number(event.target.value));
    setPageNo(1);
  };

  const handleIncrementPageButton = () => {
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    setPageNo((prev) => Math.max(prev - 1, 1));
  };

  const handleGetAllSupplier = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getSuppliers`, {
        headers: { Authorization: token || "" },
      });

      const sortedData = (res.data.data || []).sort(
        (a: Supplier, b: Supplier) => a.supplierId - b.supplierId,
      );

      setSuppliers(sortedData);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("Failed to fetch suppliers");
    }
  }, [token]);

  const handleDeleteSupplier = async () => {
    if (!deleteId) return;
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/admin/deleteSupplier/${deleteId}`,
        {
          headers: { Authorization: token || "" },
        },
      );
      toast.success(res.data.message);
      handleGetAllSupplier();
      setIsOpenModal("");
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete supplier");
    }
  };

  useEffect(() => {
    document.title = "(OMS) All Suppliers";
    dispatch(navigationStart());
    handleGetAllSupplier();
    const timer = setTimeout(
      () => dispatch(navigationSuccess("All Suppliers")),
      1000,
    );
    return () => clearTimeout(timer);
  }, [dispatch, handleGetAllSupplier]);

  const filteredSuppliers = suppliers.filter((item) =>
    item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    setPageNo(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredSuppliers.length / selectedValue);

  const paginatedData = filteredSuppliers.slice(
    (pageNo - 1) * selectedValue,
    pageNo * selectedValue,
  );

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Supplier button as the rightElement */}
        <TableTitle
          tileName="Supplier"
          rightElement={
            <CustomButton
              handleToggle={() => handleToggleViewModal("ADD")}
              label="+ Add Supplier"
            />
          }
        />

        <hr className="border border-b border-gray-200" />

        {/* Top Bar / Filter Row */}
        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            {/* Left Side: Show entries */}
            <div className="text-sm flex items-center">
              <span>Show</span>
              <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
                <select
                  value={selectedValue}
                  onChange={handleChangeShowData}
                  className="bg-transparent outline-none py-1 cursor-pointer"
                >
                  {numbers.map((num, index) => (
                    <option key={index} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </span>
              <span className="hidden xs:inline">entries</span>
            </div>

            {/* Right Side: Search Input */}
            <TableInputField
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto px-2">
          <div className="min-w-[900px]">
            {/* Sticky Table Header - Using grid-cols-6 to match the 6 columns below */}
            <div
              className="grid grid-cols-6 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Supplier Name</span>
              <span>Email</span>
              <span>Phone No</span>
              <span>Address</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedData.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedData.map((item, index) => (
                <div
                  key={item.supplierId}
                  className="grid grid-cols-6 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{index + 1 + (pageNo - 1) * selectedValue}</span>
                  <span className="truncate">{item.supplierName}</span>
                  <span className="truncate">{item.supplierEmail}</span>
                  <span>{item.supplierContact}</span>
                  <span className="truncate">{item.supplierAddress}</span>

                  <span className="flex flex-nowrap justify-center gap-1">
                    <EditButton
                      handleUpdate={() => {
                        setSelectedSupplier(item);
                        handleToggleViewModal("EDIT");
                      }}
                    />
                    <ViewButton
                      handleView={() => {
                        setSelectedSupplier(item);
                        handleToggleViewModal("VIEW");
                      }}
                    />
                    <DeleteButton
                      handleDelete={() => {
                        setDeleteId(item.supplierId);
                        handleToggleViewModal("DELETE");
                      }}
                    />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={
              filteredSuppliers.length === 0
                ? 0
                : (pageNo - 1) * selectedValue + 1
            }
            end={Math.min(pageNo * selectedValue, filteredSuppliers.length)}
            total={filteredSuppliers.length}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={handleDecrementPageButton}
            handleIncrementPageButton={handleIncrementPageButton}
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
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

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
