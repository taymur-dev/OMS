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
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddAssignProject } from "../../Components/AssignProjectModal/AddAssignProject";
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

export type GROUPED_PROJECT = {
  employee_id: number;
  name: string;
  projects: ALLASSIGNPROJECTT[];
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

  const [editData, setEditData] = useState<GROUPED_PROJECT | null>(null);

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

  // 🔥 FILTER
  const filteredProjects = allAssignProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(externalSearch.toLowerCase()) ||
      p.projectName.toLowerCase().includes(externalSearch.toLowerCase()),
  );

  // 🔥 GROUP BY EMPLOYEE
  const groupedProjects: GROUPED_PROJECT[] = Object.values(
    filteredProjects.reduce(
      (acc, curr) => {
        if (!acc[curr.employee_id]) {
          acc[curr.employee_id] = {
            employee_id: curr.employee_id,
            name: curr.name,
            projects: [],
          };
        }

        acc[curr.employee_id].projects.push(curr);
        return acc;
      },
      {} as Record<number, GROUPED_PROJECT>,
    ),
  );

  const totalNum = groupedProjects.length;
  const startIndex = (pageNo - 1) * externalPageSize;

  const paginatedProjects = groupedProjects.slice(
    startIndex,
    startIndex + externalPageSize,
  );

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      {/* Scrollable Section */}
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          {/* Header */}
          <div className="px-0.5 pt-0.5">
            <div
              className={`grid ${
                isAdmin
                  ? "grid-cols-[80px_1fr_1fr_1fr_auto]"
                  : "grid-cols-[80px_1.5fr_1fr_auto]"
              } 
            bg-blue-400 text-white rounded-lg items-center font-bold 
            text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm`}
            >
              <span>Sr#</span>
              {isAdmin && <span>Employee Name</span>}
              <span>Projects</span>
              <span>Last Assigned</span>
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>

          {/* Body */}
          <div className="px-0.5 sm:px-1 py-2">
            {paginatedProjects.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No records available!</p>
                <p className="text-sm">Try adjusting your search.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedProjects.map((item, index) => (
                  <div
                    key={item.employee_id}
                    className={`grid ${
                      isAdmin
                        ? "grid-cols-[80px_1fr_1fr_1fr_auto]"
                        : "grid-cols-[80px_1.5fr_1fr_auto]"
                    } 
                  items-center px-3 py-2 gap-3 text-sm bg-white 
                  border border-gray-100 rounded-lg 
                  hover:bg-blue-50/30 transition-colors shadow-sm`}
                  >
                    {/* Sr# */}
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Employee */}
                    {isAdmin && (
                      <div className="truncate text-gray-800">{item.name}</div>
                    )}

                    {/* Projects Count */}
                    <div className="text-gray-700">
                      {item.projects.length} Project(s)
                    </div>

                    {/* Date */}
                    <div className="text-gray-600">
                      {new Date(item.projects[0].date).toLocaleDateString(
                        "en-GB",
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1 w-[140px]">
                      <ViewButton
                        handleView={() => {
                          setEditData(item);
                          setIsOpenModal("VIEW");
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

      {/* Pagination */}
      <div className="flex flex-row items-center justify-between p-1">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + externalPageSize, totalNum)}
          total={totalNum}
        />

        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() =>
            setPageNo((p) => (p > 1 ? p - 1 : 1))
          }
          handleIncrementPageButton={() => {
            const totalPages = Math.ceil(
              groupedProjects.length / externalPageSize,
            );
            if (pageNo < totalPages) setPageNo((p) => p + 1);
          }}
        />
      </div>

      {/* Modals */}
      {isOpenModal === "ADD" && (
        <AddAssignProject
          setModal={() => setIsOpenModal("")}
          handleGetAllAssignProjects={handleGetAllAssignProjects}
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
          onConfirm={() => handleDeleteAssignProject(editData.projects[0].id)}
          message="Are you sure you want to delete this assignment?"
        />
      )}
    </div>
  );
};
