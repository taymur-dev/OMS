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

  const filteredList = calendarList.filter((item) =>
    `${item.year} ${item.month}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const startIndex = (pageNo - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  if (loader) return <Loader />;

//   return (
//     <div className="w-full mx-2">
//       <TableTitle tileName="Salary Cycle List" activeFile="Salary Cycle" />

//       <div
//         className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white 
//       overflow-hidden flex flex-col"
//       >
//         <div className="flex text-gray-800 items-center justify-between mx-2">
//           <span>
//             Total Salary Cycles :{" "}
//             <span className="text-2xl text-indigo-900 font-semibold font-sans">
//               [{filteredList.length}]
//             </span>
//           </span>

//           <CustomButton
//             label="Run Cycle"
//             handleToggle={() => handleToggleViewModal("ADD")}
//           />
//         </div>

//         <div className="flex items-center justify-between text-gray-800 mx-2">
//           <div>
//             <span>Show</span>
//             <span className="bg-gray-200 rounded mx-1 p-1">
//               <select
//                 value={pageSize}
//                 onChange={(e) => {
//                   setPageSize(Number(e.target.value));
//                   setPageNo(1);
//                 }}
//               >
//                 {numbers.map((num) => (
//                   <option key={num} value={num}>
//                     {num}
//                   </option>
//                 ))}
//               </select>
//             </span>
//             <span>entries</span>
//           </div>

//           <TableInputField
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//           />
//         </div>

//         {/* <div className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
//           <div
//             className="grid grid-cols-4 bg-gray-200 text-gray-900 font-semibold border border-gray-600
//            text-sm sticky top-0 z-10 p-[10px]"
//           >
//             <span>Sr#</span>
//             <span>Year</span>
//             <span>Month</span>
//             <span>Status</span>
//           </div>

//           {paginatedList.length > 0 ? (
//             paginatedList.map((item, index) => (
//               <div
//                 key={item._id || index}
//                 className="grid grid-cols-4 border border-gray-600 text-gray-800 hover:bg-gray-100
//                  transition duration-200 text-sm items-center p-[7px]"
//               >
//                 <span>{startIndex + index + 1}</span>
//                 <span>{item.year}</span>
//                 <span>{item.month}</span>
//                 <span className="flex items-center justify-center">
//                   <button
//                     className={`w-20 h-6 text-xs font-semibold rounded text-white
//                     ${
//                       item.calendarStatus?.toLowerCase() === "active"
//                         ? "bg-green-500"
//                         : "bg-red-500"
//                     }`}
//                   >
//                     {item.calendarStatus || "Inactive"}
//                   </button>
//                 </span>
//               </div>
//             ))
//           ) : (
//             <div className="text-center text-gray-500 text-sm py-4">
//               No salary cycles found
//             </div>
//           )}
//         </div> */}

//         {/* Table Header */}
//         <div className="max-h-[28.4rem] overflow-y-auto mx-2">
//           <div
//             className="grid grid-cols-4 bg-indigo-900 text-white font-semibold border border-gray-600
//  text-sm sticky top-0 z-10 p-[10px] text-center"
//           >
//             <span>Sr#</span>
//             <span>Year</span>
//             <span>Month</span>
//             <span>Status</span>
//           </div>

//           {/* Table Rows */}
//           {paginatedList.length > 0 ? (
//             paginatedList.map((item, index) => (
//               <div
//                 key={item._id || index}
//                 className="grid grid-cols-4 border border-gray-600 text-gray-800 hover:bg-gray-100
//        transition duration-200 text-sm items-start p-[7px] text-center"
//               >
//                 <span className="flex items-center justify-center">
//                   {startIndex + index + 1}
//                 </span>
//                 <span className="flex items-center justify-center">
//                   {item.year}
//                 </span>
//                 <span className="flex items-center justify-center">
//                   {item.month}
//                 </span>
//                 <span className="flex flex-col items-center justify-center">
//                   <button
//                     className={`w-20 h-6 mt-1 text-xs font-semibold rounded text-white
//           ${
//             item.calendarStatus?.toLowerCase() === "active"
//               ? "bg-green-500"
//               : "bg-red-500"
//           }`}
//                   >
//                     {item.calendarStatus || "Inactive"}
//                   </button>
//                 </span>
//               </div>
//             ))
//           ) : (
//             <div className="text-center text-gray-500 text-sm py-4">
//               No salary cycles found
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex items-center justify-between">
//         <ShowDataNumber
//           start={filteredList.length ? startIndex + 1 : 0}
//           end={Math.min(endIndex, filteredList.length)}
//           total={filteredList.length}
//         />

//         <Pagination
//           pageNo={pageNo}
//           handleDecrementPageButton={handleDecrementPageButton}
//           handleIncrementPageButton={handleIncrementPageButton}
//         />
//       </div>

//       {isOpenModal === "ADD" && (
//         <AddSalaryCycle
//           setModal={() => handleToggleViewModal("")}
//           calendarList={calendarList}
//         />
//       )}
//     </div>
//   );
   return (
  <div className="w-full px-2 sm:px-4">
    <TableTitle tileName="Salary Cycle List" activeFile="Salary Cycle" />

    <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
        <span className="text-sm sm:text-base">
          Total Salary Cycles :
          <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
            [{filteredList.length}]
          </span>
        </span>

        <CustomButton
          handleToggle={() => handleToggleViewModal("ADD")}
          label="Run Cycle"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 text-gray-800">
        <div className="text-sm">
          <span>Show</span>
          <span className="bg-gray-200 rounded mx-1 p-1">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNo(1);
              }}
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
          <div className="grid grid-cols-4 sm:grid-cols-4 bg-indigo-900 items-center text-white
           font-semibold text-sm sticky top-0 z-10 p-2 text-center">
            <span>Sr#</span>
            <span>Year</span>
            <span>Month</span>
            <span>Status</span>
          </div>

          {/* Table Rows */}
          {paginatedList.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-4">
              No salary cycles found
            </div>
          ) : (
            paginatedList.map((item, index) => (
              <div
                key={item._id || index}
                className="grid grid-cols-4 sm:grid-cols-4 border border-gray-300 items-center
                 text-gray-800 text-sm p-2 hover:bg-gray-100 transition text-center items-center"
              >
                <span>{startIndex + index + 1}</span>
                <span>{item.year}</span>
                <span>{item.month}</span>
                <span className="flex items-center justify-center">
                  <button
                    className={`w-20 h-6 text-xs font-semibold rounded text-white ${
                      item.calendarStatus?.toLowerCase() === "active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {item.calendarStatus || "Inactive"}
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

    {/* Pagination & Show Data */}
    <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-3">
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

    {/* Modal */}
    {isOpenModal === "ADD" && (
      <AddSalaryCycle
        setModal={() => handleToggleViewModal("")}
        calendarList={calendarList}
      />
    )}
  </div>
);


};
