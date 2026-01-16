import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
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
};

export const AssignProjects = () => {
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
        Array.isArray(res.data) ? res.data.sort((a, b) => a.id - b.id) : []
      );
    } catch (error) {
      console.error("Failed to fetch assign projects:", error);
      setAllAssignProjects([]);
    }
  }, [token, currentUser]);

  const handleUpdateAssignProject = (updatedProject: ALLASSIGNPROJECTT) => {
    setAllAssignProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
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

  const filteredProjects = allAssignProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProjects = filteredProjects.slice(
    (pageNo - 1) * entriesPerPage,
    pageNo * entriesPerPage
  );

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Assign Project" activeFile="Assign Project list" />

      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mx-2">
          <span>
            Total Assign Projects:{" "}
            <span className="text-2xl text-indigo-900 font-semibold">
              [{filteredProjects.length}]
            </span>
          </span>

          {isAdmin && (
            <CustomButton
              label="Add Assign Project"
              handleToggle={() => setIsOpenModal("ADDPROJECT")}
            />
          )}
        </div>

        <div className="flex justify-between mx-2">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setPageNo(1);
              }}
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

        <div className="flex-1 mx-2">
          <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr] bg-indigo-900 text-white font-semibold p-2 sticky top-0">
            <span>Sr#</span>
            <span>User</span>
            <span>Project</span>
            <span className="text-center">Actions</span>
          </div>

          {paginatedProjects.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-[0.5fr_1fr_1fr_1fr] p-2 border hover:bg-gray-100"
            >
              <span>{(pageNo - 1) * entriesPerPage + index + 1}</span>
              <span>{item.name}</span>
              <span>{item.projectName}</span>

              <span className="flex justify-center gap-1">
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
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <ShowDataNumber
          start={(pageNo - 1) * entriesPerPage + 1}
          end={Math.min(pageNo * entriesPerPage, filteredProjects.length)}
          total={filteredProjects.length}
        />

        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() =>
            pageNo * entriesPerPage < filteredProjects.length &&
            setPageNo((p) => p + 1)
          }
        />
      </div>

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
            handleUpdateAssignProject({
              ...editData,
              ...updatedProject,
            });
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
