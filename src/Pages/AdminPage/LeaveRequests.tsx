import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
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
import { Footer } from "../../Components/Footer";

const numbers = [10, 25, 50, 100];

type ADDLEAVET = {
  id: number;
  leaveSubject: string;
  leaveReason: string;
  date: string;
  leaveStatus: string;
  status: string;
  name: string;
};

type ISOPENMODALT = "ADDLEAVE" | "VIEW" | "UPDATE" | "DELETE" | "";

export const LeaveRequests = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<ISOPENMODALT | "">("");
  const [EditLeave, setEditLeave] = useState<ADDLEAVET | null>(null);
  const [allLeaves, setAllLeaves] = useState<ADDLEAVET[]>([]);
  const [selectedValue, setSelectedValue] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
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
      setSelectedLeave(null);
    } catch (error) {
      console.error("Error deleting leave:", error);
    }
  };

  const handleRefresh = useCallback(
    async (updatedLeave?: ADDLEAVET) => {
      if (updatedLeave) {
        setAllLeaves((prev) =>
          prev.map((l) => (l.id === updatedLeave.id ? updatedLeave : l)),
        );
      } else {
        await handleGetAllLeaves();
      }
      setPageNo(1);
      setSearchTerm("");
    },
    [handleGetAllLeaves],
  );

  useEffect(() => {
    document.title = "(OMS) USER LEAVE";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("leaveList")), 1000);
  }, [dispatch]);

  useEffect(() => {
    handleGetAllLeaves();
  }, [handleGetAllLeaves]);

  const handleToggleViewModal = (active: ISOPENMODALT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleClickEditButton = (data: ADDLEAVET) => {
    handleToggleViewModal("UPDATE");
    setEditLeave(data);
  };

  const handleChangeShowData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(Number(e.target.value));
    setPageNo(1);
  };

  const filteredLeaves = useMemo(() => {
    return allLeaves.filter(
      (leave) =>
        leave.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.leaveSubject.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allLeaves, searchTerm]);

  const paginatedLeaves = useMemo(() => {
    const startIndex = (pageNo - 1) * selectedValue;
    return filteredLeaves.slice(startIndex, startIndex + selectedValue);
  }, [filteredLeaves, pageNo, selectedValue]);

  const startIndex = (pageNo - 1) * selectedValue;

  if (loader) return <Loader />;

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium capitalize";

    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <span
            className={`${baseClasses} bg-green-100 text-green-700 border border-green-200`}
          >
            Approved
          </span>
        );
      case "rejected":
        return (
          <span
            className={`${baseClasses} bg-red-100 text-red-700 border border-red-200`}
          >
            Rejected
          </span>
        );
      case "pending":
        return (
          <span
            className={`${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-200`}
          >
            Pending
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`}
          >
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Leave button as the rightElement */}
        <TableTitle
          tileName="Leave"
          rightElement={
            <CustomButton
              label="+ Add Leave"
              handleToggle={() => handleToggleViewModal("ADDLEAVE")}
            />
          }
        />

        <hr className="border border-b border-gray-200" />

        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            {/* Left Side: Show entries */}
            <div className="text-sm flex items-center">
              <span>Show</span>
              <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
                <select
                  value={selectedValue}
                  onChange={handleChangeShowData}
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
              className="grid grid-cols-6 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              {currentUser?.role === "admin" && <span>Employee Name</span>}
              <span>Subject Leave</span>
              <span>Date</span>
              <span>Status</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedLeaves.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedLeaves.map((leave, index) => (
                <div
                  key={leave.id}
                  className="grid grid-cols-6 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{startIndex + index + 1}</span>
                  {currentUser?.role === "admin" && (
                    <span className="truncate">{leave.name}</span>
                  )}
                  <span className="truncate">{leave.leaveSubject}</span>
                  <span>
                    {new Date(leave.date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </span>
                  <span>{getStatusBadge(leave.leaveStatus)}</span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    {(currentUser?.role === "admin" ||
                      leave.name === currentUser?.name) && (
                      <EditButton
                        handleUpdate={() => handleClickEditButton(leave)}
                      />
                    )}
                    <ViewButton
                      handleView={() => {
                        setViewLeave(leave);
                        handleToggleViewModal("VIEW");
                      }}
                    />
                    {(currentUser?.role === "admin" ||
                      leave.name === currentUser?.name) && (
                      <DeleteButton
                        handleDelete={() => {
                          setSelectedLeave(leave);
                          setIsOpenModal("DELETE");
                        }}
                      />
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={filteredLeaves.length === 0 ? 0 : startIndex + 1}
            end={Math.min(startIndex + selectedValue, filteredLeaves.length)}
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
                  Math.ceil(filteredLeaves.length / selectedValue),
                ),
              )
            }
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
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

      {isOpenModal === "DELETE" && selectedLeave && (
        <ConfirmationModal
          isOpen={() => setIsOpenModal("")}
          onClose={() => setIsOpenModal("")}
          onConfirm={handleDeleteLeave}
          message="Are you sure you want to delete this leave?"
        />
      )}

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
