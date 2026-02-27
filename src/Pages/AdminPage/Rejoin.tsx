import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";

import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";

import { AddRejoining } from "../../Components/RejoinModal/AddRejoining";
import { UpdateRejoining } from "../../Components/RejoinModal/UpdateRejoining";
import { ViewRejoin } from "../../Components/RejoinModal/ViewRejoin";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { RiInboxArchiveLine } from "react-icons/ri";

export type REJOIN_T = {
  id: number;
  employee_id: number;
  employee_name: string;
  designation: string;
  resignation_date: string;
  rejoinRequest_date: string;
  note: string;
  approval_status: string;
};

interface RejoinProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const Rejoin = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: RejoinProps) => {
  const dispatch = useAppDispatch();
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [rejoinList, setRejoinList] = useState<REJOIN_T[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<
    "ADD" | "VIEW" | "EDIT" | "DELETE" | ""
  >("");

  const [selectedRejoin, setSelectedRejoin] = useState<REJOIN_T | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pageNo, setPageNo] = useState(1);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleGetRejoinRequests = useCallback(async () => {
    if (!token || !currentUser) return;
    dispatch(navigationStart());
    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getAllRejoinRequests`
          : `${BASE_URL}/api/user/getMyRejoinRequests`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRejoinList(
        Array.isArray(res.data) ? res.data.sort((a, b) => a.id - b.id) : [],
      );
      dispatch(navigationSuccess("REJOIN"));
    } catch (error) {
      console.error("Failed to fetch rejoin requests:", error);
      setRejoinList([]);
    }
  }, [token, currentUser, dispatch]);

  const handleDeleteRejoin = async () => {
    if (!selectedId || !token) return;

    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteRejoin/${selectedId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      handleGetRejoinRequests();
      setIsOpenModal("");
      setSelectedId(null);
    } catch (error) {
      console.error("Failed to delete rejoin request:", error);
    }
  };

  useEffect(() => {
    document.title = "(OMS) REJOIN";
    handleGetRejoinRequests();
  }, [handleGetRejoinRequests]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("ADD");
    }
  }, [triggerModal]);

  if (loader) return <Loader />;

  const filteredData = rejoinList.filter(
    (r) =>
      r.employee_name.toLowerCase().includes(externalSearch.toLowerCase()) ||
      r.designation.toLowerCase().includes(externalSearch.toLowerCase()) ||
      r.approval_status?.toLowerCase().includes(externalSearch.toLowerCase()),
  );

  const totalItems = filteredData.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          <div className="px-0.5 pt-0.5">
            <div
              className={`grid ${
                isAdmin
                  ? "grid-cols-[60px_1fr_1fr_1fr_1fr_0.8fr_auto]"
                  : "grid-cols-[60px_1fr_1fr_1fr_0.8fr_auto]"
              } bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm`}
            >
              <span className="text-left">Sr#</span>
              {isAdmin && <span className="text-left">Employee Name</span>}
              <span className="text-left">Position</span>
              <span className="text-left">Resignation</span>
              <span className="text-left">Rejoin Date</span>
              <span className="text-left">Status</span>
              <span className="text-right pr-4">Actions</span>
            </div>
          </div>

          <div className="px-0.5 sm:px-1 py-2">
            {paginatedData.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedData.map((item, index) => (
                  <div
                    key={item.id}
                    className={`grid ${
                      isAdmin
                        ? "grid-cols-[60px_1fr_1fr_1fr_1fr_0.8fr_auto]"
                        : "grid-cols-[60px_1fr_1fr_1fr_0.8fr_auto]"
                    } items-center px-3 py-2 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm`}
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {isAdmin && (
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="truncate  text-gray-800">
                          {item.employee_name}
                        </span>
                      </div>
                    )}

                    <div className="text-gray-600 truncate">
                      {item.designation}
                    </div>

                    <div className="text-gray-600 truncate">
                      {formatDate(item.resignation_date)}
                    </div>

                    <div className="text-gray-600 truncate">
                      {formatDate(item.rejoinRequest_date)}
                    </div>

                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyles(
                          item.approval_status,
                        )}`}
                      >
                        {(item.approval_status || "Pending").toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-1">
                      <ViewButton
                        handleView={() => {
                          setSelectedRejoin(item);
                          setIsOpenModal("VIEW");
                        }}
                      />
                      <EditButton
                        handleUpdate={() => {
                          setSelectedRejoin(item);
                          setIsOpenModal("EDIT");
                        }}
                      />
                      {isAdmin && (
                        <DeleteButton
                          handleDelete={() => {
                            setSelectedId(item.id);
                            setIsOpenModal("DELETE");
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer and Modals remain largely the same, ensuring logic consistency */}
      <div className="flex flex-row items-center justify-between p-1">
        <ShowDataNumber
          start={totalItems === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, totalItems)}
          total={totalItems}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() => {
            const totalPages = Math.ceil(totalItems / externalPageSize);
            if (pageNo < totalPages) setPageNo((prev) => prev + 1);
          }}
        />
      </div>
      {isOpenModal === "ADD" && (
        <AddRejoining
          setModal={() => setIsOpenModal("")}
          handleRefresh={handleGetRejoinRequests}
        />
      )}

      {isOpenModal === "EDIT" && selectedRejoin && (
        <UpdateRejoining
          setModal={() => setIsOpenModal("")}
          rejoinData={selectedRejoin}
          handleRefresh={handleGetRejoinRequests}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => {}}
          onClose={() => setIsOpenModal("")}
          onConfirm={handleDeleteRejoin}
          message="Are you sure you want to delete this rejoining request?"
        />
      )}

      {isOpenModal === "VIEW" && selectedRejoin && (
        <ViewRejoin
          setIsOpenModal={() => setIsOpenModal("")}
          viewRejoin={selectedRejoin}
        />
      )}
    </div>
  );
};
