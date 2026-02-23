import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { ShowDataNumber } from "../Components/Pagination/ShowDataNumber";
import { Pagination } from "../Components/Pagination/Pagination";
import { TableInputField } from "../Components/TableLayoutComponents/TableInputField";

import { EditButton } from "../Components/CustomButtons/EditButton";
import { DeleteButton } from "../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../Components/CustomButtons/ViewButton";

import { AddProgress } from "../Components/ProgressModal/AddProgress";
import { EditProgress } from "../Components/ProgressModal/EditProgress";
import { ViewProgress } from "../Components/ProgressModal/ViewProgress";

import { ConfirmationModal } from "../Components/Modal/ComfirmationModal";
import { Loader } from "../Components/LoaderComponent/Loader";

import { BASE_URL } from "../Content/URL";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { toast } from "react-toastify";

const numbers = [5, 10, 15, 20];

type PROGRESST = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";

export type ALLPROGRESST = {
  id: number;
  employee_id: number;
  employeeName: string;
  projectId: number;
  projectName: string;
  date: string;
  note: string;
};

export const Progress = ({ triggerModal }: { triggerModal: number }) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const [allProgress, setAllProgress] = useState<ALLPROGRESST[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<PROGRESST>("");

  const [viewProgressData, setViewProgressData] = useState<ALLPROGRESST | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedProgress, setSelectedProgress] = useState<ALLPROGRESST | null>(
    null,
  );

  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState(10);

  const handleGetAllProgress = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getProgress`
          : `${BASE_URL}/api/user/getMyProgress`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });

      setAllProgress(
        Array.isArray(res.data) ? res.data.sort((a, b) => a.id - b.id) : [],
      );
    } catch (error) {
      console.error("Failed to fetch progress:", error);
      setAllProgress([]);
    }
  }, [token, currentUser]);

  const handleDeleteProgress = async () => {
    if (!selectedId || !token) return;

    try {
      await axios.patch(`${BASE_URL}/api/admin/deleteProgress/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Progress has been deleted successfully");

      handleGetAllProgress();
      setIsOpenModal("");
      setSelectedId(null);
    } catch (error) {
      console.error("Failed to delete progress:", error);
    }
  };

  const handleEdit = (row: ALLPROGRESST) => {
    setSelectedProgress(row);
    setIsOpenModal("EDIT");
  };

  const handleView = (row: ALLPROGRESST) => {
    setViewProgressData(row);
    setIsViewModalOpen(true);
  };

  const handleChangeShowData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(Number(e.target.value));
    setPageNo(1);
  };

  const filteredProgress = allProgress.filter(
    (p) =>
      p.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalItems = filteredProgress.length;
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = Math.min(startIndex + selectedValue, totalItems);
  const paginatedProgress = filteredProgress.slice(startIndex, endIndex);

  useEffect(() => {
    handleGetAllProgress();
    document.title = "(OMS) PROGRESS";

    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("progress")), 500);
  }, [dispatch, handleGetAllProgress]);

  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("ADD");
    }
  }, [triggerModal]);

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col  bg-white">

        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            {/* Left Side: Show entries */}
            <div className="text-sm flex items-center">
              <span>Show</span>
              <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
                <select
                  value={selectedValue}
                  onChange={handleChangeShowData}
                  className="bg-transparent outline-none py-1 cursor-pointer"
                >
                  {numbers.map((num, index) => (
                    <option key={index} value={num}>
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
              setSearchTerm={(term) => {
                setSearchTerm(term);
                setPageNo(1);
              }}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto">
          <div className="min-w-[900px]">
            {/* Sticky Table Header */}
            <div
              className={`grid ${currentUser?.role === "admin" ? "grid-cols-5" : "grid-cols-4"} 
            bg-indigo-900 text-white items-center font-semibold text-sm sticky top-0 z-10 p-2`}
            >
              <span>Sr#</span>
              {currentUser?.role === "admin" && <span>Employee</span>}
              <span>Project</span>
              <span>Date</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedProgress.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedProgress.map((item, index) => (
                <div
                  key={item.id}
                  className={`grid ${currentUser?.role === "admin" ? "grid-cols-5" : "grid-cols-4"} 
                border-b border-x border-gray-200 text-gray-800 items-center text-sm p-2 hover:bg-gray-50 transition`}
                >
                  <span>{startIndex + index + 1}</span>
                  {currentUser?.role === "admin" && (
                    <span className="truncate">{item.employeeName}</span>
                  )}
                  <span className="truncate">{item.projectName}</span>
                  <span>
                    {new Date(item.date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    <EditButton handleUpdate={() => handleEdit(item)} />
                    <ViewButton handleView={() => handleView(item)} />
                    <DeleteButton
                      handleDelete={() => {
                        setSelectedId(item.id);
                        setIsOpenModal("DELETE");
                      }}
                    />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={totalItems === 0 ? 0 : startIndex + 1}
            end={Math.min(endIndex, totalItems)}
            total={totalItems}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={() =>
              setPageNo((p) => Math.max(p - 1, 1))
            }
            handleIncrementPageButton={() =>
              pageNo * selectedValue < totalItems && setPageNo((p) => p + 1)
            }
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
      {isOpenModal === "ADD" && (
        <AddProgress
          setModal={() => setIsOpenModal("")}
          handleRefresh={handleGetAllProgress}
        />
      )}

      {isOpenModal === "EDIT" && selectedProgress && (
        <EditProgress
          setModal={() => setIsOpenModal("")}
          progressData={selectedProgress}
          handleRefresh={handleGetAllProgress}
        />
      )}

      {isViewModalOpen && viewProgressData && (
        <ViewProgress
          setIsOpenModal={() => setIsViewModalOpen(false)}
          viewProgress={viewProgressData}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => {}}
          onClose={() => setIsOpenModal("")}
          onConfirm={handleDeleteProgress}
        />
      )}
    </div>
  );
};
