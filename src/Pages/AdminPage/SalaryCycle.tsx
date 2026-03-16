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
import { Pagination } from "../../Components/Pagination/Pagination";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { RiInboxArchiveLine } from "react-icons/ri";

type SALARYCYCLET = "RUN" | "";

type CalendarSession = {
  _id?: string;
  year: string;
  month: string;
  calendarStatus?: string;
};

interface SalaryCycleProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const SalaryCycle = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: SalaryCycleProps) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);

  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<SALARYCYCLET>("");
  const [pageNo, setPageNo] = useState(1);
  const [calendarList, setCalendarList] = useState<CalendarSession[]>([]);

  const token = currentUser?.token;

  const handleGetCalendarSession = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getCalendarSession`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("RUN");
    }
  }, [triggerModal]);

  // Reset pagination when filters change
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  const filteredList = calendarList.filter((item) =>
    `${item.year} ${item.month}`
      .toLowerCase()
      .includes(externalSearch.toLowerCase()),
  );

  const totalNum = filteredList.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(totalNum / externalPageSize);
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        {/* Increased min-width slightly to match the layout density of UsersDetails */}
        <div className="min-w-[800px]">
          {/* 1. Header Row - Aligned with UsersDetails grid logic */}
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[60px_1fr_1fr_1fr] 
            bg-blue-400 text-white rounded-lg items-center font-bold
            text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span className="text-left">Sr#</span>
              <span className="text-left">Year</span>
              <span className="text-left">Month</span>
              <span className="text-center">Status</span>
            </div>
          </div>

          {/* 2. Table Body */}
          <div className="px-0.5 sm:px-1 py-2">
            {paginatedList.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedList.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="grid grid-cols-[60px_1fr_1fr_1fr] 
                  items-center px-3 py-2 gap-3 text-sm bg-white 
                  border border-gray-100 rounded-lg 
                  hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    {/* Sr# - Removed extra padding to match UsersDetails */}
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Year - Icons removed, kept font styling */}
                    <div className="text-gray-800  truncate">
                      {item.year}
                    </div>

                    {/* Month - Icons removed */}
                    <div className="text-gray-600 truncate">{item.month}</div>

                    {/* Status */}
                    <div className="flex items-center justify-center">
                      <span
                        className={`px-3 py-0.5  text-xs font-bold rounded-full ${
                          item.calendarStatus?.toLowerCase() === "active"
                            ? "bg-green-100 text-green-600 border border-green-400"
                            : "bg-red-100 text-red-600 border border-red-400"
                        }`}
                      >
                        {item.calendarStatus || "InActive"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Pagination Section */}
      <div className="flex flex-row items-center justify-between p-1 mt-auto">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

      {/* --- MODALS SECTION --- */}
      {isOpenModal === "RUN" && (
        <AddSalaryCycle
          setModal={() => setIsOpenModal("")}
          calendarList={calendarList}
        />
      )}
    </div>
  );
};
