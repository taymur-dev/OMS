import { useEffect, useState, useCallback, useMemo } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { AddAttendance } from "../../Components/AttendanceComponent/AddAttendance";
import { UpdateAttendance } from "../../Components/AttendanceComponent/UpdateAttendance";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";

import { BASE_URL } from "../../Content/URL";

const numbers = [10, 25, 50, 100];

type ISOPENMODALT = "ADDATTENDANCE" | "EDITATTENDANCE" | "DELETE";

type AttendanceT = {
  id: number;
  attendanceStatus: string;
  clockIn: string;
  clockOut: string;
  date: string;
  day: string;
  leaveApprovalStatus: string | null;
  leaveReason: string | null;
  name: string;
  role: string;
  status: string;
  userId: number;
  workingHours: string;
};

export const UserAttendance = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateSate);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const [allAttendance, setAllAttendance] = useState<AttendanceT[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);

  const [isOpenModal, setIsOpenModal] = useState<ISOPENMODALT | "">("");
  const [updatedAttendance, setUpdatedAttendance] =
    useState<AttendanceT | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);

  const handleGetALLattendance = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getAllAttendances`, {
        headers: { Authorization: token },
      });

      const sortedData = res.data.sort(
        (a: AttendanceT, b: AttendanceT) => a.id - b.id
      );

      setAllAttendance(sortedData);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to fetch data"
      );
    }
  }, [token]);

  useEffect(() => {
    document.title = "(OMS) USER ATTENDANCE";
    handleGetALLattendance();
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Users"));
    }, 1000);
  }, [dispatch, handleGetALLattendance]);

  // Reset page when search term or page size changes
  useEffect(() => {
    setPageNo(1);
  }, [searchTerm, selectedValue]);

  // Filtered and paginated attendance
  const filteredAttendance = useMemo(() => {
    return allAttendance.filter(
      (att) =>
        att.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        att.date.includes(searchTerm) ||
        att.attendanceStatus.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allAttendance, searchTerm]);

  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = startIndex + selectedValue;
  const paginatedAttendance = filteredAttendance.slice(startIndex, endIndex);

  // Pagination handlers
  const handleIncrementPageButton = () => {
    if (endIndex < filteredAttendance.length) setPageNo((prev) => prev + 1);
  };
  const handleDecrementPageButton = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedValue(Number(event.target.value));
  };

  const handleToggleViewModal = (active: ISOPENMODALT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const userAttendanceUpdate = (attendance: AttendanceT) => {
    setUpdatedAttendance(attendance);
    setIsOpenModal("EDITATTENDANCE");
  };

  const userAttendanceRecord = (id: number) => {
    setRecordToDelete(id);
    setIsOpenModal("DELETE");
  };

  const handleDeleteAttendance = async (id: number) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteAttendance/${id}`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      toast.success("Attendance record deleted successfully.");
      handleGetALLattendance();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to delete record"
      );
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Attendance" activeFile="Users Attendance list" />
      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white
       overflow-hidden flex flex-col"
      >
        {/* Header with total count and Add button */}
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total Attendance:{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [{filteredAttendance.length}]
            </span>
          </span>
          <CustomButton
            label="Add Attendance"
            handleToggle={() => handleToggleViewModal("ADDATTENDANCE")}
          />
        </div>

        {/* Show entries dropdown and search */}
        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select value={selectedValue} onChange={handleChangeShowData}>
                {numbers.map((num) => (
                  <option key={num} value={num}>
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

        {/* Table */}
        <div className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
          <div
            className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-gray-200 text-gray-900
           font-semibold border border-gray-600 text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr#</span>
            <span>Date</span>
            <span>Users</span>
            <span>Clock In</span>
            <span>Clock Out</span>
            <span>Working Hours</span>
            <span>Day</span>
            <span className="text-center w-28">Actions</span>
          </div>

          {paginatedAttendance.length === 0 ? (
            <div className="text-center text-gray-800 p-4">
              No attendance records available.
            </div>
          ) : (
            paginatedAttendance.map((attendance, index) => (
              <div
                key={attendance.id}
                className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] 
              border border-gray-600 text-gray-800 hover:bg-gray-100 transition duration-200 text-sm p-[7px]"
              >
                <span>{startIndex + index + 1}</span>
                <span>{attendance.date.slice(0, 10)}</span>
                <span>{attendance.name}</span>
                <span
                  className={`text-left ${
                    attendance.clockIn <= "09:15:00"
                      ? "text-green-500"
                      : attendance.clockIn <= "09:30:00"
                      ? "text-orange-500"
                      : "text-red-500"
                  }`}
                >
                  {attendance.clockIn ?? "--"}
                </span>
                <span
                  className={`text-left ${
                    attendance.clockOut === "18:00:00" ? "text-green-500" : ""
                  }`}
                >
                  {attendance.clockOut ?? "--"}
                </span>
                <span>{attendance.workingHours ?? "--"}</span>
                <span>{attendance.day ?? "--"}</span>
                <span className="flex items-center gap-1">
                  <EditButton
                    handleUpdate={() => userAttendanceUpdate(attendance)}
                  />
                  <DeleteButton
                    handleDelete={() => userAttendanceRecord(attendance.id)}
                  />
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {isOpenModal === "ADDATTENDANCE" && (
        <AddAttendance
          setModal={() => setIsOpenModal("")}
          handleGetALLattendance={handleGetALLattendance}
        />
      )}

      {isOpenModal === "EDITATTENDANCE" && updatedAttendance && (
        <UpdateAttendance
          setModal={() => setIsOpenModal("")}
          updatedAttendance={updatedAttendance}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => setIsOpenModal("DELETE")}
          onClose={() => setIsOpenModal("")}
          message="Are you sure you want to delete this Attendance?"
          onConfirm={() =>
            recordToDelete !== null && handleDeleteAttendance(recordToDelete)
          }
        />
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-2">
        <ShowDataNumber
          start={startIndex + 1}
          end={Math.min(endIndex, filteredAttendance.length)}
          total={filteredAttendance.length}
        />
        <Pagination
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
          pageNo={pageNo}
        />
      </div>
    </div>
  );
};
