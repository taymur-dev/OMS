import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";

import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";

import { useEffect, useState, useCallback } from "react";
import { AddAssignProject } from "../../Components/AssignProjectModal/AddAssignProject";
import { EditAssignProject } from "../../Components/AssignProjectModal/EditAssignProject";
import { ViewAssignProject } from "../../Components/AssignProjectModal/ViewAssignProject";

import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";

const numbers = [10, 25, 50, 100];

type ASSIGNPROJECTT =
  | "ADDPROJECT"
  | "EDITPROJECT"
  | "DELETEPROJECT"
  | "VIEWPROJECT"
  | "";

export type ALLASSIGNPROJECTT = {
  id: number;
  employee_id: number;
  name: string;
  projectName: string;
  projectId: number;
  date: string;
};

export const AssignProjects = ({ triggerModal }: { triggerModal: number }) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const isAdmin = currentUser?.role === "admin";
  const token = currentUser?.token;

  const [searchTerm, setSearchTerm] = useState("");
  const [allAssignProjects, setAllAssignProjects] = useState<
    ALLASSIGNPROJECTT[]
  >([]);
  const [isOpenModal, setIsOpenModal] = useState<ASSIGNPROJECTT>("");
  const [editData, setEditData] = useState<ALLASSIGNPROJECTT | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const handleGetAllAssignProjects = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getAssignProjects`
          : `${BASE_URL}/api/user/getMyAssignProjects`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllAssignProjects(
        Array.isArray(res.data) ? res.data.sort((a, b) => a.id - b.id) : [],
      );
    } catch (error) {
      console.error("Failed to fetch assign projects:", error);
      setAllAssignProjects([]);
    }
  }, [token, currentUser]);

  const handleUpdateAssignProject = (updatedProject: ALLASSIGNPROJECTT) => {
    setAllAssignProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
    );
  };

  const handleDeleteAssignProject = async (id: number) => {
    if (!token) return;

    try {
      await axios.delete(`${BASE_URL}/api/admin/deleteAssignProject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleGetAllAssignProjects();
      setIsOpenModal("");
    } catch (error) {
      console.error("Failed to delete assign project:", error);
    }
  };

  useEffect(() => {
    handleGetAllAssignProjects();
    document.title = "(OMS) ASSIGN PROJECTS";

    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Assign project"));
    }, 500);
  }, [dispatch, handleGetAllAssignProjects]);

   useEffect(() => {
      if (triggerModal > 0) {
        setIsOpenModal("ADDPROJECT");
      }
    }, [triggerModal]);

  const filteredProjects = allAssignProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedProjects = filteredProjects.slice(
    (pageNo - 1) * entriesPerPage,
    pageNo * entriesPerPage,
  );

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow  bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col bg-white">

        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            {/* Left Side: Show entries */}
            <div className="text-sm flex items-center">
              <span>Show</span>
              <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setPageNo(1);
                  }}
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
              setSearchTerm={(term) => setSearchTerm(term)}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto">
          <div className="min-w-[900px]">
            {/* Sticky Table Header */}
            <div
              className={`grid ${
                isAdmin ? "grid-cols-5" : "grid-cols-4"
              } bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2`}
            >
              <span>Sr#</span>
              {isAdmin && <span>User</span>}
              <span>Project</span>
              <span>Date</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedProjects.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedProjects.map((item, index) => (
                <div
                  key={item.id}
                  className={`grid ${
                    isAdmin ? "grid-cols-5" : "grid-cols-4"
                  } border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition`}
                >
                  <span>{(pageNo - 1) * entriesPerPage + index + 1}</span>
                  {isAdmin && <span className="truncate">{item.name}</span>}
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

                  {/* Actions */}
                  <span className="flex flex-nowrap justify-center gap-1">
                    {isAdmin && (
                      <EditButton
                        handleUpdate={() => {
                          setEditData(item);
                          setIsOpenModal("EDITPROJECT");
                        }}
                      />
                    )}
                    <ViewButton
                      handleView={() => {
                        setEditData(item);
                        setIsOpenModal("VIEWPROJECT");
                      }}
                    />
                    {isAdmin && (
                      <DeleteButton
                        handleDelete={() => {
                          setEditData(item);
                          setIsOpenModal("DELETEPROJECT");
                        }}
                      />
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={
              paginatedProjects.length === 0
                ? 0
                : (pageNo - 1) * entriesPerPage + 1
            }
            end={Math.min(pageNo * entriesPerPage, filteredProjects.length)}
            total={filteredProjects.length}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={() =>
              setPageNo((p) => Math.max(p - 1, 1))
            }
            handleIncrementPageButton={() =>
              pageNo * entriesPerPage < filteredProjects.length &&
              setPageNo((p) => p + 1)
            }
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
      {isOpenModal === "ADDPROJECT" && (
        <AddAssignProject
          setModal={() => setIsOpenModal("")}
          handleGetAllAssignProjects={handleGetAllAssignProjects}
        />
      )}

      {isOpenModal === "EDITPROJECT" && editData && (
        <EditAssignProject
          setModal={() => setIsOpenModal("")}
          editData={editData}
          onUpdate={(updatedProject) => {
            handleUpdateAssignProject({ ...editData, ...updatedProject });
            setIsOpenModal("");
          }}
        />
      )}

      {isOpenModal === "VIEWPROJECT" && editData && (
        <ViewAssignProject
          setIsOpenModal={() => setIsOpenModal("")}
          viewProject={editData}
        />
      )}

      {isOpenModal === "DELETEPROJECT" && editData && (
        <ConfirmationModal
          isOpen={() => {}}
          onClose={() => setIsOpenModal("")}
          onConfirm={() => handleDeleteAssignProject(editData.id)}
        />
      )}
    </div>
  );
};
