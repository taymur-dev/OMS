import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";

import { Pagination } from "../../Components/Pagination/Pagination";

import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";

import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";

import { useEffect, useState } from "react";

import { AddQuotation } from "../../Components/QuotationModal/AddQuotation";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";

import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { Loader } from "../../Components/LoaderComponent/Loader";

const numbers = [10, 25, 50, 100];

type LoanT = "ADD" | "VIEW" | "EDIT" | "";
export const EmployeeSalaryDetail = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);

  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<LoanT>("");

  const [pageNo, setPageNo] = useState(1);

  const [selectedValue, setSelectedValue] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");

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
  const handleToggleViewModal = (active: LoanT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  useEffect(() => {
    document.title = "(OMS) LOAN";
    dispatch(navigationStart());

    setTimeout(() => {
      dispatch(navigationSuccess("LOAN"));
    }, 1000);
  }, [dispatch]);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Salary" activeFile="Salary  Cycle" />
      <div className="max-h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white ">
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Salary Record:{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [10]
            </span>
          </span>
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
        <div className="w-full max-h-[28.6rem] overflow-hidden  mx-auto">
          <div className="grid grid-cols-8 bg-gray-200 text-gray-900 font-semibold rounded-t-lg border border-gray-500 text-sm ">
            <span className="p-2">Sr</span>
            <span className="p-2 text-left">Month</span>
            <span className="p-2 text-left">Debit</span>
            <span className="p-2 text-left">Credit</span>
            <span className="p-2 text-left">Balance</span>
            <span className="p-2 text-left">Pre-Bal</span>
            <span className="p-2 text-left">NET-Bal</span>
            <span className="p-2 text-left">Approval</span>
          </div>
          <div className="grid grid-cols-8 border border-gray-600 text-gray-800  hover:bg-gray-100 transition duration-200 text-sm items-center justify-center">
            <span className=" p-2 text-left ">1</span>
            <span className=" p-2 text-left   ">Hamza amin</span>
            <span className=" p-2 text-left  ">23,may,2025</span>
            <span className=" p-2 text-left ">10,0000</span>
            <span className=" p-2 text-left   ">10</span>
            <span className=" p-2 text-left   ">0</span>
            <span className=" p-2 text-left  ">10,0000</span>
            <span className=" text-orange-500 ">
              <span className="bg-orange-100 p-2 rounded-full ">Pending</span>
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
        <AddQuotation setModal={() => handleToggleViewModal("")} />
      )}
    </div>
  );
};
