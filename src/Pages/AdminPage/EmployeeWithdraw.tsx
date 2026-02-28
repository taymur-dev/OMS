import { useEffect, useState, useCallback, useMemo } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { BASE_URL } from "../../Content/URL";
import { navigationStart, navigationSuccess } from "../../redux/NavigationSlice";

// Components
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddWithdraw } from "../../Components/WithdrawModal/AddWithdraw";
import { ViewReasonWithDraw } from "../../Components/WithdrawModal/ViewReasonWithDraw";

// Icons
import { BsCheck2 } from "react-icons/bs";
import { TbFileCertificate } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { RiInboxArchiveLine, RiCalendarLine, RiUserFill } from "react-icons/ri";

export type WithdrawEmployeeT = {
  withdrawalId: number;
  employeeId: number;
  name: string;
  withdrawDate: string;
  withdrawReason: string;
  image?: string;
};

type TEMPLOYEEWITHDRAW = "ADDWITHDRAW" | "REASONWITHDRAW" | "";

interface EmployeeWithdrawProps {
  triggerAdd: number;
  externalSearch: string;
  externalPageSize: number;
}

export const EmployeeWithdraw = ({
  triggerAdd,
  externalSearch,
  externalPageSize,
}: EmployeeWithdrawProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const [allWithdrawEmployees, setAllWithdrawEmployees] = useState<WithdrawEmployeeT[] | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<TEMPLOYEEWITHDRAW>("");
  const [viewReason, setViewReason] = useState<WithdrawEmployeeT | null>(null);
  const [pageNo, setPageNo] = useState(1);

  const handlegetwithDrawEmployeess = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getWithdrawEmployees`, {
        headers: { Authorization: token },
      });
      setAllWithdrawEmployees(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    }
  }, [token]);

  useEffect(() => {
    document.title = "(OMS)WITHDRAW EMPLOYEE";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Withdraw Employee"));
    }, 500);
    handlegetwithDrawEmployeess();
  }, [dispatch, handlegetwithDrawEmployeess]);

  // Sync Modal with trigger
  useEffect(() => {
    if (triggerAdd > 0) setIsOpenModal("ADDWITHDRAW");
  }, [triggerAdd]);

  // Reset page when search changes
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch]);

  const handleReactiveEmployee = async (id: number) => {
    try {
      await axios.put(`${BASE_URL}/api/admin/reActiveEmployee/${id}`, {}, {
        headers: { Authorization: token }
      });
      toast.success("Employee Reactivated Successfully");
      handlegetwithDrawEmployeess();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    }
  };

  // ====== FILTERED + PAGINATED DATA ======
  const filteredEmployees = useMemo(() => {
    if (!allWithdrawEmployees) return [];
    return allWithdrawEmployees.filter((emp) =>
      emp.name.toLowerCase().includes(externalSearch.toLowerCase())
    );
  }, [allWithdrawEmployees, externalSearch]);

  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + externalPageSize);
  const totalNum = filteredEmployees.length;

  const handleIncrementPageButton = () => {
    if (pageNo < Math.ceil(totalNum / externalPageSize)) setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto">
        <div className="min-w-[1000px]">
          {/* Header Section */}
          <div className="px-4 pt-0.5">
            <div className="grid grid-cols-[60px_1.5fr_1fr_1fr_auto] bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm">
              <span>Sr#</span>
              <span>Employee Name</span>
              <span>Withdraw Date</span>
              <span>Status</span>
              <span className="text-right pr-10">Actions</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="px-4 py-2">
            {paginatedEmployees.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No records available!</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedEmployees.map((withdraw, index) => (
                  <div
                    key={withdraw.withdrawalId}
                    className="grid grid-cols-[60px_1.5fr_1fr_1fr_auto] items-center p-1 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium pl-2">
                      {startIndex + index + 1}
                    </span>

                    {/* Name Column with Avatar Style */}
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center text-white flex-shrink-0 border-2 border-gray-100 shadow-sm">
                        <RiUserFill size={20} />
                      </div>
                      <span className="truncate font-semibold text-gray-800">
                        {withdraw.name}
                      </span>
                    </div>

                    {/* Date Column */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <RiCalendarLine className="text-blue-400" size={14} />
                      <span>{formatDate(withdraw.withdrawDate)}</span>
                    </div>

                    {/* Status Column */}
                    <div className="flex items-center gap-1 text-red-500 font-medium">
                      <IoIosClose size={20} />
                      <span>Withdraw</span>
                    </div>

                    {/* Actions Column */}
                    <div className="flex items-center justify-end gap-2 pr-2">
                      <button
                        onClick={() => {
                          setViewReason(withdraw);
                          setIsOpenModal("REASONWITHDRAW");
                        }}
                        className="flex items-center gap-1 p-1.5 px-3 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-xs font-semibold"
                        title="View Reason"
                      >
                        <TbFileCertificate size={16} />
                        Reason
                      </button>
                      <button
                        onClick={() => handleReactiveEmployee(withdraw.employeeId)}
                        className="flex items-center gap-1 p-1.5 px-3 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-all text-xs font-semibold"
                        title="Reactivate"
                      >
                        <BsCheck2 size={16} />
                        Reactivate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-row items-center justify-between py-4 px-4">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + externalPageSize, totalNum)}
          total={totalNum}
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
          existingWithdrawals={allWithdrawEmployees || []}
        />
      )}

      {isOpenModal === "REASONWITHDRAW" && (
        <ViewReasonWithDraw
          setIsOpenModal={() => setIsOpenModal("")}
          viewReason={viewReason}
        />
      )}
    </div>
  );
};