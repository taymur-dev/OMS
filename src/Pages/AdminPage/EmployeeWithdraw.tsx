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
  const { loader } = useAppSelector((state) => state.NavigateSate);
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
    <div className="w-full mx-2">
      <TableTitle
        tileName="Employee Withdraw"
        activeFile="Employees Withdraw list"
      />

      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white overflow-hidden flex flex-col">
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Employees Withdraw:{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [{filteredEmployees.length}]
            </span>
          </span>
          <CustomButton
            label="Add Withdraw"
            handleToggle={() => handleToggleViewModal("ADDWITHDRAW")}
          />
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
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

        <div className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
          <div
            className="grid grid-cols-[0.5fr_1fr_1fr_1fr] bg-gray-200 text-gray-900 font-semibold
           border border-gray-600 text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr#</span>
            <span>Employee Name</span>
            <span>Status</span>
            <span className="text-center w-28">Actions</span>
          </div>

          {paginatedEmployees.map((withdraw, index) => (
            <div
              className="grid grid-cols-[0.5fr_1fr_1fr_1fr] border border-gray-600 text-gray-800
                hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[4px]"
              key={withdraw.withdrawalId}
            >
              <span className="px-2">
                {(pageNo - 1) * itemsPerPage + index + 1}
              </span>
              <span>{withdraw.name}</span>
              <span className="withdraw-button">
                <IoIosClose size={20} title="Withdraw" />
                Withdraw
              </span>
              <div className="flex gap-2">
                <span
                  onClick={() => handleClickReason(withdraw)}
                  className="reason-button"
                >
                  <TbFileCertificate size={20} title="Reason" />
                  Reason
                </span>
                <span
                  className="active-button"
                  onClick={() => handleReactiveEmployee(withdraw.employeeId)}
                >
                  <BsCheck2 size={20} title="Active" />
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber
          start={
            paginatedEmployees.length === 0
              ? 0
              : (pageNo - 1) * itemsPerPage + 1
          }
          end={Math.min(pageNo * itemsPerPage, filteredEmployees.length)}
          total={filteredEmployees.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

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
