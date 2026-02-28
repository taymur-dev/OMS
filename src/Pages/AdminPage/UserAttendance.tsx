import { useEffect, useState, useCallback, useMemo } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
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

// Icons for consistent UI
import {
  RiCalendarLine,
  RiTimeLine,
  RiHistoryLine,
  RiUserFill,
  RiInboxArchiveLine,
  RiSunLine,
} from "react-icons/ri";

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

interface UserAttendanceProps {
  triggerAdd: number;
  externalSearch: string;
  externalPageSize: number;
}

export const UserAttendance = ({
  triggerAdd,
  externalSearch,
  externalPageSize,
}: UserAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [allAttendance, setAllAttendance] = useState<AttendanceT[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [viewAttendance, setViewAttendance] = useState<AttendanceT | null>(
    null,
  );
  const [isOpenModal, setIsOpenModal] = useState<
    "ADDATTENDANCE" | "EDITATTENDANCE" | "DELETE" | ""
  >("");
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
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllAttendance(
        Array.isArray(res.data) ? res.data.sort((a, b) => b.id - a.id) : [],
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to fetch attendance",
      );
    }
  }, [token, currentUser, isAdmin]);

  useEffect(() => {
    document.title = "(OMS) USER ATTENDANCE";
    handleGetAttendance();
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Attendance"));
    }, 500);
  }, [dispatch, handleGetAttendance]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerAdd && triggerAdd > 0 && isAdmin) {
      setIsOpenModal("ADDATTENDANCE");
    }
  }, [triggerAdd, isAdmin]);

  const filteredAttendance = useMemo(() => {
    return allAttendance.filter(
      (att) =>
        att.name?.toLowerCase().includes(externalSearch.toLowerCase()) ||
        att.date.includes(externalSearch) ||
        att.attendanceStatus
          ?.toLowerCase()
          .includes(externalSearch.toLowerCase()),
    );
  }, [allAttendance, externalSearch]);

  const totalNum = filteredAttendance.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedAttendance = filteredAttendance.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  };

  const handleDeleteAttendance = async (id: number) => {
    if (!token) return;
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteAttendance/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Attendance deleted successfully");
      handleGetAttendance();
      setIsOpenModal("");
    } catch (error) {
      console.log(error);

      toast.error("Failed to delete attendance");
    }
  };

  if (loader) return <Loader />;

  // Column configuration for Admin vs User
  const gridCols = isAdmin
    ? "grid-cols-[60px_1.2fr_1fr_1fr_1fr_1fr_1fr_auto]"
    : "grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_auto]";

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto">
        <div className="min-w-[1100px]">
          {/* Header Section - Same as UsersDetails */}
          <div className="px-4 pt-0.5">
            <div
              className={`grid ${gridCols} bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm`}
            >
              <span>Sr#</span>
              {isAdmin && <span>Employee</span>}
              <span>Clock In</span>
              <span>Clock Out</span>
              <span>Working Hours</span>
              <span>Date</span>
              <span>Day</span>
              <span className="text-right pr-6">Actions</span>
            </div>
          </div>

          {/* Body Section */}
          <div className="px-4 py-2">
            {paginatedAttendance.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No records available!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedAttendance.map((att, index) => (
                  <div
                    key={att.id}
                    className={`grid ${gridCols} items-center p-1 gap-3 text-sm bg-white border border-gray-100 
                    rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm`}
                  >
                    <span className="text-gray-500 font-medium ml-2">
                      {startIndex + index + 1}
                    </span>

                    {isAdmin && (
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-9 w-9 rounded-full bg-blue-400 flex items-center justify-center
                         text-white flex-shrink-0 border-2 border-gray-100">
                          <RiUserFill size={20} />
                        </div>
                        <span className="truncate font-semibold text-gray-800">
                          {att.name}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-600">
                      <RiTimeLine className="text-green-400" size={14} />
                      <span>{att.clockIn ?? "--"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <RiTimeLine className="text-red-400" size={14} />
                      <span>{att.clockOut ?? "--"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <RiHistoryLine className="text-orange-700" size={14} />
                      <span className="font-medium">
                        {att.workingHours ?? "--"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <RiCalendarLine className="text-yellow-400" size={14} />
                      <span>{formatDate(att.date)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <RiSunLine className="text-purple-700" size={14} />
                      <span>{att.day ?? "--"}</span>
                    </div>

                    <div className="flex items-center justify-end gap-1 pr-2">
                      <ViewButton handleView={() => setViewAttendance(att)} />
                      {isAdmin && (
                        <>
                          <EditButton
                            handleUpdate={() => {
                              setUpdatedAttendance(att);
                              setIsOpenModal("EDITATTENDANCE");
                            }}
                          />
                          <DeleteButton
                            handleDelete={() => {
                              setRecordToDelete(att.id);
                              setIsOpenModal("DELETE");
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Pagination - Same as UsersDetails */}
      <div className="flex flex-row items-center justify-between py-4 px-4">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() => {
            if (endIndex < totalNum) setPageNo((p) => p + 1);
          }}
        />
      </div>

      {/* Modals Section */}
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
          handleGetAttendance={handleGetAttendance}
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
