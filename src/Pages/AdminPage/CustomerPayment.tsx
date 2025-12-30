import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";

import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";

import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";

import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";

import { useEffect, useState } from "react";

import { AddResignation } from "../../Components/ResignationModal/AddResignation";

import { UpdateResignation } from "../../Components/ResignationModal/UpdateResignation";

import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";

import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { Loader } from "../../Components/LoaderComponent/Loader";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";

const numbers = [10, 25, 50, 100];

type CustomerPaymentT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

export const CustomerPayment = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);

  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<CustomerPaymentT>("");

  const [pageNo, setPageNo] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedValue, setSelectedValue] = useState(10);

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedValue(Number(event.target.value));
  };

  const handleIncrementPageButton = () => {
    setPageNo((prev) => prev + 1);
  };
  const handleDecrementPageButton = () => {
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));
  };
  const handleToggleViewModal = (active: CustomerPaymentT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  useEffect(() => {
    document.title = "(OMS) Customer Payment";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Customer Payment"));
    }, 1000);
  }, [dispatch]);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle
        tileName="Customer Payment"
        activeFile="Customer Payment list"
      />
      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white overflow-hidden flex flex-col">
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Customer Payment :{" "}
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
              <select value={selectedValue} onChange={handleChangeShowData}>
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
        <div className="w-full max-h-[28.4rem] overflow-y-auto  mx-auto">
          <div className="grid grid-cols-6  bg-gray-200 text-gray-900 font-semibold border border-gray-600 text-sm sticky top-0 z-10 p-[10px]">
            <span className="">Sr#</span>
            <span className="">Customer Name</span>
            <span className="">Payment Date</span>
            <span className="">Amount</span>
            <span className="">Invoice No</span>
            <span className="text-center w-36">Actions</span>
          </div>
          <div className="grid grid-cols-6 border border-gray-600 text-gray-800  hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[7px] ">
            <span className=" px-2">1</span>
            <span className="">Hamza Amin</span>
            <span className="">Developer</span>
            <span className="">25,05,2025</span>
            <span className="">Pending</span>
            <span className=" flex items-center  gap-1">
              <EditButton handleUpdate={() => handleToggleViewModal("EDIT")} />

              <ViewButton handleView={() => handleToggleViewModal("")} />
              <DeleteButton
                handleDelete={() => handleToggleViewModal("DELETE")}
              />
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber start={1} total={10} end={1 + 9} />
        <Pagination
          handleIncrementPageButton={handleIncrementPageButton}
          handleDecrementPageButton={handleDecrementPageButton}
          pageNo={pageNo}
        />
      </div>

      {isOpenModal === "ADD" && (
        <AddResignation setModal={() => handleToggleViewModal("")} />
      )}

      {isOpenModal === "EDIT" && (
        <UpdateResignation setModal={() => handleToggleViewModal("")} />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("")}
          onClose={() => handleToggleViewModal("DELETE")}
          onConfirm={() => handleToggleViewModal("")}
          message="Are you sure you want to delete this Resignation?"
        />
      )}
    </div>
  );
};
