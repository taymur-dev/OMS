import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
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
import { Footer } from "../../Components/Footer";

const numbers = [10, 25, 50, 100];

type SupplierAccountT = "ADD" | "VIEW" | "";

type Supplier = {
  supplierId: number;
  supplierName: string;
  supplierContact: string;
  supplierAddress: string;
};

export const SupplierAccount = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);

  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<SupplierAccountT>("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null,
  );

  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedValue(Number(event.target.value));
    setPageNo(1);
  };

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
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

      setSuppliers(res.data || []);
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
    document.title = "(OMS) Supplier Account";
    dispatch(navigationStart());
    const timer = setTimeout(() => {
      dispatch(navigationSuccess("Supplier Account"));
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Button */}
        <TableTitle
          tileName="Supplier Accounts"
          rightElement={
            <CustomButton
              handleToggle={() => handleToggleViewModal("ADD")}
              label="+ Add Payment"
            />
          }
        />

        <hr className="border border-b border-gray-200" />

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
            {/* Sticky Table Header - Using grid-cols-5 to match your data fields */}
            <div
              className="grid grid-cols-5 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Supplier</span>
              <span>Contact#</span>
              <span>Address</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {suppliers.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              suppliers
                .slice((pageNo - 1) * selectedValue, pageNo * selectedValue)
                .map((supplier, index) => (
                  <div
                    key={supplier.supplierId}
                    className="grid grid-cols-5 border-b border-x border-gray-200 text-gray-800 items-center
                   text-sm p-2 hover:bg-gray-50 transition"
                  >
                    <span>{(pageNo - 1) * selectedValue + index + 1}</span>
                    <span className="truncate">{supplier.supplierName}</span>
                    <span>{supplier.supplierContact}</span>
                    <span className="truncate">{supplier.supplierAddress}</span>
                    <span className="flex flex-nowrap justify-center gap-1">
                      <ViewButton
                        handleView={() =>
                          handleToggleViewModal("VIEW", supplier.supplierId)
                        }
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
              suppliers.length === 0 ? 0 : (pageNo - 1) * selectedValue + 1
            }
            end={Math.min(pageNo * selectedValue, suppliers.length)}
            total={suppliers.length}
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

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
