import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";

import { AddConfigTime } from "../../Components/ConfigTimeModal/AddConfigTime";
import { EditConfigTime } from "../../Components/ConfigTimeModal/EditConfigTime";
import { ViewConfigTime } from "../../Components/ConfigTimeModal/ViewConfigTime";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

const numbers = [10, 25, 50, 100];

type CONFIGTIMET = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";
type ALLCONFIGT = {
  id: number;
  configureType: string;
  configureTime: string;
};

export const ConfigTime = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const [isOpenModal, setIsOpenModal] = useState<CONFIGTIMET>("");
  const [selectData, setSelectData] = useState<ALLCONFIGT | null>(null);
  const [catchId, setCatchId] = useState<number>();
  const [allConfig, setAllConfig] = useState<ALLCONFIGT[]>([]);
  const [viewData, setViewData] = useState<ALLCONFIGT | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(numbers[0]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all time configurations
  const handleGetAllTimeConfig = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getTimeConfigured`, {
        headers: { Authorization: token },
      });
      setAllConfig(
        res.data.sort((a: ALLCONFIGT, b: ALLCONFIGT) => a.id - b.id)
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch configuration data");
    }
  }, [token]);

  // Delete a configuration
  const handleDeleteConfigTime = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/deleteTime/${catchId}`, {
        headers: { Authorization: token },
      });
      toast.error("Time configuration deleted");
      handleGetAllTimeConfig();
      handleToggleViewModal("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete configuration");
    }
  };

  // Toggle modal
  const handleToggleViewModal = (active: CONFIGTIMET) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleClickEditButton = (data: ALLCONFIGT) => {
    setSelectData(data);
    handleToggleViewModal("EDIT");
  };

  const handleClickViewButton = (data: ALLCONFIGT) => {
    setViewData(data);
    handleToggleViewModal("VIEW");
  };

  const handleClickDeleteButton = (id: number) => {
    setCatchId(id);
    handleToggleViewModal("DELETE");
  };

  // Filter and paginate
  const filteredConfig = allConfig.filter(
    (config) =>
      config.configureType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.configureTime.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredConfig.length / entriesPerPage);
  const startIndex = (pageNo - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedConfig = filteredConfig.slice(startIndex, endIndex);

  const handleIncrementPageButton = () =>
    setPageNo((prev) => (prev < totalPages ? prev + 1 : prev));
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  useEffect(() => setPageNo(1), [searchTerm, entriesPerPage]);

  useEffect(() => {
    handleGetAllTimeConfig();
    document.title = "(OMS) CONFIG TIME";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("CONFIG TIME")), 1000);
  }, [dispatch, handleGetAllTimeConfig]);

  if (loader) return <Loader />;

  // return (
  //   <div className="w-full mx-2">
  //     <TableTitle tileName="Configure Time" activeFile="Late List" />

  //     <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
  //       {/* Header */}
  //       <div className="flex text-gray-800 items-center justify-between mx-2">
  //         <span>
  //           Total Configurations:{" "}
  //           <span className="text-2xl text-indigo-900 font-semibold font-sans">
  //             {filteredConfig.length}
  //           </span>
  //         </span>
  //         <CustomButton
  //           label="Add Config Time"
  //           handleToggle={() => handleToggleViewModal("ADD")}
  //         />
  //       </div>

  //       {/* Controls */}
  //       <div className="flex items-center justify-between text-gray-800 mx-2">
  //         <div>
  //           <span>Show</span>
  //           <span className="bg-gray-200 rounded mx-1 p-1">
  //             <select
  //               value={entriesPerPage}
  //               onChange={(e) => setEntriesPerPage(Number(e.target.value))}
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

  //       {/* Table */}
  //       <div className="max-h-[28.4rem] overflow-y-auto mx-2">
  //         <div
  //           className="grid grid-cols-4 bg-indigo-900 text-white font-semibold border border-gray-600
  //          text-sm sticky top-0 z-10 p-[10px]"
  //         >
  //           <span>Sr#</span>
  //           <span>Config Time</span>
  //           <span>Type</span>
  //           <span className="text-center w-28">Actions</span>
  //         </div>

  //         {paginatedConfig.length === 0 ? (
  //           <div className="text-gray-800 text-lg text-center py-2">
  //             No records available at the moment!
  //           </div>
  //         ) : (
  //           paginatedConfig.map((config, index) => (
  //             <div
  //               key={config.id}
  //               className="grid grid-cols-4 border border-gray-600 text-gray-800 hover:bg-gray-100 transition
  //                duration-200 text-sm items-center justify-center p-[7px]"
  //             >
  //               <span className="px-2">{startIndex + index + 1}</span>
  //               <span>{config.configureTime ?? "N/A"}</span>
  //               <span>{config.configureType}</span>
  //               <span className="flex items-center gap-1">
  //                 <EditButton
  //                   handleUpdate={() => handleClickEditButton(config)}
  //                 />

  //                 <ViewButton
  //                   handleView={() => handleClickViewButton(config)}
  //                 />

  //                 <DeleteButton
  //                   handleDelete={() => handleClickDeleteButton(config.id)}
  //                 />
  //               </span>
  //             </div>
  //           ))
  //         )}
  //       </div>
  //     </div>

  //     {/* Pagination */}
  //     <div className="flex items-center justify-between mt-2">
  //       <ShowDataNumber
  //         start={startIndex + 1}
  //         end={Math.min(endIndex, filteredConfig.length)}
  //         total={filteredConfig.length}
  //       />
  //       <Pagination
  //         pageNo={pageNo}
  //         handleIncrementPageButton={handleIncrementPageButton}
  //         handleDecrementPageButton={handleDecrementPageButton}
  //       />
  //     </div>

  //     {/* Modals */}
  //     {isOpenModal === "ADD" && (
  //       <AddConfigTime
  //         setModal={() => handleToggleViewModal("")}
  //         handleGetAllTimeConfig={handleGetAllTimeConfig}
  //       />
  //     )}
  //     {isOpenModal === "EDIT" && (
  //       <EditConfigTime
  //         setModal={() => handleToggleViewModal("")}
  //         handleGetAllTimeConfig={handleGetAllTimeConfig}
  //         selectData={selectData}
  //       />
  //     )}

  //     {isOpenModal === "VIEW" && viewData && (
  //       <ViewConfigTime
  //         setIsOpenModal={() => handleToggleViewModal("")}
  //         viewConfig={viewData}
  //       />
  //     )}

  //     {isOpenModal === "DELETE" && (
  //       <ConfirmationModal
  //         isOpen={() => handleToggleViewModal("DELETE")}
  //         onClose={() => handleToggleViewModal("")}
  //         onConfirm={handleDeleteConfigTime}
  //       />
  //     )}
  //   </div>
  // );
  return (
  <div className="w-full px-2 sm:px-4">
    <TableTitle tileName="Configure Time" activeFile="Late List" />

    <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
        <span className="text-sm sm:text-base">
          Total Configurations:{" "}
          <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
            {filteredConfig.length}
          </span>
        </span>

        <CustomButton
          label="Add Config Time"
          handleToggle={() => handleToggleViewModal("ADD")}
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 text-gray-800">
        <div className="text-sm">
          <span>Show</span>
          <span className="bg-gray-200 rounded mx-1 p-1">
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
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
      <div className="mx-2 mt-2 overflow-x-auto max-h-[28.4rem]">
        <div className="min-w-[600px]">
          {/* Table Header */}
          <div
            className="grid grid-cols-[0.5fr_1fr_1fr_1fr] items-center bg-indigo-900 text-white font-semibold text-sm sticky top-0 z-10 p-2"
          >
            <span>Sr#</span>
            <span>Config Time</span>
            <span>Type</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Table Body */}
          {paginatedConfig.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-4">
              No records available at the moment!
            </div>
          ) : (
            paginatedConfig.map((config, index) => (
              <div
                key={config.id}
                className="grid grid-cols-[0.5fr_1fr_1fr_1fr] border items-center border-gray-300 text-gray-800 text-sm p-2 hover:bg-gray-100 transition items-center"
              >
                <span>{startIndex + index + 1}</span>
                <span>{config.configureTime ?? "N/A"}</span>
                <span>{config.configureType}</span>
                <span className="flex flex-wrap items-center justify-center gap-1">
                  <EditButton
                    handleUpdate={() => handleClickEditButton(config)}
                  />
                  <ViewButton
                    handleView={() => handleClickViewButton(config)}
                  />
                  <DeleteButton
                    handleDelete={() => handleClickDeleteButton(config.id)}
                  />
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
        start={paginatedConfig.length === 0 ? 0 : startIndex + 1}
        end={Math.min(endIndex, filteredConfig.length)}
        total={filteredConfig.length}
      />

      <Pagination
        pageNo={pageNo}
        handleIncrementPageButton={handleIncrementPageButton}
        handleDecrementPageButton={handleDecrementPageButton}
      />
    </div>

    {/* Modals */}
    {isOpenModal === "ADD" && (
      <AddConfigTime
        setModal={() => handleToggleViewModal("")}
        handleGetAllTimeConfig={handleGetAllTimeConfig}
      />
    )}
    {isOpenModal === "EDIT" && (
      <EditConfigTime
        setModal={() => handleToggleViewModal("")}
        handleGetAllTimeConfig={handleGetAllTimeConfig}
        selectData={selectData}
      />
    )}

    {isOpenModal === "VIEW" && viewData && (
      <ViewConfigTime
        setIsOpenModal={() => handleToggleViewModal("")}
        viewConfig={viewData}
      />
    )}

    {isOpenModal === "DELETE" && (
      <ConfirmationModal
        isOpen={() => handleToggleViewModal("DELETE")}
        onClose={() => handleToggleViewModal("")}
        onConfirm={handleDeleteConfigTime}
      />
    )}
  </div>
);


};
