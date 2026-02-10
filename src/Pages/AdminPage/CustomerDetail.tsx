import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { useCallback, useEffect, useState } from "react";

import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { Loader } from "../../Components/LoaderComponent/Loader";

import { AddCustomer } from "../../Components/CustomerComponents/AddCustomerForm";

import axios, { AxiosError } from "axios";

import { BASE_URL } from "../../Content/URL";

import { toast } from "react-toastify";

import { CustomerViewModal } from "../../Components/CustomerComponents/CustomerViewModal";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";

import { Pagination } from "../../Components/Pagination/Pagination";

import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";

import { UpdateCustomer } from "../../Components/CustomerComponents/UpdateCustomer";

import { EditButton } from "../../Components/CustomButtons/EditButton";

import { ViewButton } from "../../Components/CustomButtons/ViewButton";

import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";

import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { Footer } from "../../Components/Footer";

const numbers = [10, 25, 50, 100];

type ModalT = "ADD" | "UPDATE" | "VIEW" | "DELETE" | "";

type AllcustomerT = {
  id: number;
  customerStatus: string;
  customerName: string;
  customerAddress: string;
  customerContact: string;
  companyName: string;
  companyAddress: string;
};

export const CustomerDetail = () => {
  const [isOpenModal, setIsOpenModal] = useState<ModalT | "">("");
  const [allCustomers, setAllCustomers] = useState<AllcustomerT[]>([]);
  const [customerDetail, setCustomerDetail] = useState<AllcustomerT | null>(
    null,
  );
  const [selectedValue, setSelectedValue] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [catchId, setCatchId] = useState<number | null>(null);

  const { currentUser } = useAppSelector((state) => state?.officeState);
  const token = currentUser?.token;

  const { loader } = useAppSelector((state) => state?.NavigateState);
  const dispatch = useAppDispatch();

  const handleToggleModal = (Y: ModalT) => {
    setIsOpenModal((prev) => (prev === Y ? "" : Y));
  };

  const handleGetAllCustomers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getAllCustomers`, {
        headers: {
          Authorization: token,
        },
      });

      const sorted = res.data.sort(
        (a: AllcustomerT, b: AllcustomerT) => a.id - b.id,
      );
      setAllCustomers(sorted);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.log(axiosError.message);
      toast.error("No customers available yet!");
    }
  }, [token]);

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedValue(Number(event.target.value));
    setPageNo(1);
  };

  const handleDeleteCustomer = async (id: number | null) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteCustomer/${id}`,
        {},
        {
          headers: { Authorization: token },
        },
      );

      handleGetAllCustomers();
      toast.error("Customer deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Cannot delete this customer");
    }
  };

  const handleViewButton = (customer: AllcustomerT) => {
    setIsOpenModal("VIEW");
    setCustomerDetail(customer);
  };

  const handleCatchId = (id: number) => {
    setCatchId(id);
    setIsOpenModal("DELETE");
  };

  const handleUpdateCustomer = (customer: AllcustomerT) => {
    setIsOpenModal("UPDATE");
    setCustomerDetail(customer);
  };

  useEffect(() => {
    document.title = "(OMS)Customer Detail ";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("Customer")), 1000);
    handleGetAllCustomers();
  }, [dispatch, handleGetAllCustomers]);

  if (loader) return <Loader />;

  const filteredCustomers = allCustomers.filter((customer) => {
    const combined = `
      ${customer.customerName}
      ${customer.customerAddress}
      ${customer.customerContact}
      ${customer.companyName}
      ${customer.companyAddress}
    `.toLowerCase();

    return combined.includes(searchTerm.toLowerCase());
  });

  const totalNum = filteredCustomers.length;
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = startIndex + selectedValue;

  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Customer button as the rightElement */}
        <TableTitle
          tileName="Customer"
          rightElement={
            <CustomButton
              handleToggle={() => handleToggleModal("ADD")}
              label="+ Add Customer"
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
            {/* Sticky Table Header - Grid 7 aligned with UserDetails */}
            <div
              className="grid grid-cols-7 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Customer</span>
              <span>Customer Address</span>
              <span>Contact#</span>
              <span>Company Name</span>
              <span>Company Address</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedCustomers.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedCustomers.map((customer, index) => (
                <div
                  key={customer.id}
                  className="grid grid-cols-7 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{startIndex + index + 1}</span>
                  <span className="truncate">{customer.customerName}</span>
                  <span className="truncate">{customer.customerAddress}</span>
                  <span>{customer.customerContact}</span>
                  <span className="truncate">{customer.companyName}</span>
                  <span className="truncate">{customer.companyAddress}</span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    <EditButton
                      handleUpdate={() => handleUpdateCustomer(customer)}
                    />
                    <ViewButton handleView={() => handleViewButton(customer)} />
                    <DeleteButton
                      handleDelete={() => handleCatchId(customer?.id)}
                    />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between">
          <ShowDataNumber
            start={totalNum === 0 ? 0 : startIndex + 1}
            end={Math.min(endIndex, totalNum)}
            total={totalNum}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={() =>
              setPageNo((prev) => (prev > 1 ? prev - 1 : 1))
            }
            handleIncrementPageButton={() =>
              setPageNo((prev) => (endIndex < totalNum ? prev + 1 : prev))
            }
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
      {isOpenModal === "ADD" && (
        <AddCustomer
          setIsOpenModal={() => setIsOpenModal("")}
          handleGetAllCustomers={handleGetAllCustomers}
        />
      )}

      {isOpenModal === "UPDATE" && (
        <UpdateCustomer
          setIsOpenModal={() => setIsOpenModal("")}
          handleGetAllCustomers={handleGetAllCustomers}
          customerDetail={customerDetail}
        />
      )}

      {isOpenModal === "VIEW" && (
        <CustomerViewModal
          setIsOpenModal={() => setIsOpenModal("")}
          customerDetail={customerDetail}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => setIsOpenModal("DELETE")}
          onClose={() => setIsOpenModal("")}
          onConfirm={() => handleDeleteCustomer(catchId)}
          message="Are you sure you want to delete this Customer?"
        />
      )}

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
