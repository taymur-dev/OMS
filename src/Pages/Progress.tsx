import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { ShowDataNumber } from "../Components/Pagination/ShowDataNumber";
import { Pagination } from "../Components/Pagination/Pagination";
import { TableInputField } from "../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../Components/CustomButtons/EditButton";
import { DeleteButton } from "../Components/CustomButtons/DeleteButton";

import { AddProgress } from "../Components/ProgressModal/AddProgress";
import { EditProgress } from "../Components/ProgressModal/EditProgress";
import { ConfirmationModal } from "../Components/Modal/ComfirmationModal";
import { Loader } from "../Components/LoaderComponent/Loader";

import { BASE_URL } from "../Content/URL";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";

const numbers = [5, 10, 15, 20];

type PROGRESST = "ADD" | "EDIT" | "DELETE" | "";

export type ALLPROGRESST = {
  id: number;
  employee_id: number;
  employeeName: string;
  projectId: number;
  projectName: string;
  date: string;
  note: string;
};

export const Progress = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateSate);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const [allProgress, setAllProgress] = useState<ALLPROGRESST[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<PROGRESST>("");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedProgress, setSelectedProgress] = useState<ALLPROGRESST | null>(
    null
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
        Array.isArray(res.data) ? res.data.sort((a, b) => a.id - b.id) : []
      );
    } catch (error) {
      console.error("Failed to fetch progress:", error);
      setAllProgress([]);
    }
  }, [token, currentUser]);

  const handleDeleteProgress = async () => {
    if (!selectedId || !token) return;

    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteProgress/${selectedId}`,
        {},
        { headers: { Authorization: token } }
      );

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

  const handleChangeShowData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(Number(e.target.value));
    setPageNo(1);
  };

  const filteredProgress = allProgress.filter(
    (p) =>
      p.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Progress" activeFile="All Progress list" />

      <div className="max-h-[74.5vh] shadow-lg border-t-2 rounded border-indigo-500 bg-white flex flex-col">
        <div className="flex items-center justify-between mx-2">
          <span>
            Total number of Progress:{" "}
            <span className="text-2xl text-blue-500 font-semibold">
              [{totalItems}]
            </span>
          </span>

          <CustomButton
            label="Add Progress"
            handleToggle={() => setIsOpenModal("ADD")}
          />
        </div>

        <div className="flex justify-between mx-2">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={selectedValue}
              onChange={handleChangeShowData}
              className="bg-gray-200 rounded px-2 py-1"
            >
              {numbers.map((num) => (
                <option key={num}>{num}</option>
              ))}
            </select>
            <span>entries</span>
          </div>

          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={(term) => {
              setSearchTerm(term);
              setPageNo(1);
            }}
          />
        </div>

        <div className="overflow-y-auto">
          <div className="grid grid-cols-[1fr_1fr_2fr_1fr_1fr] bg-gray-200 font-semibold p-2 sticky top-0">
            <span>Sr#</span>
            {currentUser?.role === "admin" && <span>Employee</span>}
            <span>Project</span>
            <span>Date</span>
            <span className="text-center">Actions</span>
          </div>

          {paginatedProgress.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_1fr_2fr_1fr_1fr] p-2 border hover:bg-gray-100"
            >
              <span>{startIndex + index + 1}</span>
              {currentUser?.role === "admin" && (
                <span>{item.employeeName}</span>
              )}
              <span>{item.projectName}</span>
              <span>{item.date.slice(0, 10)}</span>

              <span className="flex justify-center gap-1">
                <EditButton handleUpdate={() => handleEdit(item)} />

                <DeleteButton
                  handleDelete={() => {
                    setSelectedId(item.id);
                    setIsOpenModal("DELETE");
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <ShowDataNumber
          start={startIndex + 1}
          end={endIndex}
          total={totalItems}
        />

        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() =>
            pageNo * selectedValue < totalItems && setPageNo((p) => p + 1)
          }
        />
      </div>

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
