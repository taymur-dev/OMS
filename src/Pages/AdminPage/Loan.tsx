import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { useEffect, useState } from "react";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddLoan } from "../../Components/LoanModal/AddLoan";
import { UpdateLoan } from "../../Components/LoanModal/UpdateLoan";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";

const numbers = [10, 25, 50, 100];

type LoanT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";
export const Loan = () => {
  const { loader } = useAppSelector((state) => state.NavigateSate);

  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<LoanT>("");

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
      <TableTitle tileName="Loan" activeFile="Loan list" />
      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white overflow-hidden flex flex-col">
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Loan Applications :{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [10]
            </span>
          </span>
          <CustomButton
            label="Add Loan"
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
          <div className="grid grid-cols-10 bg-gray-200 text-gray-900 font-semibold border border-gray-600 text-sm sticky top-0 z-10 p-[10px] ">
            <span className="">Sr#</span>
            <span className="">Employee Name</span>
            <span className="">Loan Date</span>
            <span className="">Loan Amount</span>
            <span className="">Installments</span>
            <span className="">Paid Amount</span>
            <span className="">REM Amount</span>
            <span className="">Approval</span>
            <span className="text-center">Actions</span>
          </div>
          <div className="grid grid-cols-10 border border-gray-600 text-gray-800  hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[7px]">
            <span className="px-2">1</span>
            <span className="">Hamza amin</span>
            <span className="">23,may,2025</span>
            <span className="">10,0000</span>
            <span className="">10</span>
            <span className="">0</span>
            <span className="">10,0000</span>
            <span className=" text-orange-500 ">
              <span className="bg-orange-100 p-2 rounded-full ">Pending</span>
            </span>

            <span className=" flex items-center  gap-1">
              <EditButton handleUpdate={() => handleToggleViewModal("EDIT")} />

              <ViewButton handleView={() => handleToggleViewModal("VIEW")} />

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
        <AddLoan setModal={() => handleToggleViewModal("")} />
      )}
      {isOpenModal === "EDIT" && (
        <UpdateLoan setModal={() => handleToggleViewModal("")} />
      )}
    </div>
  );
};
