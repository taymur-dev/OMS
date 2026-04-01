import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { BASE_URL } from "../../Content/URL";

// Components
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddAdvanceSalary } from "../../Components/AdvanceSalaryModal/AddAdvanceSalary";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { EditAdvanceSalary } from "../../Components/AdvanceSalaryModal/EditAdvanceSalary";
import { ViewAdvanceSalary } from "../../Components/AdvanceSalaryModal/ViewAdvanceSalary";

// Icons
import { RiInboxArchiveLine } from "react-icons/ri";

export type AdvanceSalaryType = {
  id: number;
  employee_id: number;
  employee_name: string;
  date: string;
  amount: number;
  approvalStatus: string;
  description: string;
};

interface AdvanceSalaryProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

type AdvanceSalaryT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

export const AdvanceSalary = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: AdvanceSalaryProps) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [allAdvance, setAllAdvance] = useState<AdvanceSalaryType[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<AdvanceSalaryT>("");
  const [selectedAdvance, setSelectedAdvance] =
    useState<AdvanceSalaryType | null>(null);
  const [pageNo, setPageNo] = useState(1);

  const handleToggleViewModal = (
    active: AdvanceSalaryT,
    advance?: AdvanceSalaryType,
  ) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
    if (active === "EDIT" || active === "VIEW" || active === "DELETE") {
      setSelectedAdvance(advance ?? null);
    } else {
      setSelectedAdvance(null);
    }
  };

  const handleGetAllAdvance = useCallback(async () => {
    if (!token || !currentUser) return;
    try {
      const url = isAdmin
        ? `${BASE_URL}/api/admin/getAdvanceSalary`
        : `${BASE_URL}/api/user/getMyAdvanceSalary`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllAdvance(
        Array.isArray(res.data) ? res.data.sort((a, b) => b.id - a.id) : [],
      );
    } catch (error) {
      console.error("Failed to fetch advance salary:", error);
      setAllAdvance([]);
    }
  }, [token, currentUser, isAdmin]);

  const handleDeleteAdvance = async () => {
    if (!selectedAdvance?.id || !token) return;
    try {
      await axios.delete(
        `${BASE_URL}/api/admin/deleteAdvanceSalary/${selectedAdvance.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      handleGetAllAdvance();
      setIsOpenModal("");
      setSelectedAdvance(null);
    } catch (error) {
      console.error("Failed to delete advance salary:", error);
    }
  };

  useEffect(() => {
    handleGetAllAdvance();
    document.title = "(OMS) ADVANCE SALARY";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("ADVANCE SALARY")), 500);
  }, [dispatch, handleGetAllAdvance]);

  useEffect(() => {
    if (triggerModal > 0) setIsOpenModal("ADD");
  }, [triggerModal]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  if (loader) return <Loader />;

  const filteredAdvance = allAdvance.filter(
    (a) =>
      a.employee_name.toLowerCase().includes(externalSearch.toLowerCase()) ||
      a.description?.toLowerCase().includes(externalSearch.toLowerCase()),
  );

  const totalNum = filteredAdvance.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedAdvance = filteredAdvance.slice(startIndex, endIndex);



  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    let colors = "bg-gray-100 text-gray-800 border-gray-200";
    if (s === "approved")
      colors = "bg-green-100 text-green-700 border-green-200";
    if (s === "pending")
      colors = "bg-orange-100 text-orange-700 border-orange-200";
    if (s === "rejected") colors = "bg-red-100 text-red-700 border-red-200";

    return (
      <span
        className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${colors}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          {/* Header Row */}
          <div className="px-0.5 pt-0.5">
            <div
              className={`grid ${
                isAdmin
                  ? "grid-cols-[60px_1.5fr_1fr_1fr_1fr_auto]"
                  : "grid-cols-[60px_1fr_1fr_1fr_auto]"
              } bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm`}
            >
              <span className="text-left">Sr#</span>
              {isAdmin && <span className="text-left">Employee Details</span>}
              <span className="text-left">Request Date</span>
              <span className="text-left">Amount</span>
              <span className="text-left">Status</span>
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>

          {/* Data Rows */}
          <div className="px-0.5 sm:px-1 py-2">
            {paginatedAdvance.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border border-dashed p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No advance salary records found!
                </p>
                <p className="text-sm">Try adjusting your search filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedAdvance.map((item, index) => (
                  <div
                    key={item.id}
                    className={`grid ${
                      isAdmin
                        ? "grid-cols-[60px_1.5fr_1fr_1fr_1fr_auto]"
                        : "grid-cols-[60px_1fr_1fr_1fr_auto]"
                    } items-center px-3 py-2 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm`}
                  >
                    {/* Sr# */}
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Employee Details (Admin Only) */}
                    {isAdmin && (
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className=" text-gray-800 truncate">
                          {item.employee_name}
                        </span>
                      </div>
                    )}

                    {/* Request Date - Icon Removed */}
                    <div className="text-gray-600 truncate">
                      {new Date(item.date)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(/ /g, "-")}
                    </div>

                    {/* Amount - Icon Removed */}
                    <div className="text-gray-600  truncate">
                      {item.amount.toLocaleString()}
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      {getStatusBadge(item.approvalStatus)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1 w-[140px]">
                      <ViewButton
                        handleView={() => handleToggleViewModal("VIEW", item)}
                      />
                      <EditButton
                        handleUpdate={() => handleToggleViewModal("EDIT", item)}
                      />
                      {isAdmin && (
                        <DeleteButton
                          handleDelete={() => {
                            setSelectedAdvance(item);
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

      {/* Pagination Footer */}
      <div className="flex flex-row items-center justify-between p-2 border-t border-gray-50">
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
      {/* Modals */}
      {isOpenModal === "ADD" && (
        <AddAdvanceSalary
          setModal={() => handleToggleViewModal("")}
          handleRefresh={handleGetAllAdvance}
        />
      )}
      {isOpenModal === "EDIT" && selectedAdvance && (
        <EditAdvanceSalary
          setModal={() => handleToggleViewModal("")}
          handleRefresh={handleGetAllAdvance}
          advanceData={selectedAdvance}
        />
      )}
      {isOpenModal === "VIEW" && selectedAdvance && (
        <ViewAdvanceSalary
          setIsOpenModal={() => handleToggleViewModal("")}
          viewAdvance={selectedAdvance}
        />
      )}
      {isOpenModal === "DELETE" && selectedAdvance && (
        <ConfirmationModal
          isOpen={() => {}}
          onClose={() => setIsOpenModal("")}
          onConfirm={handleDeleteAdvance}
        />
      )}
    </div>
  );
};
