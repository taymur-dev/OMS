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
    null
  );

  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedValue(Number(event.target.value));
    setPageNo(1);
  };

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  const handleToggleViewModal = (
    type: SupplierAccountT,
    supplierId?: number
  ) => {
    setIsOpenModal((prev) => (prev === type ? "" : type));
    if (supplierId !== undefined) setSelectedSupplierId(supplierId);
    else setSelectedSupplierId(null);
  };

  const fetchSupplierAccounts = useCallback(async () => {
    try {
      dispatch(navigationStart());

      const res = await axios.get(
        `${BASE_URL}/api/admin/getSupplierAcc`,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );

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
    <div className="w-full mx-2">
      <TableTitle
        tileName="Supplier Accounts"
        activeFile="Supplier Accounts list"
      />

      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500
        bg-white overflow-hidden flex flex-col"
      >
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Supplier Accounts:{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              {suppliers.length}
            </span>
          </span>

          <CustomButton
            label="Add Account"
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
            className="grid grid-cols-5 bg-gray-200 text-gray-900 font-semibold
            border border-gray-600 text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr#</span>
            <span>Supplier</span>
            <span>Contact#</span>
            <span>Address</span>
            <span className="text-center w-40">Actions</span>
          </div>

          {suppliers.length === 0 ? (
            <div className="text-center text-gray-500 p-4 col-span-5">
              No supplier accounts found
            </div>
          ) : (
            suppliers.map((supplier, index) => (
              <div
                key={supplier.supplierId}
                className="grid grid-cols-5 border border-gray-600 text-gray-800
                hover:bg-gray-100 transition duration-200 text-sm items-center p-[7px]"
              >
                <span>{index + 1}</span>
                <span>{supplier.supplierName}</span>
                <span>{supplier.supplierContact}</span>
                <span>{supplier.supplierAddress}</span>

                <span className="flex items-center gap-1">
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

      <div className="flex items-center justify-between mt-2">
        <ShowDataNumber
          start={suppliers.length === 0 ? 0 : 1}
          end={suppliers.length}
          total={suppliers.length}
        />

        <Pagination
          handleIncrementPageButton={handleIncrementPageButton}
          handleDecrementPageButton={handleDecrementPageButton}
          pageNo={pageNo}
        />
      </div>

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
