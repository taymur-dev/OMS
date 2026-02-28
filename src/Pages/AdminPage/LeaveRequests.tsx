import { useCallback, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddLeave } from "../../Components/LeaveModals/AddLeave";
import { UpdateLeave } from "../../Components/LeaveModals/UpdateLeave";
import { ViewLeave } from "../../Components/LeaveModals/ViewLeave";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import {
  RiCalendarLine,
  RiFileTextLine,
  RiUserFill,
  RiInboxArchiveLine,
  RiTimeLine,
} from "react-icons/ri";

type ADDLEAVET = {
  id: number;
  leaveSubject: string;
  leaveReason: string;
  fromDate: string;
  toDate: string;
  leaveStatus: string;
  status: string;
  name: string;
};

type ISOPENMODALT = "ADDLEAVE" | "VIEW" | "UPDATE" | "DELETE" | "";

interface LeaveRequestsProps {
  triggerAdd: number;
  externalSearch: string;
  externalPageSize: number;
}

export const LeaveRequests = ({
  triggerAdd,
  externalSearch,
  externalPageSize,
}: LeaveRequestsProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<ISOPENMODALT | "">("");
  const [EditLeave, setEditLeave] = useState<ADDLEAVET | null>(null);
  const [allLeaves, setAllLeaves] = useState<ADDLEAVET[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [viewLeave, setViewLeave] = useState<ADDLEAVET | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<ADDLEAVET | null>(null);

  const handleGetAllLeaves = useCallback(async () => {
    if (!currentUser) return;
    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getUsersLeaves`
          : `${BASE_URL}/api/user/getMyLeaves`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllLeaves(res.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setAllLeaves([]);
    }
  }, [currentUser, token]);

  useEffect(() => {
    document.title = "(OMS) USER LEAVE";
    dispatch(navigationStart());
    handleGetAllLeaves();
    setTimeout(() => dispatch(navigationSuccess("leaveList")), 1000);
  }, [dispatch, handleGetAllLeaves]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerAdd && triggerAdd > 0) {
      setIsOpenModal("ADDLEAVE");
    }
  }, [triggerAdd]);

  const handleDeleteLeave = async () => {
    if (!selectedLeave || !currentUser) return;
    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/deleteLeave/${selectedLeave.id}`
          : `${BASE_URL}/api/user/deleteLeave/${selectedLeave.id}`;

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllLeaves((prev) => prev.filter((l) => l.id !== selectedLeave.id));
      setIsOpenModal("");
    } catch (error) {
      console.error("Error deleting leave:", error);
    }
  };

  const handleRefresh = useCallback(async () => {
    await handleGetAllLeaves();
    setPageNo(1);
  }, [handleGetAllLeaves]);

  const filteredLeaves = useMemo(() => {
    return allLeaves.filter(
      (leave) =>
        leave.name.toLowerCase().includes(externalSearch.toLowerCase()) ||
        leave.leaveSubject.toLowerCase().includes(externalSearch.toLowerCase()),
    );
  }, [allLeaves, externalSearch]);

  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedLeaves = filteredLeaves.slice(
    startIndex,
    startIndex + externalPageSize,
  );

  if (loader) return <Loader />;

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border";
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <span
            className={`${baseClasses} bg-green-800 text-white border-green-200`}
          >
            Approved
          </span>
        );
      case "rejected":
        return (
          <span
            className={`${baseClasses} bg-red-800 text-white border-red-200`}
          >
            Rejected
          </span>
        );
      case "pending":
        return (
          <span
            className={`${baseClasses} bg-orange-500 text-white border-orange-200`}
          >
            Pending
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} bg-gray-50 text-gray-700 border-gray-200`}
          >
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  };

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto">
        <div className="min-w-[1000px]">
          {/* Header UI mimicking UsersDetails */}
          <div className="px-4 pt-0.5">
            <div
              className={`grid ${currentUser?.role === "admin" ? "grid-cols-[60px_1.2fr_1.2fr_1fr_1fr_0.8fr_auto]" : "grid-cols-[60px_1.5fr_1fr_1fr_1fr_auto]"} 
              bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm`}
            >
              <span>Sr#</span>
              {currentUser?.role === "admin" && <span>Employee</span>}
              <span>Subject</span>
              <span>From Date</span>
              <span>To Date</span>
              <span>Status</span>
              <span className="text-right pr-10">Actions</span>
            </div>
          </div>

          {/* Body UI */}
          <div className="px-4 py-2">
            {paginatedLeaves.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedLeaves.map((leave, index) => (
                  <div
                    key={leave.id}
                    className={`grid ${currentUser?.role === "admin" ? "grid-cols-[60px_1.2fr_1.2fr_1fr_1fr_0.8fr_auto]" : "grid-cols-[60px_1.5fr_1fr_1fr_1fr_auto]"} 
                    items-center p-1 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm`}
                  >
                    <span className="text-gray-500 font-medium px-2">
                      {startIndex + index + 1}
                    </span>

                    {currentUser?.role === "admin" && (
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                          <RiUserFill size={18} />
                        </div>
                        <span className="truncate font-semibold text-gray-800">
                          {leave.name}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-600">
                      <RiFileTextLine
                        className="text-green-400 flex-shrink-0"
                        size={14}
                      />
                      <span className="truncate">{leave.leaveSubject}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <RiCalendarLine
                        className="text-blue-400 flex-shrink-0"
                        size={14}
                      />
                      <span>{formatDate(leave.fromDate)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <RiTimeLine
                        className="text-orange-400 flex-shrink-0"
                        size={14}
                      />
                      <span>{formatDate(leave.toDate)}</span>
                    </div>

                    <div>{getStatusBadge(leave.leaveStatus)}</div>

                    <div className="flex items-center justify-end gap-1 pr-2">
                      <ViewButton
                        handleView={() => {
                          setViewLeave(leave);
                          setIsOpenModal("VIEW");
                        }}
                      />
                      {(currentUser?.role === "admin" ||
                        leave.name === currentUser?.name) && (
                        <>
                          <EditButton
                            handleUpdate={() => {
                              setEditLeave(leave);
                              setIsOpenModal("UPDATE");
                            }}
                          />
                          <DeleteButton
                            handleDelete={() => {
                              setSelectedLeave(leave);
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

      {/* Pagination UI mimicking UsersDetails */}
      <div className="flex flex-row items-center justify-between py-4 px-4">
        <ShowDataNumber
          start={filteredLeaves.length === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + externalPageSize, filteredLeaves.length)}
          total={filteredLeaves.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() =>
            setPageNo((prev) => Math.max(prev - 1, 1))
          }
          handleIncrementPageButton={() =>
            setPageNo((prev) =>
              Math.min(
                prev + 1,
                Math.ceil(filteredLeaves.length / externalPageSize),
              ),
            )
          }
        />
      </div>

      {/* Modals */}
      {isOpenModal === "ADDLEAVE" && (
        <AddLeave
          setModal={() => setIsOpenModal("")}
          refreshLeaves={handleRefresh}
        />
      )}
      {isOpenModal === "UPDATE" && EditLeave && (
        <UpdateLeave
          setModal={() => setIsOpenModal("")}
          EditLeave={EditLeave}
          refreshLeaves={handleRefresh}
        />
      )}
      {isOpenModal === "VIEW" && viewLeave && (
        <ViewLeave setIsOpenModal={() => setIsOpenModal("")} data={viewLeave} />
      )}
      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => setIsOpenModal("")}
          onClose={() => setIsOpenModal("")}
          onConfirm={handleDeleteLeave}
          message="Are you sure you want to delete this leave?"
        />
      )}
    </div>
  );
};
