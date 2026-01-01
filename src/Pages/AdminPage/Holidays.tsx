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

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { BASE_URL } from "../../Content/URL";

const numbers = [10, 25, 50, 100];

type THOLIDAYMODAL = "EDIT" | "DELETE" | "ADDHOLIDAY" | "";

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
      toast.info(res.data.message);
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

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  const handleChangeShowData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(Number(e.target.value));
    setPageNo(1);
  };

  const filteredHolidays = useMemo(
    () =>
      allHoliday.filter((holiday) =>
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
    <div className="w-full mx-2">
      <TableTitle tileName="Configure Holidays" activeFile="Holidays List" />

      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 
      bg-white overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between text-gray-800 mx-2">
          <span>
            Total Number of Holidays:{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [{allHoliday.length}]
            </span>
          </span>
          <CustomButton
            label="Add Holiday"
            handleToggle={() => handleToggleViewModal("ADDHOLIDAY")}
          />
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            Show{" "}
            <select
              value={selectedValue}
              onChange={handleChangeShowData}
              className="bg-gray-200 rounded mx-1 p-1"
            >
              {numbers.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>{" "}
            entries
          </div>
          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
          <div
            className="grid grid-cols-[0.5fr_1fr_1fr_1fr] bg-gray-200 text-gray-900 font-semibold
           border border-gray-600 text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr#</span>
            <span>Date</span>
            <span>Holiday</span>
            <span className="text-center w-28">Actions</span>
          </div>

          {paginatedHolidays.map((holi, index) => (
            <div
              key={holi.id}
              className="grid grid-cols-[0.5fr_1fr_1fr_1fr] border border-gray-600 text-gray-800 
              hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[7px]"
            >
              <span>{(pageNo - 1) * selectedValue + index + 1}</span>

              <span>{new Date(holi.date).toLocaleDateString("en-CA")}</span>

              <span>{holi.holiday}</span>
              <span className="flex items-center gap-1">
                <EditButton handleUpdate={() => handleUpdateHoliday(holi)} />
                <DeleteButton handleDelete={() => handleDeleteCall(holi.id)} />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <ShowDataNumber total={filteredHolidays.length} />
        <Pagination
          handleIncrementPageButton={handleIncrementPageButton}
          handleDecrementPageButton={handleDecrementPageButton}
          pageNo={pageNo}
        />
      </div>

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
