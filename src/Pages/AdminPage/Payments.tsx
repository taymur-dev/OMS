import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { useCallback, useEffect, useState } from "react";
import { AddPayment } from "../../Components/PayementModals/AddPayment";
import { EditPayment } from "../../Components/PayementModals/EditPayment";
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

type PATMENTT = "ADD" | "EDIT" | "DELETE" | "";

type PAYMENTMETHODT = {
  id: number;
  customerName: string;
  amount: string;
  paymentType: string;
  description: string;
  date: string;
};

export const Payments = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const { loader } = useAppSelector((state) => state.NavigateSate);

  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<PATMENTT>("");

  const [allPayment, setAllPayment] = useState<PAYMENTMETHODT[] | null>(null);

  const [seletePayment, setSeletePayment] = useState<PAYMENTMETHODT | null>(
    null
  );

  const [catchId, setCatchId] = useState<number>();

  const token = currentUser?.token;

  const handleToggleViewModal = (active: PATMENTT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const [pageNo, setPageNo] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");


  const handleIncrementPageButton = () => {
    setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleGetPayments = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getPayments`, {
        headers: {
          Authorization: token,
        },
      });

      setAllPayment(res.data);
    } catch (error) {
      console.log(error);
    }
  } , [token]);

  const handleClickEditButton = (data: PAYMENTMETHODT) => {
    handleToggleViewModal("EDIT");
    setSeletePayment(data);
  };

  const handleClickDeleteButton = (id: number) => {
    handleToggleViewModal("DELETE");
    setCatchId(id);
  };

  const handleDeletePayment = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/admin/deletePayment/${catchId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      handleGetPayments();
      toast.success("Payment has been deleted succesfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetPayments();
    document.title = "(OMS) PAYMENT";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("PAYMENT"));
    }, 1000);
  }, [dispatch , handleGetPayments]);

  if (loader) return <Loader />;
  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Payment" activeFile="All Payment list" />
      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white overflow-hidden flex flex-col">
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Attendance :{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [10]
            </span>
          </span>
          <CustomButton
            label="Add Payment"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>
        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select>
                {numbers.map((num, index) => (
                  <option key={index}>{num}</option>
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
        <div className="w-full max-h-[28.4rem] overflow-y-auto  mx-auto">
          <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] bg-gray-200 text-gray-900 font-semibold border border-gray-600 text-sm sticky top-0 z-10 p-[10px] ">
            <span className="">Sr</span>
            <span className="">Customers</span>
            <span className="">Amount</span>
            <span className="">Payment Type</span>
            <span className="">Date</span>
            <span className="text-center w-28">Actions</span>
          </div>
          {allPayment?.length === 0 ? (
            <div>No data found yet</div>
          ) : (
            allPayment?.map((payment, index) => (
              <div
                className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] border border-gray-600 text-gray-800  hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[7px]"
                key={payment.id}
              >
                <span className=" ">{index + 1}</span>
                <span className=" ">{payment.customerName}</span>
                <span className="  ">{payment.amount}</span>
                <span className="  ">{payment.paymentType}</span>
                <span className="  ">{payment.date.slice(0, 10)}</span>
                <span className=" flex items-center  gap-1">
                  <EditButton
                    handleUpdate={() => handleClickEditButton(payment)}
                  />

                  <DeleteButton
                    handleDelete={() => handleClickDeleteButton(payment.id)}
                  />
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber start={1} total={10} end={1 + 9} />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

      {isOpenModal === "ADD" && (
        <AddPayment
          setModal={() => handleToggleViewModal("")}
          handleGetPayments={handleGetPayments}
        />
      )}

      {isOpenModal === "EDIT" && (
        <EditPayment
          setModal={() => handleToggleViewModal("")}
          seletePayment={seletePayment}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("DELETE")}
          onClose={() => handleToggleViewModal("")}
          onConfirm={() => handleDeletePayment()}
          message="Are you sure to want delete this payment"
        />
      )}
    </div>
  );
};
