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

const numbers = [10, 25, 50, 100];

type PATMENTT = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";

type PAYMENTMETHODT = {
  id: number;
  customerName: string;
  customerId: string;
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
    null
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
      payment.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPayment, searchTerm]);

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
        }
      );
      toast.success("Payment has been deleted successfully");
      handleGetPayments();
    } catch (error) {
      console.log(error);
    }
  };

  if (loader) return <Loader />;

  // return (
  //   <div className="w-full mx-2">
  //     <TableTitle tileName="Payment" activeFile="All Payment list" />

  //     <div
  //       className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white
  //      overflow-hidden flex flex-col"
  //     >
  //       <div className="flex text-gray-800 items-center justify-between mx-2">
  //         <span>
  //           Total Payments:
  //           <span className="text-2xl text-indigo-900 font-semibold ml-1">
  //             [{filteredPayments.length}]
  //           </span>
  //         </span>
  //         <CustomButton
  //           label="Add Payment"
  //           handleToggle={() => handleToggleViewModal("ADD")}
  //         />
  //       </div>

  //       <div className="flex items-center justify-between text-gray-800 mx-2">
  //         <div>
  //           Show
  //           <select
  //             className="mx-2 bg-gray-200 rounded px-2"
  //             value={pageSize}
  //             onChange={(e) => {
  //               setPageSize(Number(e.target.value));
  //               setPageNo(1);
  //             }}
  //           >
  //             {numbers.map((num) => (
  //               <option key={num} value={num}>
  //                 {num}
  //               </option>
  //             ))}
  //           </select>
  //           entries
  //         </div>

  //         <TableInputField
  //           searchTerm={searchTerm}
  //           setSearchTerm={setSearchTerm}
  //         />
  //       </div>

  //       <div className="max-h-[28.4rem] overflow-y-auto mx-2">
  //         <div
  //           className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] bg-indigo-900  text-white
  //          font-semibold border sticky top-0 p-[10px]"
  //         >
  //           <span>Sr</span>
  //           <span>Customer</span>
  //           <span>Amount</span>
  //           <span>Payment Method</span>
  //           <span>Date</span>
  //           <span className="text-center">Actions</span>
  //         </div>

  //         {paginatedPayments.length === 0 ? (
  //           <div className="p-4 text-center">No data found</div>
  //         ) : (
  //           paginatedPayments.map((payment, index) => (
  //             <div
  //               key={payment.id}
  //               className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] border text-sm items-center
  //                p-[7px] hover:bg-gray-100"
  //             >
  //               <span>{startIndex + index + 1}</span>
  //               <span>{payment.customerId}</span>
  //               <span>{payment.amount}</span>
  //               <span>{payment.paymentMethod}</span>
  //               <span>{payment.date.slice(0, 10)}</span>
  //               <span className="flex gap-1 justify-center">
  //                 <EditButton
  //                   handleUpdate={() => {
  //                     setSelectPayment(payment);
  //                     handleToggleViewModal("EDIT");
  //                   }}
  //                 />
  //                 <ViewButton
  //                   handleView={() => {
  //                     setSelectPayment(payment);
  //                     handleToggleViewModal("VIEW");
  //                   }}
  //                 />
  //                 <DeleteButton
  //                   handleDelete={() => {
  //                     setCatchId(payment.id);
  //                     handleToggleViewModal("DELETE");
  //                   }}
  //                 />
  //               </span>
  //             </div>
  //           ))
  //         )}
  //       </div>
  //     </div>

  //     <div className="flex items-center justify-between mt-2">
  //       <ShowDataNumber
  //         start={filteredPayments.length ? startIndex + 1 : 0}
  //         end={Math.min(endIndex, filteredPayments.length)}
  //         total={filteredPayments.length}
  //       />
  //       <Pagination
  //         pageNo={pageNo}
  //         handleIncrementPageButton={handleIncrementPageButton}
  //         handleDecrementPageButton={handleDecrementPageButton}
  //       />
  //     </div>

  //     {isOpenModal === "ADD" && (
  //       <AddPayment
  //         setModal={() => handleToggleViewModal("")}
  //         handleGetPayments={handleGetPayments}
  //       />
  //     )}

  //     {isOpenModal === "EDIT" && selectPayment && (
  //       <EditPayment
  //         setModal={() => handleToggleViewModal("")}
  //         selectPayment={selectPayment}
  //         handleGetPayments={handleGetPayments}
  //       />
  //     )}

  //     {isOpenModal === "VIEW" && selectPayment && (
  //       <ViewPayment
  //         setIsOpenModal={() => handleToggleViewModal("")}
  //         viewPayment={selectPayment}
  //       />
  //     )}

  //     {isOpenModal === "DELETE" && (
  //       <ConfirmationModal
  //         isOpen={() => handleToggleViewModal("DELETE")}
  //         onClose={() => handleToggleViewModal("")}
  //         onConfirm={handleDeletePayment}
  //         message="Are you sure you want to delete this payment?"
  //       />
  //     )}
  //   </div>
  // );
   return (
  <div className="w-full px-2 sm:px-4">
    <TableTitle tileName="Payment" activeFile="All Payment list" />

    <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
        <span className="text-sm sm:text-base">
          Total Payments:
          <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
            [{filteredPayments.length}]
          </span>
        </span>

        <CustomButton
          handleToggle={() => handleToggleViewModal("ADD")}
          label="Add Payment"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 text-gray-800">
        <div className="text-sm">
          Show
          <span className="bg-gray-200 rounded mx-1 p-1">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNo(1);
              }}
              className="bg-transparent outline-none"
            >
              {numbers.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </span>
          entries
        </div>

        <TableInputField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Table Wrapper */}
      <div className="mx-2 mt-2 overflow-x-auto max-h-[28.4rem]">
        <div className="min-w-[900px]">
          {/* Table Header */}
          <div
            className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] bg-indigo-900 items-center text-white
             font-semibold text-sm sticky top-0 z-10 p-2"
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
            <div className="text-gray-800 text-center py-4">
              No payments found!
            </div>
          ) : (
            paginatedPayments.map((payment, index) => (
              <div
                key={payment.id}
                className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] border border-gray-300 items-center
                 text-gray-800 text-sm p-2 hover:bg-gray-100 transition"
              >
                <span>{startIndex + index + 1}</span>
                <span className="truncate">{payment.customerId}</span>
                <span>{payment.amount}</span>
                <span>{payment.paymentMethod}</span>
                <span>{payment.date.slice(0, 10)}</span>

                {/* Actions */}
                <span className="flex flex-wrap items-center justify-center gap-1">
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
    </div>

    {/* Pagination */}
    <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-3">
      <ShowDataNumber
        start={filteredPayments.length ? startIndex + 1 : 0}
        end={Math.min(endIndex, filteredPayments.length)}
        total={filteredPayments.length}
      />

      <Pagination
        pageNo={pageNo}
        handleDecrementPageButton={handleDecrementPageButton}
        handleIncrementPageButton={handleIncrementPageButton}
      />
    </div>

    {/* Modals */}
    {isOpenModal === "ADD" && (
      <AddPayment setModal={() => handleToggleViewModal("")} handleGetPayments={handleGetPayments} />
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
  </div>
);


};
