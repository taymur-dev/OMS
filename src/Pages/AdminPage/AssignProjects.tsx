import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { AddAssignProject } from "../../Components/AssignProjectModal/AddAssignProject";
import { EditAssignProject } from "../../Components/AssignProjectModal/EditAssignProject";
import { ViewAssignProject } from "../../Components/AssignProjectModal/ViewAssignProject";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";

import { RiInboxArchiveLine } from "react-icons/ri";

export type ALLASSIGNPROJECTT = {
  id: number;
  employee_id: number;
  name: string;
  projectName: string;
  projectId: number;
  date: string;
};

interface AssignProjectsProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const AssignProjects = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: AssignProjectsProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const isAdmin = currentUser?.role === "admin";
  const token = currentUser?.token;

  const [allAssignProjects, setAllAssignProjects] = useState<
    ALLASSIGNPROJECTT[]
  >([]);
  const [isOpenModal, setIsOpenModal] = useState<
    "ADD" | "EDIT" | "DELETE" | "VIEW" | ""
  >("");
  const [editData, setEditData] = useState<ALLASSIGNPROJECTT | null>(null);
  const [pageNo, setPageNo] = useState(1);

  const handleGetAllAssignProjects = useCallback(async () => {
    if (!token || !currentUser) return;
    try {
      const url = isAdmin
        ? `${BASE_URL}/api/admin/getAssignProjects`
        : `${BASE_URL}/api/user/getMyAssignProjects`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllAssignProjects(
        Array.isArray(res.data) ? res.data.sort((a, b) => b.id - a.id) : [],
      );
    } catch (error) {
      console.error("Failed to fetch assign projects:", error);
    }
  }, [token, currentUser, isAdmin]);

  useEffect(() => {
    handleGetAllAssignProjects();
    document.title = "(OMS) ASSIGN PROJECTS";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Assign project"));
    }, 500);
  }, [dispatch, handleGetAllAssignProjects]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerModal > 0) setIsOpenModal("ADD");
  }, [triggerModal]);

  const handleDeleteAssignProject = async (id: number) => {
    if (!token) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/deleteAssignProject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleGetAllAssignProjects();
      setIsOpenModal("");
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const filteredProjects = allAssignProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(externalSearch.toLowerCase()) ||
      p.projectName.toLowerCase().includes(externalSearch.toLowerCase()),
  );

  const totalNum = filteredProjects.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + externalPageSize,
  );

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          {/* Header Bar */}
          <div className="px-0.5 pt-0.5">
            <div
              className={`grid ${
                isAdmin
                  ? "grid-cols-[60px_1fr_1fr_1fr_auto]"
                  : "grid-cols-[60px_1.5fr_1fr_auto]"
              } bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm`}
            >
              <span className="text-left">Sr#</span>
              {isAdmin && <span className="text-left">Employee Name</span>}
              <span className="text-left">Project Name</span>
              <span className="text-left">Assigned Date</span>
              <span className="text-right w-[140px] ">Actions</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="px-0.5 py-2">
            {paginatedProjects.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No assignment records found!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedProjects.map((item, index) => (
                  <div
                    key={item.id}
                    className={`grid ${
                      isAdmin
                        ? "grid-cols-[60px_1fr_1fr_1fr_auto]"
                        : "grid-cols-[60px_1.5fr_1fr_auto]"
                    } items-center px-3 py-2 gap-3 text-sm bg-white border border-gray-100 rounded-lg
                     hover:bg-blue-50/30 transition-colors shadow-sm`}
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {isAdmin && (
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="truncate font-semibold text-gray-800">
                          {item.name}
                        </span>
                      </div>
                    )}

                    <div className="text-blue-600 truncate">
                      {item.projectName}
                    </div>

                    <div className="text-gray-600 truncate">
                      {new Date(item.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>

                    <div className="flex items-center justify-end gap-1 w-[140px]">
                      <ViewButton
                        handleView={() => {
                          setEditData(item);
                          setIsOpenModal("VIEW");
                        }}
                      />
                      {isAdmin && (
                        <>
                          <EditButton
                            handleUpdate={() => {
                              setEditData(item);
                              setIsOpenModal("EDIT");
                            }}
                          />
                          <DeleteButton
                            handleDelete={() => {
                              setEditData(item);
                              setIsOpenModal("DELETE");
                            }}
                          />
                        </>
                      )}
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
          end={Math.min(startIndex + externalPageSize, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() =>
            startIndex + externalPageSize < totalNum && setPageNo((p) => p + 1)
          }
        />
      </div>

      {/* Modals remain unchanged */}
      {isOpenModal === "ADD" && (
        <AddAssignProject
          setModal={() => setIsOpenModal("")}
          handleGetAllAssignProjects={handleGetAllAssignProjects}
        />
      )}

      {isOpenModal === "EDIT" && editData && (
        <EditAssignProject
          setModal={() => setIsOpenModal("")}
          editData={editData}
          onUpdate={(updated) => {
            setAllAssignProjects((prev) =>
              prev.map((p) =>
                p.id === editData.id ? { ...p, ...updated } : p,
              ),
            );
            setIsOpenModal("");
          }}
        />
      )}

      {isOpenModal === "VIEW" && editData && (
        <ViewAssignProject
          setIsOpenModal={() => setIsOpenModal("")}
          viewProject={editData}
        />
      )}

      {isOpenModal === "DELETE" && editData && (
        <ConfirmationModal
          isOpen={() => {}}
          onClose={() => setIsOpenModal("")}
          onConfirm={() => handleDeleteAssignProject(editData.id)}
        />
      )}
    </div>
  );
};
