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
    null
  );

  const handleToggleViewModal = (active: SuppliersT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>
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
        (a: Supplier, b: Supplier) => a.supplierId - b.supplierId
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
        }
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
      1000
    );
    return () => clearTimeout(timer);
  }, [dispatch, handleGetAllSupplier]);

  const filteredSuppliers = suppliers.filter((item) =>
    item.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setPageNo(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredSuppliers.length / selectedValue);

  const paginatedData = filteredSuppliers.slice(
    (pageNo - 1) * selectedValue,
    pageNo * selectedValue
  );

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Supplier" activeFile="Suppliers list" />

      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500
       bg-white overflow-hidden flex flex-col"
      >
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Supplier:{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [{suppliers.length}]
            </span>
          </span>
          <CustomButton
            label="Add supplier"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select value={selectedValue} onChange={handleChangeShowData}>
                {numbers.map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </span>
            <span>entries</span>
          </div>
          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="max-h-[28.4rem] overflow-y-auto mx-2">
          <div
            className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1.5fr] bg-gray-200 text-gray-900
           font-semibold border border-gray-600 text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr#</span>
            <span className="text-left">Supplier Name</span>
            <span className="text-left">Email</span>
            <span className="text-left">Phone No</span>
            <span className="text-left">Address</span>
            <span className="text-center w-40">Actions</span>
          </div>

          {paginatedData.map((item, index) => (
            <div
              key={item.supplierId}
              className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1.5fr] border border-gray-600
                text-gray-800 hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[7px]"
            >
              <span>{index + 1 + (pageNo - 1) * selectedValue}</span>
              <span>{item.supplierName}</span>
              <span>{item.supplierEmail}</span>
              <span>{item.supplierContact}</span>
              <span>{item.supplierAddress}</span>
              <span className="flex items-center gap-1">
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
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
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
          handleIncrementPageButton={handleIncrementPageButton}
          handleDecrementPageButton={handleDecrementPageButton}
          pageNo={pageNo}
        />
      </div>

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
          onClose={() => handleToggleViewModal("DELETE")}
          onConfirm={handleDeleteSupplier}
          message="Are you sure you want to delete this Supplier?"
        />
      )}
    </div>
  );
};
