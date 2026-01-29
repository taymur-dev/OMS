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

import { AddAttendanceRule } from "../../Components/AttendanceRuleModal/AddAttendanceRule";
import { EditAttendanceRule } from "../../Components/AttendanceRuleModal/EditAttendanceRule";
import { ViewAttendanceRule } from "../../Components/AttendanceRuleModal/ViewAttendanceRule";
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

type AttendanceRuleT = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";

export type ALLCONFIGT = {
  id: number;
  startTime: string;
  endTime: string;
  offDay: string;
  lateTime: string;
  halfLeave: string;
};

export const AttendanceRule = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.officeState.currentUser?.token);

  const [isOpenModal, setIsOpenModal] = useState<AttendanceRuleT>("");
  const [selectData, setSelectData] = useState<ALLCONFIGT | null>(null);
  const [catchId, setCatchId] = useState<number>();
  const [allConfig, setAllConfig] = useState<ALLCONFIGT[]>([]);
  const [viewData, setViewData] = useState<ALLCONFIGT | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(numbers[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleGetAllTimeConfig = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getTimeConfigured`, {
        headers: { Authorization: token },
      });

      if (res.data && Array.isArray(res.data)) {
        const sortedData = [...res.data].sort(
          (a: ALLCONFIGT, b: ALLCONFIGT) => a.id - b.id,
        );
        setAllConfig(sortedData); 
      } else {
        setAllConfig([]); 
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch configuration data");
    }
  }, [token]);

  useEffect(() => {
    handleGetAllTimeConfig();
  }, [handleGetAllTimeConfig]); 

  const handleDeleteAttendanceRule = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/deleteTime/${catchId}`, {
        headers: { Authorization: token },
      });
      toast.success("Time configuration deleted");
      handleGetAllTimeConfig();
      handleToggleViewModal("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete configuration");
    }
  };

  const handleToggleViewModal = (active: AttendanceRuleT) => {
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

  const filteredConfig = allConfig.filter((config) => {
    const search = searchTerm.toLowerCase();
    return (
      (config.offDay?.toLowerCase() ?? "").includes(search) ||
      (config.startTime ?? "").includes(search) ||
      (config.endTime ?? "").includes(search)
    );
  });

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
    document.title = "(OMS) ATTENDANCE RULES";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("ATTENDANCE RULES")), 1000);
  }, [dispatch, handleGetAllTimeConfig]);

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        <TableTitle
          tileName="Attendance Rules"
          rightElement={
            <CustomButton
              label="+ Add Rule"
              handleToggle={() => handleToggleViewModal("ADD")}
            />
          }
        />

        <hr className="border border-b border-gray-200" />

        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
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

            <TableInputField
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        <div className="overflow-auto px-2">
          <div className="min-w-[800px]">
            <div
              className="grid grid-cols-[0.5fr_1fr_1fr_1.2fr_1.2fr_1.2fr_1fr] bg-indigo-900 text-white
               items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Start Time</span>
              <span>End Time</span>
              <span>Off Day</span>
              <span>Late Time</span>
              <span>Half Leave</span>
              <span className="text-center">Actions</span>
            </div>

            {paginatedConfig.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No rules configured yet!
              </div>
            ) : (
              paginatedConfig.map((config, index) => (
                <div
                  key={config.id}
                  className="grid grid-cols-[0.5fr_1fr_1fr_1.2fr_1.2fr_1.2fr_1fr] border-b border-x border-gray-200
                   text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{startIndex + index + 1}</span>
                  <span>{config.startTime}</span>
                  <span>{config.endTime}</span>
                  <span className="font-medium text-indigo-700">
                    {config.offDay}
                  </span>
                  <span>{config.lateTime}</span>
                  <span>{config.halfLeave}</span>
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

      {isOpenModal === "ADD" && (
        <AddAttendanceRule
          setModal={() => handleToggleViewModal("")}
          handleGetAllTimeConfig={handleGetAllTimeConfig}
        />
      )}
      {isOpenModal === "EDIT" && (
        <EditAttendanceRule
          setModal={() => handleToggleViewModal("")}
          handleGetAllTimeConfig={handleGetAllTimeConfig}
          selectData={selectData}
        />
      )}
      {isOpenModal === "VIEW" && viewData && (
        <ViewAttendanceRule
          setIsOpenModal={() => handleToggleViewModal("")}
          viewConfig={viewData}
        />
      )}
      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("DELETE")}
          onClose={() => handleToggleViewModal("")}
          onConfirm={handleDeleteAttendanceRule}
        />
      )}

      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
