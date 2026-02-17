import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Pagination } from "../../Components/Pagination/Pagination";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { useCallback, useEffect, useState } from "react";
import { AddCalendarSession } from "../../Components/CalendarModal/AddCalendarSession";
import { ActivateCalendarSession } from "../../Components/CalendarModal/ActivateCalendarSession";
import { EditCalendarSession } from "../../Components/CalendarModal/EditCalendarSession";
import { ViewCalendarSession } from "../../Components/CalendarModal/ViewCalendarSession";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";

import { Loader } from "../../Components/LoaderComponent/Loader";
import { Footer } from "../../Components/Footer";

const numbers = [10, 25, 50, 100];

type CALENDART = "ADD" | "EDIT" | "VIEW" | "DELETE" | "ACTIVATE" | "";

type CalendarSession = {
  id?: number;
  session_name: string;
  year: string;
  month: string;
  calendarStatus?: string;
};

export const Calendar = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<CALENDART>("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [calendarList, setCalendarList] = useState<CalendarSession[]>([]);
  const [selectedSession, setSelectedSession] =
    useState<CalendarSession | null>(null);

  const token = currentUser?.token;

  const handleIncrementPageButton = () => {
    setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleToggleViewModal = (active: CALENDART) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleGetAllCalendar = useCallback(
    async (externalData?: CalendarSession[]): Promise<void> => {
      try {
        let mappedData: CalendarSession[];

        if (externalData) {
          mappedData = externalData;
        } else {
          const res = await axios.get(
            `${BASE_URL}/api/admin/getCalendarSession`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          mappedData = (res.data.data || res.data).map(
            (item: CalendarSession) => ({
              id: item.id,
              session_name: item.session_name,
              year: item.year,
              month: item.month,
              calendarStatus: item.calendarStatus,
            }),
          );
        }

        setCalendarList(mappedData);
      } catch (error) {
        console.error("Error fetching calendar sessions:", error);
      }
    },
    [token],
  );

  const handleDeleteCalendarSession = async () => {
    if (!selectedSession?.id) {
      console.error("No session selected or ID missing!");
      return;
    }

    try {
      console.log("Deleting session with ID:", selectedSession.id);

      const res = await axios.delete(
        `${BASE_URL}/api/admin/deleteCalendarSession/${selectedSession.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log("Delete response:", res.data);

      // Refresh the table
      await handleGetAllCalendar();

      // Close the modal
      handleToggleViewModal("");
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const handleClickEditButton = (session: CalendarSession) => {
    setSelectedSession(session);
    handleToggleViewModal("EDIT");
  };

  const handleClickViewButton = (session: CalendarSession) => {
    setSelectedSession(session);
    handleToggleViewModal("VIEW");
  };

  const handleClickDeleteButton = (session: CalendarSession) => {
    setSelectedSession(session);
    handleToggleViewModal("DELETE");
  };

  useEffect(() => {
    handleGetAllCalendar();
    document.title = "(OMS) CALENDAR";

    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("CALENDAR"));
    }, 1000);
  }, [dispatch, handleGetAllCalendar]);

  const uniqueSessions = calendarList.reduce<CalendarSession[]>((acc, curr) => {
    if (!acc.find((s) => s.session_name === curr.session_name)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const filteredCalendarList = uniqueSessions.filter((item) =>
    `${item.session_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Paginate
  const startIndex = (pageNo - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCalendarList = filteredCalendarList.slice(
    startIndex,
    endIndex,
  );

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Button as the rightElement */}
        <TableTitle
          tileName="Calendar List"
          rightElement={
            <CustomButton
              handleToggle={() => handleToggleViewModal("ADD")}
              label="+ Add Calendar Session"
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
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPageNo(1);
                  }}
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

            <div className="flex flex-col items-end">
              <TableInputField
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />

              <CustomButton
                label="Activate Calendar Session"
                handleToggle={() => handleToggleViewModal("ACTIVATE")}
              />
            </div>
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto px-2">
          <div className="min-w-[500px]">
            {/* Sticky Table Header */}
            <div
              className="grid grid-cols-3 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Session Name</span>
              <span>Actions</span>
            </div>

            {/* Table Body */}
            {/* Table Body */}
            {paginatedCalendarList.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedCalendarList.map((item, index) => (
                <div
                  key={item.id || index}
                  className="grid grid-cols-3 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{startIndex + index + 1}</span>
                  <span>{item.session_name}</span>
                  <span className="flex flex-nowrap gap-1">
                    <EditButton
                      handleUpdate={() => handleClickEditButton(item)}
                    />
                    <ViewButton
                      handleView={() => handleClickViewButton(item)}
                    />
                    <DeleteButton
                      handleDelete={() => handleClickDeleteButton(item)}
                    />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={filteredCalendarList.length === 0 ? 0 : startIndex + 1}
            end={Math.min(endIndex, filteredCalendarList.length)}
            total={filteredCalendarList.length}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={handleDecrementPageButton}
            handleIncrementPageButton={handleIncrementPageButton}
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
      {isOpenModal === "ADD" && (
        <AddCalendarSession
          setModal={() => handleToggleViewModal("")}
          refreshCalendar={handleGetAllCalendar}
        />
      )}

      {isOpenModal === "EDIT" && selectedSession && (
        <EditCalendarSession
          setModal={() => handleToggleViewModal("")}
          refreshCalendar={handleGetAllCalendar}
          selectedSession={selectedSession}
        />
      )}

      {isOpenModal === "VIEW" && selectedSession && (
        <ViewCalendarSession
          setModal={() => handleToggleViewModal("")}
          selectedSession={selectedSession}
          allSessions={calendarList}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => {}}
          onClose={() => setIsOpenModal("")}
          onConfirm={handleDeleteCalendarSession}
        />
      )}

      {isOpenModal === "ACTIVATE" && (
        <ActivateCalendarSession
          setModal={() => handleToggleViewModal("")}
          refreshSessions={handleGetAllCalendar}
        />
      )}

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
