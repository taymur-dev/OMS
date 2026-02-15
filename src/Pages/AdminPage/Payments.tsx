import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AddPayment } from "../../Components/PayementModals/AddPayment";
import { EditPayment } from "../../Components/PayementModals/EditPayment";
import { ViewPayment } from "../../Components/PayementModals/ViewPayment";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { Footer } from "../../Components/Footer";

const numbers = [10, 25, 50, 100];

type PATMENTT = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";

type PAYMENTMETHODT = {
  id: number;
  customerName: string;
  customerId: number;
  amount: string;
  paymentMethod: string;
  description: string;
  date: string;
};

export const Payments = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<PATMENTT>("");
  const [allPayment, setAllPayment] = useState<PAYMENTMETHODT[]>([]);
  const [selectPayment, setSelectPayment] = useState<PAYMENTMETHODT | null>(
    null,
  );
  const [catchId, setCatchId] = useState<number>();

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const token = currentUser?.token;

  const handleToggleViewModal = (active: PATMENTT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleGetPayments = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getPayments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedPayments = [...res.data].sort((a, b) => a.id - b.id);

      setAllPayment(sortedPayments);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    handleGetPayments();
    document.title = "(OMS) PAYMENT";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("PAYMENT"));
    }, 1000);
  }, [dispatch, handleGetPayments]);

  const filteredPayments = useMemo(() => {
    return allPayment.filter((payment) =>
      payment.customerId,
    );
  }, [allPayment]);

  const totalPages = Math.ceil(filteredPayments.length / pageSize);

  const startIndex = (pageNo - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  const handleIncrementPageButton = () => {
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  const handleDeletePayment = async () => {
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deletePayment/${catchId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Payment has been deleted successfully");
      handleGetPayments();
    } catch (error) {
      console.log(error);
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Payment button as the rightElement */}
        <TableTitle
          tileName="Payment"
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
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPageNo(1);
                  }}
                  className="bg-transparent outline-none py-1 cursor-pointer"
                >
                  {numbers.map((num) => (
                    <option key={num} value={num}>
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
            {/* Sticky Table Header */}
            <div
              className="grid grid-cols-6 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Customer</span>
              <span>Amount</span>
              <span>Payment Method</span>
              <span>Date</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedPayments.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedPayments.map((payment, index) => (
                <div
                  key={payment.id}
                  className="grid grid-cols-6 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{startIndex + index + 1}</span>
                  <span className="truncate">{payment.customerName}</span>
                  <span>{payment.amount}</span>
                  <span>{payment.paymentMethod}</span>
                  <span>
                    {new Date(payment.date) // Convert string to Date object first
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    <EditButton
                      handleUpdate={() => {
                        setSelectPayment(payment);
                        handleToggleViewModal("EDIT");
                      }}
                    />
                    <ViewButton
                      handleView={() => {
                        setSelectPayment(payment);
                        handleToggleViewModal("VIEW");
                      }}
                    />
                    <DeleteButton
                      handleDelete={() => {
                        setCatchId(payment.id);
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
            start={filteredPayments.length === 0 ? 0 : startIndex + 1}
            end={Math.min(endIndex, filteredPayments.length)}
            total={filteredPayments.length}
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
        <AddPayment
          setModal={() => handleToggleViewModal("")}
          handleGetPayments={handleGetPayments}
        />
      )}

      {isOpenModal === "EDIT" && selectPayment && (
        <EditPayment
          setModal={() => handleToggleViewModal("")}
          selectPayment={selectPayment}
          handleGetPayments={handleGetPayments}
        />
      )}

      {isOpenModal === "VIEW" && selectPayment && (
        <ViewPayment
          setIsOpenModal={() => handleToggleViewModal("")}
          viewPayment={selectPayment}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("DELETE")}
          onClose={() => handleToggleViewModal("")}
          onConfirm={handleDeletePayment}
          message="Are you sure you want to delete this payment?"
        />
      )}

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
