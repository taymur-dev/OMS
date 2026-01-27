import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
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
import { Footer } from "../../Components/Footer";

const numbers = [10, 25, 50, 100];

type THOLIDAYMODAL = "EDIT" | "DELETE" | "ADDHOLIDAY" | "VIEW" | "";

interface HOLIDAYSTATET {
  id: number;
  date: string;
  holiday: string;
}

export const Holidays = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);

  const token = currentUser?.token;

  const [allHoliday, setAllHoliday] = useState<HOLIDAYSTATET[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<THOLIDAYMODAL>("");
  const [editHoliday, setEditHoliday] = useState<HOLIDAYSTATET | null>(null);
  const [catchId, setCatchId] = useState<number | null>(null);

  const [selectedValue, setSelectedValue] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
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
      date: holiday.date,
    });
    handleToggleViewModal("VIEW");
  };

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  const handleChangeShowData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(Number(e.target.value));
    setPageNo(1);
  };

  const filteredHolidays = useMemo(
    () =>
      [...allHoliday]
        .sort((a, b) => a.id - b.id)
        .filter((holiday) =>
          holiday.holiday.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    [allHoliday, searchTerm],
  );

  const paginatedHolidays = useMemo(
    () =>
      filteredHolidays.slice(
        (pageNo - 1) * selectedValue,
        pageNo * selectedValue,
      ),
    [filteredHolidays, pageNo, selectedValue],
  );

  useEffect(() => {
    document.title = "(OMS) HOLIDAYS";
    handleGetAllHolidays();
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("holidays")), 1000);
  }, [dispatch, handleGetAllHolidays]);

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Holiday button as the rightElement */}
        <TableTitle
          tileName="Configure Holidays"
          rightElement={
            <CustomButton
              handleToggle={() => handleToggleViewModal("ADDHOLIDAY")}
              label="+ Add Holiday"
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
          <div className="min-w-[600px]">
            {/* Sticky Table Header */}
            <div
              className="grid grid-cols-4 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Holiday</span>
              <span>Date</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedHolidays.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedHolidays.map((holi, index) => (
                <div
                  key={holi.id}
                  className="grid grid-cols-4 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{(pageNo - 1) * selectedValue + index + 1}</span>
                  <span className="truncate">{holi.holiday}</span>
                  <span>
                    {new Date(holi.date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    <EditButton
                      handleUpdate={() => handleUpdateHoliday(holi)}
                    />
                    <ViewButton handleView={() => handleViewHoliday(holi)} />
                    <DeleteButton
                      handleDelete={() => handleDeleteCall(holi.id)}
                    />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={
              paginatedHolidays.length === 0
                ? 0
                : (pageNo - 1) * selectedValue + 1
            }
            end={Math.min(pageNo * selectedValue, filteredHolidays.length)}
            total={filteredHolidays.length}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={handleDecrementPageButton}
            handleIncrementPageButton={handleIncrementPageButton}
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
      {isOpenModal === "ADDHOLIDAY" && (
        <AddHoliday
          handleGetAllHodidays={handleGetAllHolidays}
          setModal={() => setIsOpenModal("")}
        />
      )}

      {isOpenModal === "EDIT" && editHoliday && (
        <UpdateHoliday
          setModal={() => setIsOpenModal("")}
          handleGetAllHodidays={handleGetAllHolidays}
          editHoliday={editHoliday}
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

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
