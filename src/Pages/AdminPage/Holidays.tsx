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
        { headers: { Authorization: `Bearer ${token}` } }
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
        holiday.holiday.toLowerCase().includes(searchTerm.toLowerCase())
      ),
  [allHoliday, searchTerm]
);


  const paginatedHolidays = useMemo(
    () =>
      filteredHolidays.slice(
        (pageNo - 1) * selectedValue,
        pageNo * selectedValue
      ),
    [filteredHolidays, pageNo, selectedValue]
  );

  useEffect(() => {
    document.title = "(OMS) HOLIDAYS";
    handleGetAllHolidays();
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("holidays")), 1000);
  }, [dispatch, handleGetAllHolidays]);

  if (loader) return <Loader />;

 return (
  <div className="w-full px-2 sm:px-4">
    <TableTitle tileName="Configure Holidays" activeFile="Holidays List" />

    <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
        <span className="text-sm sm:text-base">
          Total Number of Holidays:
          <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
            [{allHoliday.length}]
          </span>
        </span>

        <CustomButton
          handleToggle={() => handleToggleViewModal("ADDHOLIDAY")}
          label="Add Holiday"
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

        <TableInputField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Table Wrapper */}
      <div className="mx-2 mt-2 overflow-x-auto max-h-[28.4rem]">
        <div className="min-w-[600px]">
          {/* Table Header */}
          <div
            className="grid grid-cols-[0.5fr_1fr_1fr_1fr] bg-indigo-900 text-white items-center font-semibold text-sm sticky top-0 z-10 p-2"
          >
            <span>Sr#</span>
            <span>Holiday</span>
            <span>Date</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Table Body */}
          {paginatedHolidays.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-4">
              No records available at the moment!
            </div>
          ) : (
            paginatedHolidays.map((holi, index) => (
              <div
                key={holi.id}
                className="grid grid-cols-[0.5fr_1fr_1fr_1fr] items-center border border-gray-300 text-gray-800 text-sm p-2
                hover:bg-gray-100 transition items-center"
              >
                <span>{(pageNo - 1) * selectedValue + index + 1}</span>
                <span className="truncate">{holi.holiday}</span>
                <span>{new Date(holi.date).toLocaleDateString("sv-SE")}</span>
                <span className="flex flex-wrap items-center justify-center gap-1">
                  <EditButton handleUpdate={() => handleUpdateHoliday(holi)} />
                  <ViewButton handleView={() => handleViewHoliday(holi)} />
                  <DeleteButton handleDelete={() => handleDeleteCall(holi.id)} />
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
        start={paginatedHolidays.length === 0 ? 0 : (pageNo - 1) * selectedValue + 1}
        end={Math.min(pageNo * selectedValue, filteredHolidays.length)}
        total={filteredHolidays.length}
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
  </div>
);

};
