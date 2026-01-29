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
import { Footer } from "../../Components/Footer";

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
  leaveStatus: string | null;
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
    null,
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
        Array.isArray(res.data) ? res.data.sort((a, b) => a.id - b.id) : [],
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to fetch attendance",
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
        att.attendanceStatus?.toLowerCase().includes(searchTerm.toLowerCase()),
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
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.error("Attendance deleted successfully");
      handleGetAttendance();
      setIsOpenModal("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete attendance");
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Attendance button */}
        <TableTitle
          tileName="User Attendance"
          rightElement={
            isAdmin && (
              <CustomButton
                label="+ Add Attendance"
                handleToggle={() => setIsOpenModal("ADDATTENDANCE")}
              />
            )
          }
        />

        <hr className="border border-b border-gray-200" />

        {/* Filter and Search Section */}
        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            {/* Left Side: Show entries */}
            <div className="text-sm flex items-center">
              <span>Show</span>
              <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
                <select
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(+e.target.value)}
                  className="bg-transparent outline-none py-1 cursor-pointer"
                >
                  {numbers.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </span>
              <span className="hidden xs:inline">entries</span>
            </div>

            {/* Right Side: Search Input */}
            <TableInputField
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto px-2">
          <div className="min-w-[900px]">
            {/* Sticky Table Header */}
            <div
              className={`grid ${
                isAdmin ? "grid-cols-8" : "grid-cols-6"
              } bg-indigo-900 text-white items-center font-semibold text-sm sticky top-0 z-10 p-2`}
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

            {/* Table Body */}
            {paginatedAttendance.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedAttendance.map((att, index) => (
                <div
                  key={att.id}
                  className={`grid ${
                    isAdmin ? "grid-cols-8" : "grid-cols-6"
                  } border-b border-x border-gray-200 text-gray-800 items-center text-sm p-2 hover:bg-gray-50 transition`}
                >
                  <span>{startIndex + index + 1}</span>
                  {isAdmin && (
                    <span className="truncate font-medium">{att.name}</span>
                  )}
                  <span>{att.clockIn ?? "--"}</span>
                  <span>{att.clockOut ?? "--"}</span>
                  <span>{att.workingHours ?? "--"}</span>
                  <span>
                    {new Date(att.date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </span>
                  <span>{att.day ?? "--"}</span>

                  {isAdmin && (
                    <span className="flex flex-nowrap justify-center gap-1">
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
              ))
            )}
          </div>
        </div>

        {/* --- BOTTOM SECTION (Pagination) --- */}
        {/* Added p-4 and items-center to match the visual spacing in the screenshot */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between">
          <ShowDataNumber
            start={paginatedAttendance.length === 0 ? 0 : startIndex + 1}
            end={Math.min(endIndex, filteredAttendance.length)}
            total={filteredAttendance.length}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={() =>
              setPageNo((p) => Math.max(p - 1, 1))
            }
            handleIncrementPageButton={() =>
              endIndex < filteredAttendance.length && setPageNo((p) => p + 1)
            }
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
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

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
