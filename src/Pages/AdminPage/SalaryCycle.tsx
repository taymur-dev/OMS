import { Pagination } from "../../Components/Pagination/Pagination";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { useCallback, useEffect, useState } from "react";
import { AddSalaryCycle } from "../../Components/SalaryCycleModal/AddSalaryCycle";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";

const numbers = [10, 25, 50, 100];

type SALARYCYCLET = "ADD" | "EDIT" | "DELETE" | "";

type CalendarSession = {
  _id?: string;
  year: string;
  month: string;
  calendarStatus?: string;
};

export const SalaryCycle = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);

  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<SALARYCYCLET>("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [calendarList, setCalendarList] = useState<CalendarSession[]>([]);

  const token = currentUser?.token;

  const handleIncrementPageButton = () => {
    setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleToggleViewModal = (active: SALARYCYCLET) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleGetCalendarSession = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getCalendarSession`, {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      });
      setCalendarList(res.data.data || res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    handleGetCalendarSession();
    document.title = "(OMS) SALARY CYCLE";

    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("SALARY CYCLE"));
    }, 1000);
  }, [dispatch, handleGetCalendarSession]);

  const filteredList = calendarList.filter((item) =>
    `${item.year} ${item.month}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const startIndex = (pageNo - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Salary Cycle List" activeFile="Salary Cycle" />

      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white 
      overflow-hidden flex flex-col"
      >
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total Salary Cycles :{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [{filteredList.length}]
            </span>
          </span>

          <CustomButton
            label="Run Cycle"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageNo(1);
                }}
              >
                {numbers.map((num) => (
                  <option key={num} value={num}>
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

        <div className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
          <div
            className="grid grid-cols-4 bg-gray-200 text-gray-900 font-semibold border border-gray-600
           text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr#</span>
            <span>Year</span>
            <span>Month</span>
            <span>Status</span>
          </div>

          {paginatedList.length > 0 ? (
            paginatedList.map((item, index) => (
              <div
                key={item._id || index}
                className="grid grid-cols-4 border border-gray-600 text-gray-800 hover:bg-gray-100
                 transition duration-200 text-sm items-center p-[7px]"
              >
                <span className="px-2">{startIndex + index + 1}</span>
                <span>{item.year}</span>
                <span>{item.month}</span>
                <span
                  className={`flex items-center gap-1
                  ${
                    item.calendarStatus === "Active"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {item.calendarStatus || "Not Active"}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-sm py-4">
              No salary cycles found
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber
          start={filteredList.length ? startIndex + 1 : 0}
          end={Math.min(endIndex, filteredList.length)}
          total={filteredList.length}
        />

        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

      {isOpenModal === "ADD" && (
        <AddSalaryCycle setModal={() => handleToggleViewModal("")} />
      )}
    </div>
  );
};
