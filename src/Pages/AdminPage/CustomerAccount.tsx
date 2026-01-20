import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
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

export const CustomerAccount = () => {
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
    document.title = "(OMS) Customer Account";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Customer Account"));
    }, 1000);
  }, [dispatch]);

  if (loader) return <Loader />;

  // return (
  //   <div className="w-full mx-2">
  //     <TableTitle
  //       tileName="Customer Accounts"
  //       activeFile="Customer Accounts list"
  //     />
  //     <div
  //       className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white
  //      overflow-hidden flex flex-col"
  //     >
  //       <div className="flex text-gray-800 items-center justify-between mx-2">
  //         <span>
  //           Total number of Customer Accounts:{" "}
  //           <span className="text-2xl text-indigo-900 font-semibold font-sans">
  //             {customers.length}
  //           </span>
  //         </span>
  //         <CustomButton
  //           label="Add Account"
  //           handleToggle={() => handleToggleViewModal("ADD")}
  //         />
  //       </div>
  //       <div className="flex items-center justify-between text-gray-800 mx-2">
  //         <div>
  //           <span>Show</span>
  //           <span className="bg-gray-200 rounded mx-1 p-1">
  //             <select value={selectedValue} onChange={handleChangeShowData}>
  //               {numbers.map((num, index) => (
  //                 <option key={index} value={num}>
  //                   {num}
  //                 </option>
  //               ))}
  //             </select>
  //           </span>
  //           <span>entries</span>
  //         </div>
  //         <TableInputField
  //           searchTerm={searchTerm}
  //           setSearchTerm={setSearchTerm}
  //         />
  //       </div>
  //       <div className="max-h-[28.4rem] overflow-y-auto mx-2">
  //         <div
  //           className="grid grid-cols-5 bg-gray-200 bg-indigo-900 text-white font-semibold border border-gray-600
  //          text-sm sticky top-0 z-10 p-[10px]"
  //         >
  //           <span>Sr#</span>
  //           <span>Customer</span>
  //           <span>Contact#</span>
  //           <span>Customer Address</span>
  //           <span className="text-center">Actions</span>
  //         </div>
  //         {customers.length === 0 ? (
  //           <div className="text-center text-gray-500 p-4 col-span-5">
  //             No customers found
  //           </div>
  //         ) : (
  //           customers.map((customer, index) => (
  //             <div
  //               key={customer.id}
  //               className="grid grid-cols-5 border border-gray-600 text-gray-800 hover:bg-gray-100 transition
  //                duration-200 text-sm items-center justify-center p-[7px]"
  //             >
  //               <span className="px-2">{index + 1}</span>
  //               <span>{customer.customerName}</span>
  //               <span>{customer.customerContact}</span>
  //               <span>{customer.customerAddress}</span>

  //               <span className="flex justify-center">
  //                 <ViewButton
  //                   handleView={() =>
  //                     handleToggleViewModal("VIEW", customer.id)
  //                   }
  //                 />
  //               </span>
  //             </div>
  //           ))
  //         )}
  //       </div>
  //     </div>

  //     <div className="flex items-center justify-between">
  //       <ShowDataNumber
  //         start={1}
  //         total={customers.length}
  //         end={customers.length}
  //       />
  //       <Pagination
  //         handleIncrementPageButton={handleIncrementPageButton}
  //         handleDecrementPageButton={handleDecrementPageButton}
  //         pageNo={pageNo}
  //       />
  //     </div>

  //     {isOpenModal === "ADD" && (
  //       <AddCustomerAccount
  //         setModal={() => handleToggleViewModal("")}
  //         refreshData={fetchCustomers}
  //       />
  //     )}

  //     {isOpenModal === "VIEW" && selectedCustomerId && (
  //       <ViewCustomerAcc
  //         setModal={() => handleToggleViewModal("")}
  //         customerId={selectedCustomerId}
  //       />
  //     )}
  //   </div>
  // );
   
 return (
  <div className="w-full px-2 sm:px-4">
    <TableTitle
      tileName="Customer Accounts"
      activeFile="Customer Accounts list"
    />

    <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
        <span className="text-sm sm:text-base">
          Total number of Customer Accounts:
          <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
            {customers.length}
          </span>
        </span>

        <CustomButton
          label="Add Account"
          handleToggle={() => handleToggleViewModal("ADD")}
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 text-gray-800">
        <div className="text-sm">
          <span>Show</span>
          <span className="bg-gray-200 rounded mx-1 p-1">
            <select
              value={selectedValue}
              onChange={handleChangeShowData}
              className="bg-transparent outline-none"
            >
              {numbers.map((num, index) => (
                <option key={index} value={num}>
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

      {/* Table Wrapper */}
      <div className="mx-2 mt-2 overflow-x-auto max-h-[28.4rem]">
        <div className="min-w-[800px]">
          {/* Table Header */}
          <div
            className="grid grid-cols-[0.5fr_1fr_1fr_1.5fr_1fr] 
                       bg-indigo-900 text-white font-semibold items-center text-sm sticky top-0 z-10 p-2"
          >
            <span>Sr#</span>
            <span>Customer</span>
            <span>Contact#</span>
            <span>Customer Address</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Table Body */}
          {customers.length === 0 ? (
            <div className="text-gray-500 text-center p-4 col-span-5">
              No customers found
            </div>
          ) : (
            customers
              .slice((pageNo - 1) * selectedValue, pageNo * selectedValue)
              .map((customer, index) => (
                <div
                  key={customer.id}
                  className="grid grid-cols-[0.5fr_1fr_1fr_1.5fr_1fr] border items-center border-gray-300 text-gray-800 text-sm p-2 hover:bg-gray-100 transition"
                >
                  <span>{(pageNo - 1) * selectedValue + index + 1}</span>
                  <span className="truncate">{customer.customerName}</span>
                  <span>{customer.customerContact}</span>
                  <span className="truncate">{customer.customerAddress}</span>
                  <span className="flex justify-center">
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
    </div>

    {/* Pagination */}
    <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-3">
      <ShowDataNumber
        start={customers.length === 0 ? 0 : (pageNo - 1) * selectedValue + 1}
        end={Math.min(pageNo * selectedValue, customers.length)}
        total={customers.length}
      />

      <Pagination
        pageNo={pageNo}
        handleIncrementPageButton={handleIncrementPageButton}
        handleDecrementPageButton={handleDecrementPageButton}
      />
    </div>

    {/* Modals */}
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
