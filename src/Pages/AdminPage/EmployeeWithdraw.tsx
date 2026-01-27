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
import { Footer } from "../../Components/Footer";


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

  

return (
  <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
    <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
      {/* 1) Table Title Section */}
      <TableTitle
        tileName="Employee Withdraw"
        rightElement={
          <CustomButton
            handleToggle={() => handleToggleViewModal("ADDWITHDRAW")}
            label="+ Add Withdraw"
          />
        }
      />

      <hr className="border border-b border-gray-200" />

      {/* 2) Filter and Search Section */}
      <div className="p-2">
        <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
          {/* Left Side: Show entries */}
          <div className="text-sm flex items-center">
            <span>Show</span>
            <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
          <TableInputField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>

      {/* --- MIDDLE SECTION (Scrollable Table) --- */}
      <div className="overflow-auto px-2">
        <div className="min-w-[900px]">
          {/* Sticky Table Header */}
          <div
            className="grid grid-cols-4 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
          >
            <span>Sr#</span>
            <span>Employee Name</span>
            <span>Status</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Table Body */}
          {paginatedEmployees.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-10">
              No records available at the moment!
            </div>
          ) : (
            paginatedEmployees.map((withdraw, index) => (
              <div
                key={withdraw.withdrawalId}
                className="grid grid-cols-4 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
              >
                <span>{(pageNo - 1) * itemsPerPage + index + 1}</span>
                <span className="truncate">{withdraw.name}</span>
                <span className="flex items-center gap-1 text-red-600">
                  <IoIosClose size={20} />
                  Withdraw
                </span>
                <span className="flex flex-nowrap justify-center gap-2">
                  <button
                    onClick={() => handleClickReason(withdraw)}
                    className="flex items-center gap-1 p-1 px-2 rounded-xl bg-blue-50 hover:cursor-pointer active:scale-95 transition-all text-blue-700"
                    title="Reason"
                  >
                    <TbFileCertificate size={18} />
                    <span className="text-xs">Reason</span>
                  </button>
                  <button
                    onClick={() => handleReactiveEmployee(withdraw.employeeId)}
                    className="flex items-center gap-1 p-1 px-2 rounded-xl bg-green-50 hover:cursor-pointer active:scale-95 transition-all text-green-700"
                    title="Active"
                  >
                    <BsCheck2 size={18} />
                    <span className="text-xs">Active</span>
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4) Pagination Footer Section */}
      <div className="flex flex-row gap-2 items-center justify-between p-2">
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
    </div>

    {/* --- MODALS SECTION --- */}
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

    {/* --- FOOTER SECTION --- */}
    <div className="border border-t-5 border-gray-200">
      <Footer />
    </div>
  </div>
);

};
