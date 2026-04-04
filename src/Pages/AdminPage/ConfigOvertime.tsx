import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
// import { toast } from "react-toastify";

// UI Components
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";

import { ViewButton } from "../../Components/CustomButtons/ViewButton";
// import { EditButton } from "../../Components/CustomButtons/EditButton"; // Ensure you have this component
// import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { Dispatch, SetStateAction } from "react";

import { AddConfigOvertime } from "../../Components/ConfigOvertimeModal/AddConfigOvertime";
import { ViewConfigOvertime } from "../../Components/ConfigOvertimeModal/ViewConfigOvertime";
// import { EditConfigOvertime } from "../../Components/ConfigOvertimeModal/EditConfigOvertime";
// import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";

// Icons
import { RiHistoryLine } from "react-icons/ri";

type OVERTIMET = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

type allOvertimeT = {
  id: number;
  overtimeType: string;
  amount: number | string;
};

interface ConfigOvertimeProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
  setHasOvertime: Dispatch<SetStateAction<boolean>>;
}

export const ConfigOvertime = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: ConfigOvertimeProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<OVERTIMET>("");
  const [allOvertime, setAllOvertime] = useState<allOvertimeT[]>([]);
  const [selectedOvertime, setSelectedOvertime] = useState<allOvertimeT | null>(
    null,
  );
  const [pageNo, setPageNo] = useState(1);
  // const [deleteId, setDeleteId] = useState<number | null>(null);

  const token = currentUser?.token;

  const handleToggleModal = (active: OVERTIMET) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const getAllOvertimeConfigs = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getOvertimeConfig`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllOvertime(res.data.data);
    } catch (error) {
      console.error("Error fetching overtime config:", error);
    }
  }, [token]);

  // const handleDeleteOvertime = async (id: number) => {
  //   try {
  //     const res = await axios.delete(
  //       `${BASE_URL}/api/admin/deleteOvertimeConfig/${id}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       },
  //     );
  //     toast.success(res.data.message || "Config deleted successfully");
  //     getAllOvertimeConfigs(); // Refresh the list
  //     handleToggleModal(""); // Close modal
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Failed to delete configuration");
  //   }
  // };

  useEffect(() => {
    getAllOvertimeConfigs();
  }, [getAllOvertimeConfigs]);

  useEffect(() => {
    if (triggerModal > 0) setIsOpenModal("ADD");
  }, [triggerModal]);

  useEffect(() => {
    document.title = "(OMS) CONFIG OVERTIME";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("OVERTIME")), 1000);
  }, [dispatch]);

  // Reset pagination on search
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  const filteredOvertime = useMemo(() => {
    return allOvertime.filter((item) =>
      item.overtimeType.toLowerCase().includes(externalSearch.toLowerCase()),
    );
  }, [allOvertime, externalSearch]);

  const totalRecords = filteredOvertime.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedData = filteredOvertime.slice(
    startIndex,
    startIndex + externalPageSize,
  );

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[800px]">
          {/* Header Row - 4 Column Layout */}
          <div className="px-0.5 pt-0.5">
            <div className="grid grid-cols-[80px_1fr_1fr_160px] bg-blue-500 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-5 py-3 shadow-sm">
              <span className="text-left">Sr#</span>
              <span className="text-left">Overtime Hour</span>
              <span className="text-left">Amount / Rate</span>
              <span className="text-right pr-4">Actions</span>
            </div>
          </div>

          {/* Data Rows */}
          <div className="px-0.5 sm:px-1 py-2">
            {paginatedData.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiHistoryLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No overtime configurations found!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedData.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[80px_1fr_1fr_160px] items-center px-5 py-2 gap-3 text-sm bg-white
                               border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    <span className="text-gray-800 font-medium">
                      {item.overtimeType}
                    </span>

                    <div className="text-gray-600 font-medium">
                      {Number(item.amount).toLocaleString()}
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <ViewButton
                        handleView={() => {
                          setSelectedOvertime(item);
                          handleToggleModal("VIEW");
                        }}
                      />

                      {/* <EditButton
                        handleUpdate={() => {
                          setSelectedOvertime(item);
                          handleToggleModal("EDIT");
                        }}
                      />

                      <DeleteButton
                        handleDelete={() => {
                          setDeleteId(item.id);
                          handleToggleModal("DELETE");
                        }}
                      /> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-row items-center justify-between p-2 mt-auto">
        <ShowDataNumber
          start={totalRecords === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + externalPageSize, totalRecords)}
          total={totalRecords}
        />
        <Pagination
          pageNo={pageNo}
          totalNum={filteredOvertime.length}
          pageSize={externalPageSize}
          handlePageClick={(targetPage) => setPageNo(targetPage)}
        />
      </div>

      {/* Modal Logic (Placeholders for your specific Overtime components) */}
      {isOpenModal === "ADD" && (
        <AddConfigOvertime
          existingOvertime={allOvertime}
          refreshOvertime={getAllOvertimeConfigs}
          setModal={() => handleToggleModal("")}
        />
      )}

      {isOpenModal === "VIEW" && selectedOvertime && (
        <ViewConfigOvertime
          data={selectedOvertime}
          setModal={() => handleToggleModal("")}
        />
      )}

      {/* {isOpenModal === "EDIT" && selectedOvertime && (
        <EditConfigOvertime
          data={selectedOvertime}
          existingOvertime={allOvertime}
          refreshOvertime={getAllOvertimeConfigs}
          setModal={() => handleToggleModal("")}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => handleToggleModal("DELETE")}
          onClose={() => handleToggleModal("")}
          onConfirm={() => {
            if (deleteId !== null) handleDeleteOvertime(deleteId);
          }}
          message="Are you sure you want to delete this Overtime Configuration?"
        />
      )} */}
    </div>
  );
};
