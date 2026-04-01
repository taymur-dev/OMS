import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { RiInboxArchiveLine } from "react-icons/ri";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";

import { AddAttendanceRule } from "../../Components/AttendanceRuleModal/AddAttendanceRule";
import { EditAttendanceRule } from "../../Components/AttendanceRuleModal/EditAttendanceRule";
import { ViewAttendanceRule } from "../../Components/AttendanceRuleModal/ViewAttendanceRule";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

export type ALLCONFIGT = {
  id: number;
  startTime: string;
  endTime: string;
  offDay: string;
  lateTime: string;
  halfLeave: string;
  year: string;
  month: string;
  status: string;
};

interface AttendanceRuleProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const AttendanceRule = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: AttendanceRuleProps) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.officeState.currentUser?.token);

  const [isOpenModal, setIsOpenModal] = useState<
    "ADD" | "EDIT" | "DELETE" | "VIEW" | ""
  >("");
  const [selectData, setSelectData] = useState<ALLCONFIGT | null>(null);
  const [catchId, setCatchId] = useState<number>();
  const [allConfig, setAllConfig] = useState<ALLCONFIGT[]>([]);
  const [viewData, setViewData] = useState<ALLCONFIGT | null>(null);
  const [pageNo, setPageNo] = useState(1);

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
    document.title = "(OMS) ATTENDANCE RULES";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("ATTENDANCE RULES")), 500);
  }, [dispatch, handleGetAllTimeConfig]);

  useEffect(() => {
    if (triggerModal > 0) setIsOpenModal("ADD");
  }, [triggerModal]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  const handleDeleteAttendanceRule = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/deleteTime/${catchId}`, {
        headers: { Authorization: token },
      });
      toast.success("Time configuration deleted");
      handleGetAllTimeConfig();
      setIsOpenModal("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete configuration");
    }
  };

  const filteredConfig = allConfig.filter((config) => {
    const search = externalSearch.toLowerCase();
    return (
      (config.offDay?.toLowerCase() ?? "").includes(search) ||
      (config.startTime ?? "").includes(search) ||
      (config.endTime ?? "").includes(search)
    );
  });

  const totalNum = filteredConfig.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedConfig = filteredConfig.slice(startIndex, endIndex);

 

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          {/* Header Section - Aligned with UsersDetails grid logic */}
          <div className="px-0.5 pt-0.5">
            <div className="grid grid-cols-[60px_1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm">
              <span className="text-left">Sr#</span>
              <span className="text-left">Shift Schedule</span>
              <span className="text-left">Off Day</span>
              <span className="text-left">Late Threshold</span>
              <span className="text-left">Half Leave</span>
              <span className="text-left">Month</span>
              <span className="text-left">Year</span>
              <span className="text-left">Status</span>
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="px-0.5 py-2">
            {paginatedConfig.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No configuration records found!
                </p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedConfig.map((config, index) => (
                  <div
                    key={config.id}
                    className="grid grid-cols-[60px_1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] items-center px-3 py-2 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    {/* Column 1: Sr# */}
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Column 2: Shift Schedule (Icons Removed) */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-gray-800 text-sm">
                        {config.startTime} - {config.endTime}
                      </span>
                    </div>

                    {/* Column 3: Off Day (Icon Removed) */}
                    <div className="text-gray-600 truncate font-medium">
                      {config.offDay}
                    </div>

                    {/* Column 4: Late Threshold */}
                    <div className="text-gray-600 truncate">
                      {config.lateTime}
                    </div>

                    {/* Column 5: Half Leave */}
                    <div className="text-gray-600 truncate">
                      {config.halfLeave}
                    </div>

                    {/* Column 6: Status */}
                    <div className="text-gray-600 truncate">{config.month}</div>

                    <div className="text-gray-600 truncate">{config.year}</div>

                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
      ${
        config.status === "Active"
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-red-100 text-red-700 border border-red-200"
      }`}
                      >
                        {config.status}
                      </span>
                    </div>

                    {/* Column 7: Actions - Aligned with UsersDetails width */}
                    <div className="flex items-center justify-end gap-1 w-[140px]">
                      <ViewButton
                        handleView={() => {
                          setViewData(config);
                          setIsOpenModal("VIEW");
                        }}
                      />
                      <EditButton
                        handleUpdate={() => {
                          setSelectData(config);
                          setIsOpenModal("EDIT");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setCatchId(config.id);
                          setIsOpenModal("DELETE");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex flex-row items-center justify-between p-1">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, totalNum)}
          total={totalNum}
        />
          <Pagination
          pageNo={pageNo}
          totalNum={totalNum}
          pageSize={externalPageSize}
          handlePageClick={(targetPage) => setPageNo(targetPage)}
        />
      </div>

      {/* Modals remain unchanged */}
      {isOpenModal === "ADD" && (
        <AddAttendanceRule
          setModal={() => setIsOpenModal("")}
          handleGetAllTimeConfig={handleGetAllTimeConfig}
        />
      )}
      {isOpenModal === "EDIT" && (
        <EditAttendanceRule
          setModal={() => setIsOpenModal("")}
          handleGetAllTimeConfig={handleGetAllTimeConfig}
          selectData={selectData}
        />
      )}
      {isOpenModal === "VIEW" && viewData && (
        <ViewAttendanceRule
          setIsOpenModal={() => setIsOpenModal("")}
          viewConfig={viewData}
        />
      )}
      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => setIsOpenModal("DELETE")}
          onClose={() => setIsOpenModal("")}
          onConfirm={handleDeleteAttendanceRule}
        />
      )}
    </div>
  );
};
