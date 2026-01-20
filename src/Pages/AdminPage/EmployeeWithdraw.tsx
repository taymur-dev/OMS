import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { BsCheck2 } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { TbFileCertificate } from "react-icons/tb";
import { useEffect, useState, useCallback, useMemo } from "react";
import { AddWithdraw } from "../../Components/WithdrawModal/AddWithdraw";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { Loader } from "../../Components/LoaderComponent/Loader";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
import { ViewReasonWithDraw } from "../../Components/WithdrawModal/ViewReasonWithDraw";
import { toast } from "react-toastify";

const numbers = [10, 25, 50, 100];

export type WithdrawEmployeeT = {
  withdrawalId: number;
  employeeId: number;
  name: string;
  withdrawDate: string;
  withdrawReason: string;
};

type TEMPLOYEEWITHDRAW = "ADDWITHDRAW" | "REASONWITHDRAW" | "";

export const EmployeeWithdraw = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const [allWithdrawEmployees, setAllWithdrawEmployees] = useState<
    WithdrawEmployeeT[] | null
  >(null);
  const [isOpenModal, setIsOpenModal] = useState<TEMPLOYEEWITHDRAW>("");
  const [viewReason, setViewReason] = useState<WithdrawEmployeeT | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleIncrementPageButton = () => {
    setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleToggleViewModal = (active: TEMPLOYEEWITHDRAW) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handlegetwithDrawEmployeess = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/getWithdrawEmployees`,
        {
          headers: { Authorization: token },
        }
      );
      setAllWithdrawEmployees(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    }
  }, [token]);

  const handleClickReason = (reasonData: WithdrawEmployeeT) => {
    handleToggleViewModal("REASONWITHDRAW");
    setViewReason(reasonData);
  };

  const handleReactiveEmployee = async (id: number) => {
    try {
      await axios.put(
        `${BASE_URL}/api/admin/reActiveEmployee/${id}`,
        {},
        { headers: { Authorization: token } }
      );
      toast.success("Employee Reactivated Successfully");
      handlegetwithDrawEmployeess();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    }
  };

  useEffect(() => {
    document.title = "(OMS)WITHDRAW EMPLOYEE";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("withdraw Employee"));
    }, 1000);
    handlegetwithDrawEmployeess();
  }, [dispatch, handlegetwithDrawEmployeess]);

  // ====== FILTERED + PAGINATED DATA ======
  const filteredEmployees = useMemo(() => {
    if (!allWithdrawEmployees) return [];
    return allWithdrawEmployees.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allWithdrawEmployees, searchTerm]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (pageNo - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, pageNo, itemsPerPage]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // ====== ADJUST PAGE NO IF IT EXCEEDS TOTAL PAGES ======
  useEffect(() => {
    if (pageNo > totalPages) setPageNo(totalPages || 1);
  }, [totalPages, pageNo]);

  if (loader) return <Loader />;

  // return (
  //   <div className="w-full mx-2">
  //     <TableTitle
  //       tileName="Employee Withdraw"
  //       activeFile="Employees Withdraw list"
  //     />

  //     <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
  //       <div className="flex text-gray-800 items-center justify-between mx-2">
  //         <span>
  //           Total number of Employees Withdraw:{" "}
  //           <span className="text-2xl text-indigo-900 font-semibold font-sans">
  //             [{filteredEmployees.length}]
  //           </span>
  //         </span>
  //         <CustomButton
  //           label="Add Withdraw"
  //           handleToggle={() => handleToggleViewModal("ADDWITHDRAW")}
  //         />
  //       </div>

  //       <div className="flex items-center justify-between text-gray-800 mx-2">
  //         <div>
  //           <span>Show</span>
  //           <span className="bg-gray-200 rounded mx-1 p-1">
  //             <select
  //               value={itemsPerPage}
  //               onChange={(e) => setItemsPerPage(Number(e.target.value))}
  //             >
  //               {numbers.map((num, index) => (
  //                 <option key={index}>{num}</option>
  //               ))}
  //             </select>
  //           </span>
  //           <span>entries</span>
  //         </div>
  //         <TableInputField
  //           searchTerm={searchTerm}
  //           setSearchTerm={setSearchTerm}
  //         />
  //       </div>

  //       <div className="max-h-[28.4rem] overflow-y-auto mx-2">
  //         <div
  //           className="grid grid-cols-[0.5fr_1fr_1fr_1fr] bg-indigo-900 text-white font-semibold
  //          border border-indigo-900 text-sm sticky top-0 z-10 p-[10px]"
  //         >
  //           <span>Sr#</span>
  //           <span>Employee Name</span>
  //           <span>Status</span>
  //           <span className="text-center w-28">Actions</span>
  //         </div>

  //         {paginatedEmployees.map((withdraw, index) => (
  //           <div
  //             className="grid grid-cols-[0.5fr_1fr_1fr_1fr] border border-indigo-900 text-gray-800
  //               hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[4px]"
  //             key={withdraw.withdrawalId}
  //           >
  //             <span className="px-2">
  //               {(pageNo - 1) * itemsPerPage + index + 1}
  //             </span>
  //             <span>{withdraw.name}</span>
  //             <span className="withdraw-button">
  //               <IoIosClose size={20} title="Withdraw" />
  //               Withdraw
  //             </span>
  //             <div className="flex gap-2">
  //               <span
  //                 onClick={() => handleClickReason(withdraw)}
  //                 className="reason-button"
  //               >
  //                 <TbFileCertificate size={20} title="Reason" />
  //                 Reason
  //               </span>
  //               <span
  //                 className="active-button"
  //                 onClick={() => handleReactiveEmployee(withdraw.employeeId)}
  //               >
  //                 <BsCheck2 size={20} title="Active" />
  //                 Active
  //               </span>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     <div className="flex items-center justify-between">
  //       <ShowDataNumber
  //         start={
  //           paginatedEmployees.length === 0
  //             ? 0
  //             : (pageNo - 1) * itemsPerPage + 1
  //         }
  //         end={Math.min(pageNo * itemsPerPage, filteredEmployees.length)}
  //         total={filteredEmployees.length}
  //       />
  //       <Pagination
  //         pageNo={pageNo}
  //         handleDecrementPageButton={handleDecrementPageButton}
  //         handleIncrementPageButton={handleIncrementPageButton}
  //       />
  //     </div>

  //     {isOpenModal === "ADDWITHDRAW" && (
  //       <AddWithdraw
  //         setModal={() => setIsOpenModal("")}
  //         handlegetwithDrawEmployeess={handlegetwithDrawEmployeess}
  //       />
  //     )}

  //     {isOpenModal === "REASONWITHDRAW" && (
  //       <ViewReasonWithDraw
  //         setIsOpenModal={() => handleToggleViewModal("")}
  //         viewReason={viewReason}
  //       />
  //     )}
  //   </div>
  // );

  return (
  <div className="w-full px-2 sm:px-4">
    <TableTitle
      tileName="Employee Withdraw"
      activeFile="Employees Withdraw list"
    />

    <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
        <span className="text-sm sm:text-base">
          Total number of Employees Withdraw:
          <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
            [{filteredEmployees.length}]
          </span>
        </span>

        <CustomButton
          handleToggle={() => handleToggleViewModal("ADDWITHDRAW")}
          label="Add Withdraw"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 text-gray-800">
        <div className="text-sm">
          <span>Show</span>
          <span className="bg-gray-200 rounded mx-1 p-1">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-transparent outline-none"
            >
              {numbers.map((num, index) => (
                <option key={index} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </span>
          <span>entries</span>
        </div>

        <TableInputField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Table Wrapper */}
      <div className="mx-2 mt-2 overflow-x-auto max-h-[28.4rem]">
        <div className="min-w-[700px]">
          {/* Table Header */}
          <div
            className="grid grid-cols-[0.5fr_1.5fr_1fr_1fr] sm:grid-cols-[0.5fr_1.5fr_1fr_1fr_2fr]
              bg-indigo-900 text-white font-semibold text-sm sticky top-0 z-10 p-2"
          >
            <span>Sr#</span>
            <span>Employee Name</span>
            <span>Status</span>
            <span className="text-center w-28">Actions</span>
          </div>

          {/* Table Body */}
          {paginatedEmployees.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-4">
              No records available at the moment!
            </div>
          ) : (
            paginatedEmployees.map((withdraw, index) => (
              <div
                key={withdraw.withdrawalId}
                className="grid grid-cols-[0.5fr_1.5fr_1fr_1fr] sm:grid-cols-[0.5fr_1.5fr_1fr_1fr_2fr]
                  border border-gray-300 text-gray-800 text-sm p-2
                  hover:bg-gray-100 transition items-center justify-center"
              >
                <span>{(pageNo - 1) * itemsPerPage + index + 1}</span>
                <span className="truncate">{withdraw.name}</span>
                <span className="withdraw-button flex items-center gap-1">
                  <IoIosClose size={20} title="Withdraw" />
                  Withdraw
                </span>
                <div className="flex flex-wrap gap-1 justify-center">
                  <span
                    onClick={() => handleClickReason(withdraw)}
                    className="reason-button flex items-center gap-1"
                  >
                    <TbFileCertificate size={20} title="Reason" />
                    Reason
                  </span>
                  <span
                    className="active-button flex items-center gap-1"
                    onClick={() => handleReactiveEmployee(withdraw.employeeId)}
                  >
                    <BsCheck2 size={20} title="Active" />
                    Active
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

    {/* Pagination */}
    <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-3">
      <ShowDataNumber
        start={paginatedEmployees.length === 0 ? 0 : (pageNo - 1) * itemsPerPage + 1}
        end={Math.min(pageNo * itemsPerPage, filteredEmployees.length)}
        total={filteredEmployees.length}
      />

      <Pagination
        pageNo={pageNo}
        handleDecrementPageButton={handleDecrementPageButton}
        handleIncrementPageButton={handleIncrementPageButton}
      />
    </div>

    {/* Modals */}
    {isOpenModal === "ADDWITHDRAW" && (
      <AddWithdraw
        setModal={() => setIsOpenModal("")}
        handlegetwithDrawEmployeess={handlegetwithDrawEmployeess}
      />
    )}

    {isOpenModal === "REASONWITHDRAW" && (
      <ViewReasonWithDraw
        setIsOpenModal={() => handleToggleViewModal("")}
        viewReason={viewReason}
      />
    )}
  </div>
);

};
