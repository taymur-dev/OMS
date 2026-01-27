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
import { Footer } from "../../Components/Footer";

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
        res.data.sort((a: ALLCONFIGT, b: ALLCONFIGT) => a.id - b.id),
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
      config.configureTime.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const renderBadge = (type: string) => {
    const normalizedType = type.toLowerCase();

    // Define styles based on type
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium uppercase";
    const styles: Record<string, string> = {
      late: "bg-orange-600 text-white border-orange-200",
      absent: "bg-red-800 text-white border border-red-200",
      default: "bg-blue-100 text-blue-700 border border-blue-200",
    };

    const selectedStyle = styles[normalizedType] || styles.default;

    // Fixed: Added the missing return statement here
    return <span className={`${baseClasses} ${selectedStyle}`}>{type}</span>;
  }; // Fixed:

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Button as the rightElement */}
        <TableTitle
          tileName="Configure Time"
          rightElement={
            <CustomButton
              label="+ Add Config Time"
              handleToggle={() => handleToggleViewModal("ADD")}
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
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="bg-transparent outline-none py-1 cursor-pointer"
                >
                  {numbers.map((num) => (
                    <option key={num} value={num}>
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
              className="grid grid-cols-[0.5fr_1fr_1fr_1fr] bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Config Time</span>
              <span>Type</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedConfig.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedConfig.map((config, index) => (
                <div
                  key={config.id}
                  className="grid grid-cols-[0.5fr_1fr_1fr_1fr] border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{startIndex + index + 1}</span>
                  <span className="truncate">
                    {config.configureTime ?? "N/A"}
                  </span>
                  <div className="flex items-center">
                    {renderBadge(config.configureType)}
                  </div>
                  <span className="flex flex-nowrap justify-center gap-1">
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

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={paginatedConfig.length === 0 ? 0 : startIndex + 1}
            end={Math.min(endIndex, filteredConfig.length)}
            total={filteredConfig.length}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={handleDecrementPageButton}
            handleIncrementPageButton={handleIncrementPageButton}
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
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

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
