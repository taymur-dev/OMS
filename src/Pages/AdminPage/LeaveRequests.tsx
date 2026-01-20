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

  return (
    <div className="w-full px-2 sm:px-4">
      <TableTitle tileName="Leave" activeFile="Users Leaves list" />

      <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
          <span className="text-sm sm:text-base">
            Total Leaves:{" "}
            <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
              {filteredLeaves.length}
            </span>
          </span>

          <CustomButton
            label="Add Leave"
            handleToggle={() => handleToggleViewModal("ADDLEAVE")}
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 text-gray-800">
          <div className="text-sm">
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select
                value={selectedValue}
                onChange={handleChangeShowData}
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

          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Table Wrapper */}
        <div className="mx-2 mt-2 overflow-x-auto max-h-[28.4rem]">
          <div className="min-w-[700px]">
            {/* Table Header */}
            <div
              className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] items-center sm:grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] 
          bg-indigo-900 text-white font-semibold text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              {currentUser?.role === "admin" && <span>Employee Name</span>}
              <span>Subject Leave</span>
              <span>Date</span>
              <span>Status</span>
              <span className="text-center w-28">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedLeaves.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-4">
                No leaves found
              </div>
            ) : (
              paginatedLeaves.map((leave, index) => (
                <div
                  key={leave.id}
                  className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] items-center sm:grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] 
            border border-gray-300 text-gray-800 text-sm p-2
            hover:bg-gray-100 transition items-center"
                >
                  <span className="text-left">{startIndex + index + 1}</span>
                  {currentUser?.role === "admin" && (
                    <span className="truncate text-left">{leave.name}</span>
                  )}
                  <span className="truncate text-left">
                    {leave.leaveSubject}
                  </span>
                  <span className="text-left">
                    {new Date(leave.date).toLocaleDateString("sv-SE")}
                  </span>
                  <span className="text-left">{leave.leaveStatus}</span>
                  <span className="text-left flex flex-nowrap items-center gap-1">
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
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-3">
        <ShowDataNumber
          start={startIndex + 1}
          end={Math.min(startIndex + selectedValue, filteredLeaves.length)}
          total={filteredLeaves.length}
        />

        <Pagination
          pageNo={pageNo}
          handleIncrementPageButton={() =>
            setPageNo((prev) =>
              Math.min(
                prev + 1,
                Math.ceil(filteredLeaves.length / selectedValue),
              ),
            )
          }
          handleDecrementPageButton={() =>
            setPageNo((prev) => Math.max(prev - 1, 1))
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

      {isOpenModal === "DELETE" && selectedLeave && (
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
