import { Pagination } from "../../Components/Pagination/Pagination";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";

import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";

import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";

import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";

import { useCallback, useEffect, useState } from "react";
import { AddCalendarSession } from "../../Components/CalendarModal/AddCalendarSession";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";

const numbers = [10, 25, 50, 10];

type CALENDART = "ADD" | "EDIT" | "DELETE" | "";

export const Calendar = () => {
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const { loader } = useAppSelector((state) => state.NavigateState);

  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<CALENDART>("");

  const [pageNo, setPageNo] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  const handleIncrementPageButton = () => {
    setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleToggleViewModal = (active: CALENDART) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const token = currentUser?.token;

  const handleGetAllCalendar = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getCalendarSession`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    handleGetAllCalendar();
    document.title = "(OMS) CALENDAR";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("CALENDAR"));
    }, 1000);
  }, [dispatch, handleGetAllCalendar]);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Calendar List" activeFile="Add Calendar Session" />

      <div className=" max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white overflow-hidden flex flex-col ">
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Attendance :{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [10]
            </span>
          </span>
          <CustomButton
            label="Add Calendar Session"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>
        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select>
                {numbers.map((num) => (
                  <option key={num}>{num}</option>
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
        <div className="w-full max-h-[28.4rem] overflow-y-auto  mx-auto">
          {/* Header */}
          <div
            className="grid grid-cols-[1fr_1fr_1fr] bg-gray-200 text-gray-900 font-semibold border
           border-gray-600 text-sm sticky top-0 z-10 p-[10px]"
          >
            <span className="">Sr#</span>
            <span className="">Year</span>
            <span className="">Month</span>
          </div>

          {/* Row */}
          <div
            className="grid grid-cols-[1fr_1fr_1fr] border border-gray-600 text-gray-800  hover:bg-gray-100
           transition duration-200 text-sm items-center justify-center p-[7px]"
          >
            <span className="px-2 ">1</span>
            <span className=" ">2025</span>
            <span className="">April</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber start={1} total={10} end={1 + 9} />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

      {isOpenModal === "ADD" && (
        <AddCalendarSession
          setModal={() => handleToggleViewModal("")}
          refreshCalendar={handleGetAllCalendar}
        />
      )}
    </div>
  );
};
