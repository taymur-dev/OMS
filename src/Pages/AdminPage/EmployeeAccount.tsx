import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { useEffect, useState } from "react";
import { AddEmployeePayment } from "../../Components/EmployeeAccountModal/AddEmployeePayment";
import { AddEmployeeRefund } from "../../Components/EmployeeAccountModal/AddEmployeeRefund";
import { ViewEmployeeAccount } from "../../Components/EmployeeAccountModal/ViewEmployeeAccount";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";

const numbers = [10, 25, 50, 10];

type EMPLOYEEACOUNTT = "ADDPAYMENT" | "ADDREFUND" | "VIEW" | "";

export const EmployeeAccount = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);

  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<EMPLOYEEACOUNTT>("");

  const [pageNo, setPageNo] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  const handleIncrementPageButton = () => {
    setPageNo((prev) => prev + 1);
  };
  const handleDecrementPageButton = () => {
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleToggleViewModal = (active: EMPLOYEEACOUNTT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  useEffect(() => {
    document.title = "(OMS) EMPLOYEE ACCOUNT";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("EMPLOYEE ACCOUNT"));
    }, 1000);
  }, [dispatch]);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle
        tileName="Employee Accounts List"
        activeFile="Employee Accounts List"
      />

      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white overflow-hidden flex flex-col ">
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total Number of Employee Account :{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [10]
            </span>
          </span>
          <div className="flex gap-2">
            <CustomButton
              label="Payment Withdraw"
              handleToggle={() => handleToggleViewModal("ADDPAYMENT")}
            />
            <CustomButton
              label="Payment Refund"
              handleToggle={() => handleToggleViewModal("ADDREFUND")}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select>
                {numbers.map((num) => (
                  <option key={num}>{num}</option>
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
          <div className="grid grid-cols-5 bg-gray-200 text-gray-900 font-semibold border border-gray-600 text-sm sticky top-0 z-10 p-[10px]">
            <span className="">Sr#</span>
            <span className="">Name</span>
            <span className="">Email</span>
            <span className="">Phone No#</span>
            <span className="text-center w-40">Actions</span>
          </div>
          <div className="grid grid-cols-5 border border-gray-600 text-gray-800  hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[7px]">
            <span className="px-2">1</span>
            <span className="">Hamza</span>
            <span className="">hamzaamin10@gmail.com</span>
            <span className="">+923215965061</span>
            <span className="flex items-center">
              <ViewButton handleView={() => handleToggleViewModal("VIEW")} />
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

      {isOpenModal === "ADDPAYMENT" && (
        <AddEmployeePayment setModal={() => handleToggleViewModal("")} />
      )}

      {isOpenModal === "ADDREFUND" && (
        <AddEmployeeRefund setModal={() => handleToggleViewModal("")} />
      )}

      {isOpenModal === "VIEW" && (
        <ViewEmployeeAccount setModal={() => handleToggleViewModal("")} />
      )}
    </div>
  );
};
