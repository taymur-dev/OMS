import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";

import { Loader } from "../../Components/LoaderComponent/Loader";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";

import { AddCustomerAccount } from "../../Components/CustomerAccountModal/AddCustomerAcc";
import { ViewCustomerAcc } from "../../Components/CustomerAccountModal/ViewCustomerAcc";

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import axios from "axios";
import { BASE_URL } from "../../Content/URL";


const numbers = [10, 25, 50, 100];

type CustomerAccountT = "ADD" | "VIEW" | "";

type Customer = {
  id: number;
  customerName: string;
  customerContact: string;
  customerAddress: string;
};

export const CustomerAccount = ({ triggerModal }: { triggerModal: number }) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<CustomerAccountT>("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedValue(Number(event.target.value));
  };

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  const handleToggleViewModal = (
    type: CustomerAccountT,
    customerId?: number
  ) => {
    setIsOpenModal((prev) => (prev === type ? "" : type));
    if (customerId !== undefined) setSelectedCustomerId(customerId);
    else setSelectedCustomerId(null);
  };

  const { currentUser } = useAppSelector((state) => state.officeState);

  const fetchCustomers = useCallback(async () => {
    try {
      dispatch(navigationStart());

      const response = await axios.get(`${BASE_URL}/api/admin/getCustomerAcc`, {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });

      console.log("Customer Data:", response.data);
      setCustomers(response.data || []);

      dispatch(navigationSuccess("Customer Account"));
    } catch (error) {
      console.error("Error fetching customer accounts:", error);
      dispatch(navigationSuccess("Customer Account"));
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
      if (triggerModal > 0) {
        setIsOpenModal("ADD");
      }
    }, [triggerModal]);

  useEffect(() => {
    document.title = "(OMS) Customer Account";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Customer Account"));
    }, 1000);
  }, [dispatch]);

  if (loader) return <Loader />;

   
return (
  <div className="flex flex-col flex-grow bg-gray overflow-hidden">
    <div className="min-h-screen w-full flex flex-col  bg-white">
      

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
      <div className="overflow-auto">
        <div className="min-w-[900px]">
          {/* Sticky Table Header - Using grid-cols-5 to match customer data fields */}
          <div
            className="grid grid-cols-5 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
          >
            <span>Sr#</span>
            <span>Customer</span>
            <span>Contact#</span>
            <span>Customer Address</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Table Body */}
          {customers.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-10">
              No records available at the moment!
            </div>
          ) : (
            customers
              .slice((pageNo - 1) * selectedValue, pageNo * selectedValue)
              .map((customer, index) => (
                <div
                  key={customer.id}
                  className="grid grid-cols-5 border-b border-x border-gray-200 text-gray-800 items-center
                   text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{(pageNo - 1) * selectedValue + index + 1}</span>
                  <span className="truncate">{customer.customerName}</span>
                  <span>{customer.customerContact}</span>
                  <span className="truncate">{customer.customerAddress}</span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    <ViewButton
                      handleView={() =>
                        handleToggleViewModal("VIEW", customer.id)
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
          start={customers.length === 0 ? 0 : (pageNo - 1) * selectedValue + 1}
          end={Math.min(pageNo * selectedValue, customers.length)}
          total={customers.length}
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
      <AddCustomerAccount
        setModal={() => handleToggleViewModal("")}
        refreshData={fetchCustomers}
      />
    )}

    {isOpenModal === "VIEW" && selectedCustomerId && (
      <ViewCustomerAcc
        setModal={() => handleToggleViewModal("")}
        customerId={selectedCustomerId}
      />
    )}

  </div>
);
};
