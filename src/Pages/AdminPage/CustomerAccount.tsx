import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";

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
import { RiInboxArchiveLine } from "react-icons/ri";

type CustomerAccountT = "ADD" | "VIEW" | "";

type Customer = {
  id: number;
  customerName: string;
  customerContact: string;
  customerAddress: string;
};

// Updated props to interface with Ledgers.tsx
interface CustomerAccountProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const CustomerAccount = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: CustomerAccountProps) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<CustomerAccountT>("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );
  const [pageNo, setPageNo] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const { currentUser } = useAppSelector((state) => state.officeState);

  const fetchCustomers = useCallback(async () => {
    try {
      dispatch(navigationStart());
      const response = await axios.get(`${BASE_URL}/api/admin/getCustomerAcc`, {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
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

  // Sync with trigger from parent
  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("ADD");
    }
  }, [triggerModal]);

  // Reset page when search or size changes
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    document.title = "(OMS) Customer Account";
  }, []);

  const handleToggleViewModal = (
    type: CustomerAccountT,
    customerId?: number,
  ) => {
    setIsOpenModal((prev) => (prev === type ? "" : type));
    if (customerId !== undefined) setSelectedCustomerId(customerId);
    else setSelectedCustomerId(null);
  };

  // Filter based on externalSearch prop
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerName
        .toLowerCase()
        .includes(externalSearch.toLowerCase()) ||
      customer.customerContact.includes(externalSearch) ||
      customer.customerAddress
        .toLowerCase()
        .includes(externalSearch.toLowerCase()),
  );

  const totalNum = filteredCustomers.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedData = filteredCustomers.slice(startIndex, endIndex);

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(totalNum / externalPageSize);
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          {/* 1. Styled Header aligned with UsersDetails */}
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[60px_1fr_1fr_1fr_auto]
              bg-blue-400 text-white rounded-lg items-center font-bold
              text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span className="text-left">Sr#</span>
              <span className="text-left">Customer Name</span>
              <span className="text-left">Contact</span>
              <span className="text-left">Address</span>
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>

          {/* 2. Table Body */}
          <div className="px-0.5 sm:px-1 py-2">
            {paginatedData.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedData.map((customer, index) => (
                  <div
                    key={customer.id}
                    className="grid grid-cols-[60px_1fr_1fr_1fr_auto]
                    items-center px-3 py-2 gap-3 text-sm bg-white 
                    border border-gray-100 rounded-lg 
                    hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Name Column - Removed icon, kept Avatar container for consistency */}
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="truncate text-gray-800 text-sm">
                        {customer.customerName}
                      </span>
                    </div>

                    {/* Contact Column - Icons Removed */}
                    <div className="text-gray-600 truncate">
                      {customer.customerContact}
                    </div>

                    {/* Address Column - Icons Removed */}
                    <div className="text-gray-600 truncate">
                      {customer.customerAddress}
                    </div>

                    {/* Actions Column - Aligned with UsersDetails width */}
                    <div className="flex items-center justify-end gap-1 w-[140px] pr-5">
                      <ViewButton
                        handleView={() =>
                          handleToggleViewModal("VIEW", customer.id)
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
