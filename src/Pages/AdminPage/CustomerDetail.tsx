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
      toast.info("Customer deleted successfully");
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
    <div className="w-full mx-2">
      <TableTitle tileName="Customer" activeFile="Customers list" />

      <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mx-2 text-gray-800 gap-2 sm:gap-0 py-2">
          <span className="text-sm sm:text-base">
            Total Number of Customers:{" "}
            <span className="text-2xl text-indigo-900 font-semibold font-sans">
              [{allCustomers.length}]
            </span>
          </span>

          <CustomButton
            label="Add Customer"
            handleToggle={() => handleToggleModal("ADD")}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-gray-800 mx-2 gap-2 sm:gap-0 py-2">
          <div className="flex items-center gap-1 text-sm sm:text-base">
            <span>Show</span>
            <select
              value={selectedValue}
              onChange={handleChangeShowData}
              className="bg-gray-200 rounded p-1"
            >
              {numbers.map((num, index) => (
                <option key={index} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>

          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Table */}
        {/* Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto mx-2 max-h-[28.4rem]">
          <div className="min-w-[700px]">
            {" "}
            {/* ensures table scrolls on small screens */}
            {/* Header */}
            <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-indigo-900 text-white font-semibold border border-gray-600 text-sm sticky top-0 z-10 p-2">
              <span>Sr#</span>
              <span>Customer</span>
              <span>Customer Address</span>
              <span>Contact#</span>
              <span>Company Name</span>
              <span>Company Address</span>
              <span className="text-center">Actions</span>
            </div>
            {paginatedCustomers.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-2">
                No records available at the moment!
              </div>
            ) : (
              paginatedCustomers.map((customer, index) => (
                <div
                  key={customer.id}
                  className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr] border border-gray-600 items-center text-gray-800 hover:bg-gray-100 transition duration-200 text-sm p-[7px]"
                >
                  <span>{startIndex + index + 1}</span>
                  <span>{customer.customerName}</span>
                  <span>{customer.customerAddress}</span>
                  <span>{customer.customerContact}</span>
                  <span>{customer.companyName}</span>
                  <span>{customer.companyAddress}</span>
                  <span className="flex items-center justify-center gap-1">
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
      </div>

      {/* Modals */}
      {isOpenModal === "ADD" && (
        <AddCustomer
          setIsOpenModal={() => setIsOpenModal("")}
          handleGetAllCustomers={handleGetAllCustomers}
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
      {isOpenModal === "UPDATE" && (
        <UpdateCustomer
          setIsOpenModal={() => setIsOpenModal("")}
          handleGetAllCustomers={handleGetAllCustomers}
          customerDetail={customerDetail}
        />
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-3">
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
  );
};
