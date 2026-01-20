import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddOverTime } from "../../Components/OvertimeModals/AddOvertime";
import { UpdateOverTime } from "../../Components/OvertimeModals/UpdateOverTime";
import { ViewOverTimeModal } from "../../Components/OvertimeModals/ViewOverTime";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";

const numbers = [10, 25, 50, 100];

type OVERTIMET = {
  id: number;
  name: string;
  date: string;
  totalTime: string;
  approvalStatus: string;
};

type MODALT = "ADD" | "VIEW" | "UPDATE" | "DELETE" | "";

export const OverTime = () => {
  const dispatch = useAppDispatch();
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [isOpenModal, setIsOpenModal] = useState<MODALT>("");
  const [allOvertime, setAllOvertime] = useState<OVERTIMET[]>([]);
  const [selectedOvertime, setSelectedOvertime] = useState<OVERTIMET | null>(
    null,
  );
  const [viewOvertime, setViewOvertime] = useState<OVERTIMET | null>(null);

  const [selectedValue, setSelectedValue] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handleGetOvertime = useCallback(async () => {
    if (!currentUser) return;

    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getAllOvertime`
          : `${BASE_URL}/api/user/getMyOvertime`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllOvertime(res.data || []);
    } catch (error) {
      console.error("Error fetching overtime:", error);
      setAllOvertime([]);
    }
  }, [currentUser, token]);

  const handleDeleteOvertime = async () => {
    if (!selectedOvertime || !currentUser) return;

    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/deleteOvertime/${selectedOvertime.id}`
          : `${BASE_URL}/api/user/deleteOvertime/${selectedOvertime.id}`;

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllOvertime((prev) =>
        prev.filter((o) => o.id !== selectedOvertime.id),
      );
      setIsOpenModal("");
      setSelectedOvertime(null);
    } catch (error) {
      console.error("Error deleting overtime:", error);
    }
  };

  useEffect(() => {
    document.title = "(OMS) OVER TIME";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("OVER TIME")), 1000);
  }, [dispatch]);

  useEffect(() => {
    handleGetOvertime();
  }, [handleGetOvertime]);

  const filteredOvertime = useMemo(() => {
    return allOvertime.filter(
      (o) =>
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.approvalStatus.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allOvertime, searchTerm]);

  const paginatedOvertime = useMemo(() => {
    const start = (pageNo - 1) * selectedValue;
    return filteredOvertime.slice(start, start + selectedValue);
  }, [filteredOvertime, pageNo, selectedValue]);

  const startIndex = (pageNo - 1) * selectedValue;

  if (loader) return <Loader />;

  // return (
  //   <div className="w-full mx-2">
  //     <TableTitle tileName="Over Time" activeFile="Overtime List" />

  //     <div
  //       className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white
  //      overflow-hidden flex flex-col"
  //     >
  //       <div className="flex items-center justify-between mx-2 text-gray-800">
  //         <span>
  //           Total Overtime Records:{" "}
  //           <span className="text-2xl text-indigo-900 font-semibold">
  //             {filteredOvertime.length}
  //           </span>
  //         </span>
  //         <CustomButton
  //           label="Add Time"
  //           handleToggle={() => setIsOpenModal("ADD")}
  //         />
  //       </div>

  //       <div className="flex items-center justify-between mx-2 text-gray-800">
  //         <div>
  //           <span>Show</span>
  //           <span className="bg-gray-200 rounded mx-1 p-1">
  //             <select
  //               value={selectedValue}
  //               onChange={(e) => {
  //                 setSelectedValue(Number(e.target.value));
  //                 setPageNo(1);
  //               }}
  //             >
  //               {numbers.map((num) => (
  //                 <option key={num} value={num}>
  //                   {num}
  //                 </option>
  //               ))}
  //             </select>
  //           </span>
  //           <span>entries</span>
  //         </div>

  //         <TableInputField
  //           searchTerm={searchTerm}
  //           setSearchTerm={setSearchTerm}
  //         />
  //       </div>

  //       <div className="max-h-[28.6rem] overflow-y-auto mx-2">
  //         <div
  //           className="grid grid-cols-[0.3fr_1fr_1fr_1fr_1fr_1fr] bg-indigo-900 text-white font-semibold
  //          border border-gray-600 text-sm sticky top-0 z-10 p-[10px]"
  //         >
  //           <span>Sr#</span>
  //           {currentUser?.role === "admin" && <span>Employee Name</span>}
  //           <span>Date</span>
  //           <span>Over Time</span>
  //           <span>Approval</span>
  //           <span className="text-center">Actions</span>
  //         </div>

  //         {paginatedOvertime.map((ot, index) => (
  //           <div
  //             key={ot.id}
  //             className="grid grid-cols-[0.3fr_1fr_1fr_1fr_1fr_1fr] border border-gray-600 text-gray-800
  //              hover:bg-gray-100 transition text-sm items-center p-[7px]"
  //           >
  //             <span>{startIndex + index + 1}</span>
  //             {currentUser?.role === "admin" && <span>{ot.name}</span>}
  //             <span>{new Date(ot.date).toLocaleDateString("sv-SE")}</span>
  //             <span>{ot.totalTime}</span>
  //             <span>{ot.approvalStatus}</span>
  //             <span className="flex justify-center gap-1">
  //               {(currentUser?.role === "admin" ||
  //                 ot.name === currentUser?.name) && (
  //                 <EditButton
  //                   handleUpdate={() => {
  //                     setSelectedOvertime(ot);
  //                     setIsOpenModal("UPDATE");
  //                   }}
  //                 />
  //               )}
  //               <ViewButton
  //                 handleView={() => {
  //                   setViewOvertime(ot);
  //                   setIsOpenModal("VIEW");
  //                 }}
  //               />
  //               {(currentUser?.role === "admin" ||
  //                 ot.name === currentUser?.name) && (
  //                 <DeleteButton
  //                   handleDelete={() => {
  //                     setSelectedOvertime(ot);
  //                     setIsOpenModal("DELETE");
  //                   }}
  //                 />
  //               )}
  //             </span>
  //           </div>
  //         ))}

  //         {paginatedOvertime.length === 0 && (
  //           <div className="text-center py-4 text-gray-500">
  //             No overtime records found
  //           </div>
  //         )}
  //       </div>
  //     </div>

  //     <div className="flex items-center justify-between mt-2">
  //       <ShowDataNumber
  //         start={startIndex + 1}
  //         end={Math.min(startIndex + selectedValue, filteredOvertime.length)}
  //         total={filteredOvertime.length}
  //       />
  //       <Pagination
  //         pageNo={pageNo}
  //         handleIncrementPageButton={() =>
  //           setPageNo((prev) => Math.min(prev + 1, totalPages))
  //         }
  //         handleDecrementPageButton={() =>
  //           setPageNo((prev) => Math.max(prev - 1, 1))
  //         }
  //       />
  //     </div>

  //     {isOpenModal === "ADD" && (
  //       <AddOverTime
  //         setModal={() => setIsOpenModal("")}
  //         refreshOvertime={handleGetOvertime}
  //       />
  //     )}

  //     {isOpenModal === "UPDATE" && selectedOvertime && (
  //       <UpdateOverTime
  //         setModal={() => setIsOpenModal("")}
  //         EditOvertime={{
  //           id: selectedOvertime.id,
  //           employeeId: 0,
  //           time: selectedOvertime.totalTime,
  //           date: selectedOvertime.date,
  //           description: "",
  //           status: selectedOvertime.approvalStatus,
  //         }}
  //         refreshOvertimes={handleGetOvertime}
  //       />
  //     )}

  //     {isOpenModal === "VIEW" && viewOvertime && (
  //       <ViewOverTimeModal
  //         setModal={() => setIsOpenModal("")}
  //         data={viewOvertime}
  //       />
  //     )}

  //     {isOpenModal === "DELETE" && selectedOvertime && (
  //       <ConfirmationModal
  //         isOpen={() => setIsOpenModal("")}
  //         onClose={() => setIsOpenModal("")}
  //         onConfirm={handleDeleteOvertime}
  //         message="Are you sure you want to delete this overtime record?"
  //       />
  //     )}
  //   </div>
  // );

  return (
    <div className="w-full px-2 sm:px-4">
      <TableTitle tileName="Over Time" activeFile="Overtime List" />

      <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
          <span className="text-sm sm:text-base">
            Total Overtime Records:{" "}
            <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
              {filteredOvertime.length}
            </span>
          </span>

          <CustomButton
            label="Add Time"
            handleToggle={() => setIsOpenModal("ADD")}
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 text-gray-800">
          <div className="text-sm">
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select
                value={selectedValue}
                onChange={(e) => {
                  setSelectedValue(Number(e.target.value));
                  setPageNo(1);
                }}
                className="bg-transparent outline-none"
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

        {/* Table Wrapper */}
        <div className="overflow-x-auto mx-2 mt-2 max-h-[28.4rem]">
          <div className="min-w-[700px]">
            {/* Table Header */}
            <div
              className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr]  items-center
            bg-indigo-900 text-white font-semibold text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              {currentUser?.role === "admin" && <span>Employee Name</span>}
              <span>Date</span>
              <span>Over Time</span>
              <span>Approval</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedOvertime.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-4">
                No overtime records found
              </div>
            ) : (
              paginatedOvertime.map((ot, index) => (
                <div
                  key={ot.id}
                  className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] 
                  border border-gray-300 items-center text-gray-800 text-sm p-2
                  hover:bg-gray-100 transition items-center"
                >
                  <span>{startIndex + index + 1}</span>
                  {currentUser?.role === "admin" && <span>{ot.name}</span>}
                  <span>{new Date(ot.date).toLocaleDateString("sv-SE")}</span>
                  <span>{ot.totalTime}</span>
                  <span>{ot.approvalStatus}</span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    {(currentUser?.role === "admin" ||
                      ot.name === currentUser?.name) && (
                      <EditButton
                        handleUpdate={() => {
                          setSelectedOvertime(ot);
                          setIsOpenModal("UPDATE");
                        }}
                      />
                    )}
                    <ViewButton
                      handleView={() => {
                        setViewOvertime(ot);
                        setIsOpenModal("VIEW");
                      }}
                    />
                    {(currentUser?.role === "admin" ||
                      ot.name === currentUser?.name) && (
                      <DeleteButton
                        handleDelete={() => {
                          setSelectedOvertime(ot);
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
          start={paginatedOvertime.length === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + selectedValue, filteredOvertime.length)}
          total={filteredOvertime.length}
        />
        <Pagination
          pageNo={pageNo}
          handleIncrementPageButton={() =>
            setPageNo((prev) =>
              Math.min(
                prev + 1,
                Math.ceil(filteredOvertime.length / selectedValue),
              ),
            )
          }
          handleDecrementPageButton={() =>
            setPageNo((prev) => Math.max(prev - 1, 1))
          }
        />
      </div>

      {/* Modals */}
      {isOpenModal === "ADD" && (
        <AddOverTime
          setModal={() => setIsOpenModal("")}
          refreshOvertime={handleGetOvertime}
        />
      )}

      {isOpenModal === "UPDATE" && selectedOvertime && (
        <UpdateOverTime
          setModal={() => setIsOpenModal("")}
          EditOvertime={{
            id: selectedOvertime.id,
            employeeId: 0,
            time: selectedOvertime.totalTime,
            date: selectedOvertime.date,
            description: "",
            status: selectedOvertime.approvalStatus,
          }}
          refreshOvertimes={handleGetOvertime}
        />
      )}

      {isOpenModal === "VIEW" && viewOvertime && (
        <ViewOverTimeModal
          setModal={() => setIsOpenModal("")}
          data={viewOvertime}
        />
      )}

      {isOpenModal === "DELETE" && selectedOvertime && (
        <ConfirmationModal
          isOpen={() => setIsOpenModal("")}
          onClose={() => setIsOpenModal("")}
          onConfirm={handleDeleteOvertime}
          message="Are you sure you want to delete this overtime record?"
        />
      )}
    </div>
  );
};
