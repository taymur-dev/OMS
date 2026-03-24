import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { Loader } from "../../Components/LoaderComponent/Loader";
import { Pagination } from "../../Components/Pagination/Pagination";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { AddHoliday } from "../../Components/HolidayModals/AddHoliday";
import { UpdateHoliday } from "../../Components/HolidayModals/UpdateHoliday";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import {
  ViewHoliday,
  HolidayDetailT,
} from "../../Components/HolidayModals/ViewHoliday";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { BASE_URL } from "../../Content/URL";
import { RiInboxArchiveLine } from "react-icons/ri";

type THOLIDAYMODAL = "EDIT" | "DELETE" | "ADDHOLIDAY" | "VIEW" | "";

interface HOLIDAYSTATET {
  id: number;
  holiday: string;
  fromDate: string;
  toDate: string;
}

interface HolidaysProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const Holidays = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: HolidaysProps) => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);

  const token = currentUser?.token;

  const [allHoliday, setAllHoliday] = useState<HOLIDAYSTATET[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<THOLIDAYMODAL>("");
  const [editHoliday, setEditHoliday] = useState<HOLIDAYSTATET | null>(null);
  const [catchId, setCatchId] = useState<number | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [viewHoliday, setViewHoliday] = useState<HolidayDetailT | null>(null);

  const handleGetAllHolidays = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getHolidays`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllHoliday(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  // Sync pagination with external filters
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  const handleDeleteHoliday = async () => {
    if (!catchId) return;
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/admin/deleteHoliday/${catchId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.error(res.data.message);
      handleGetAllHolidays();
      setIsOpenModal("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleViewModal = (modal: THOLIDAYMODAL) => {
    setIsOpenModal((prev) => (prev === modal ? "" : modal));
  };

  const handleUpdateHoliday = (holiday: HOLIDAYSTATET) => {
    setEditHoliday(holiday);
    handleToggleViewModal("EDIT");
  };

  const handleDeleteCall = (id: number) => {
    setCatchId(id);
    handleToggleViewModal("DELETE");
  };

  const handleViewHoliday = (holiday: HOLIDAYSTATET) => {
    setViewHoliday({
      holiday: holiday.holiday,
      fromDate: holiday.fromDate,
      toDate: holiday.toDate,
    });
    handleToggleViewModal("VIEW");
  };

  const filteredHolidays = useMemo(
    () =>
      [...allHoliday]
        .sort((a, b) => a.id - b.id) // Sorting by newest first
        .filter((holiday) =>
          holiday.holiday.toLowerCase().includes(externalSearch.toLowerCase()),
        ),
    [allHoliday, externalSearch],
  );

  const totalNum = filteredHolidays.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedHolidays = useMemo(
    () => filteredHolidays.slice(startIndex, startIndex + externalPageSize),
    [filteredHolidays, startIndex, externalPageSize],
  );

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(totalNum / externalPageSize);
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    document.title = "(OMS) HOLIDAYS";
    handleGetAllHolidays();
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("holidays")), 1000);
  }, [dispatch, handleGetAllHolidays]);

  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("ADDHOLIDAY");
    }
  }, [triggerModal]);

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        {/* Updated min-width to match UsersDetails feel */}
        <div className="min-w-[1000px]">
          {/* Header Row - Aligned with UsersDetails grid and spacing */}
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[60px_1fr_1fr_1fr_auto] 
            bg-blue-400 text-white rounded-lg items-center font-bold
            text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span className="text-left">Sr#</span>
              <span className="text-left">Holiday Name</span>
              <span className="text-left">From Date</span>
              <span className="text-left">To Date</span>
              {/* Action width and padding matched to UsersDetails */}
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>

          <div className="px-0.5 py-2">
            {paginatedHolidays.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No records available!</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedHolidays.map((holi, index) => (
                  <div
                    key={holi.id}
                    className="grid grid-cols-[60px_1fr_1fr_1fr_auto] 
                  items-center px-3 py-2 gap-3 text-sm bg-white 
                  border border-gray-100 rounded-lg 
                  hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Icon removed, text styles aligned to user name style */}
                    <div className="flex items-center overflow-hidden">
                      <span
                        className="truncate text-gray-800"
                        title={holi.holiday}
                      >
                        {holi.holiday.length > 20
                          ? holi.holiday.slice(0, 20) + "..."
                          : holi.holiday}
                      </span>
                    </div>

                    <span className="text-gray-600 truncate">
                      {formatDate(holi.fromDate)}
                    </span>
                    <span className="text-gray-600 truncate">
                      {formatDate(holi.toDate)}
                    </span>

                    {/* Actions container width matched to 140px */}
                    <div className="flex items-center justify-end gap-1 w-[140px]">
                      <ViewButton handleView={() => handleViewHoliday(holi)} />
                      <EditButton
                        handleUpdate={() => handleUpdateHoliday(holi)}
                      />
                      <DeleteButton
                        handleDelete={() => handleDeleteCall(holi.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Section - Simplified padding to match UsersDetails */}
      <div className="flex flex-row items-center justify-between p-1 mt-2">
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
      {isOpenModal === "ADDHOLIDAY" && (
        <AddHoliday
          handleGetAllHodidays={handleGetAllHolidays}
          setModal={() => setIsOpenModal("")}
          allHoliday={allHoliday}
        />
      )}

      {isOpenModal === "EDIT" && editHoliday && (
        <UpdateHoliday
          setModal={() => setIsOpenModal("")}
          handleGetAllHodidays={handleGetAllHolidays}
          editHoliday={editHoliday}
          allHoliday={allHoliday}
        />
      )}

      {isOpenModal === "VIEW" && viewHoliday && (
        <ViewHoliday
          setIsOpenModal={() => setIsOpenModal("")}
          viewHoliday={viewHoliday}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("DELETE")}
          message="Are you sure you want to delete this Holiday?"
          onClose={() => handleToggleViewModal("")}
          onConfirm={handleDeleteHoliday}
        />
      )}
    </div>
  );
};
