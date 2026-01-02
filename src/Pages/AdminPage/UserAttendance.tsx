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
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { AddAttendance } from "../../Components/AttendanceComponent/AddAttendance";
import { UpdateAttendance } from "../../Components/AttendanceComponent/UpdateAttendance";
import { ViewAttendance } from "../../Components/AttendanceComponent/ViewAttendance";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";

import { BASE_URL } from "../../Content/URL";

const numbers = [10, 25, 50, 100];

type ISOPENMODALT = "ADDATTENDANCE" | "EDITATTENDANCE" | "DELETE";

export type AttendanceT = {
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
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [allAttendance, setAllAttendance] = useState<AttendanceT[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);

  const [viewAttendance, setViewAttendance] = useState<AttendanceT | null>(
    null
  );

  const [isOpenModal, setIsOpenModal] = useState<ISOPENMODALT | "">("");
  const [updatedAttendance, setUpdatedAttendance] =
    useState<AttendanceT | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);

  const handleGetAttendance = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
      const url = isAdmin
        ? `${BASE_URL}/api/admin/getAllAttendances`
        : `${BASE_URL}/api/user/getMyAttendances`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllAttendance(
        Array.isArray(res.data) ? res.data.sort((a, b) => a.id - b.id) : []
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to fetch attendance"
      );
      setAllAttendance([]);
    }
  }, [token, currentUser, isAdmin]);

  useEffect(() => {
    document.title = "(OMS) USER ATTENDANCE";
    handleGetAttendance();

    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Users"));
    }, 500);
  }, [dispatch, handleGetAttendance]);

  useEffect(() => {
    setPageNo(1);
  }, [searchTerm, selectedValue]);

  const filteredAttendance = useMemo(() => {
    return allAttendance.filter(
      (att) =>
        att.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        att.date.includes(searchTerm) ||
        att.attendanceStatus?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allAttendance, searchTerm]);

  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = startIndex + selectedValue;
  const paginatedAttendance = filteredAttendance.slice(startIndex, endIndex);

  const handleDeleteAttendance = async (id: number) => {
    if (!token) return;

    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteAttendance/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Attendance deleted successfully");
      handleGetAttendance();
      setIsOpenModal("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete attendance");
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Attendance" activeFile="Attendance list" />

      <div className="max-h-[74.5vh] shadow-lg border-t-2 rounded border-indigo-500 bg-white flex flex-col">
        <div className="flex items-center justify-between mx-2">
          <span>
            Total Attendance:
            <span className="text-2xl text-blue-500 font-semibold ml-1">
              [{filteredAttendance.length}]
            </span>
          </span>

          {isAdmin && (
            <CustomButton
              label="Add Attendance"
              handleToggle={() => setIsOpenModal("ADDATTENDANCE")}
            />
          )}
        </div>

        <div className="flex justify-between mx-2">
          <div>
            <span>Show</span>
            <select
              value={selectedValue}
              onChange={(e) => setSelectedValue(+e.target.value)}
              className="bg-gray-200 mx-1 p-1 rounded"
            >
              {numbers.map((num) => (
                <option key={num}>{num}</option>
              ))}
            </select>
            <span>entries</span>
          </div>

          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="overflow-y-auto">
          <div
            className={`grid ${
              isAdmin
                ? "grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                : "grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr]"
            } bg-gray-200 font-semibold p-2 sticky top-0`}
          >
            <span>Sr#</span>
            {isAdmin && <span>User</span>}
            <span>Clock In</span>
            <span>Clock Out</span>
            <span>Working Hours</span>
            <span>Date</span>
            <span>Day</span>
            {isAdmin && <span className="text-center">Actions</span>}
          </div>

          {paginatedAttendance.map((att, index) => (
            <div
              key={att.id}
              className={`grid ${
                isAdmin
                  ? "grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                  : "grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr]"
              } border p-2 hover:bg-gray-100`}
            >
              <span>{startIndex + index + 1}</span>
              {isAdmin && <span>{att.name}</span>}
              <span>{att.clockIn ?? "--"}</span>
              <span>{att.clockOut ?? "--"}</span>
              <span>{att.workingHours ?? "--"}</span>
              <span>{att.date.slice(0, 10)}</span>
              <span>{att.day ?? "--"}</span>

              {isAdmin && (
                <span className="flex justify-center gap-1">
                  <EditButton
                    handleUpdate={() => {
                      setUpdatedAttendance(att);
                      setIsOpenModal("EDITATTENDANCE");
                    }}
                  />

                  <ViewButton handleView={() => setViewAttendance(att)} />

                  <DeleteButton
                    handleDelete={() => {
                      setRecordToDelete(att.id);
                      setIsOpenModal("DELETE");
                    }}
                  />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <ShowDataNumber
          start={startIndex + 1}
          end={Math.min(endIndex, filteredAttendance.length)}
          total={filteredAttendance.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() =>
            endIndex < filteredAttendance.length && setPageNo((p) => p + 1)
          }
        />
      </div>

      {isOpenModal === "ADDATTENDANCE" && (
        <AddAttendance
          setModal={() => setIsOpenModal("")}
          handleGetALLattendance={handleGetAttendance}
        />
      )}

      {isOpenModal === "EDITATTENDANCE" && updatedAttendance && (
        <UpdateAttendance
          setModal={() => setIsOpenModal("")}
          updatedAttendance={updatedAttendance}
        />
      )}

      {viewAttendance && (
        <ViewAttendance
          setIsOpenModal={() => setViewAttendance(null)}
          viewAttendance={viewAttendance}
        />
      )}

      {isOpenModal === "DELETE" && recordToDelete && (
        <ConfirmationModal
          isOpen={() => {}}
          onClose={() => setIsOpenModal("")}
          onConfirm={() => handleDeleteAttendance(recordToDelete)}
        />
      )}
    </div>
  );
};
