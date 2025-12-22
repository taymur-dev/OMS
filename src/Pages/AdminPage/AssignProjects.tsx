import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { useEffect, useState, useCallback } from "react";
import { AddAssignProject } from "../../Components/AssignProjectModal/AddAssignProject";
import { EditAssignProject } from "../../Components/AssignProjectModal/EditAssignProject";
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

type ASSIGNPROJECTT = "ADDPROJECT" | "EDITPROJECT" | "DELETEPROJECT" | "";

export type ALLASSIGNPROJECTT = {
  id: number;
  employee_id: number;
  name: string;
  projectName: string;
  projectId: number;
};

export const AssignProjects = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const isAdmin = currentUser?.role;
  const { loader } = useAppSelector((state) => state.NavigateSate);
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [allAssignProjects, setAllAssignProjects] = useState<
    ALLASSIGNPROJECTT[]
  >([]);
  const [isOpenModal, setIsOpenModal] = useState<ASSIGNPROJECTT>("");
  const [editData, setEditData] = useState<ALLASSIGNPROJECTT | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const token = currentUser?.token;

  const handleGetAllAssignProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getAssignProjects`, {
        headers: { Authorization: token },
      });
      const sortedData = (res.data || []).sort(
        (a: ALLASSIGNPROJECTT, b: ALLASSIGNPROJECTT) => a.id - b.id
      );
      setAllAssignProjects(sortedData);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleUpdateAssignProject = (updatedProject: ALLASSIGNPROJECTT) => {
    setAllAssignProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  };

  const handleDeleteAssignProject = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/deleteAssignProject/${id}`, {
        headers: { Authorization: token },
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
    }, 1000);
  }, [dispatch, handleGetAllAssignProjects]);

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  const handleToggleViewModal = (active: ASSIGNPROJECTT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const filteredProjects: ALLASSIGNPROJECTT[] = allAssignProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProjects: ALLASSIGNPROJECTT[] = filteredProjects.slice(
    (pageNo - 1) * entriesPerPage,
    pageNo * entriesPerPage
  );

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Assign Project" activeFile="Assign Project list" />
      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white overflow-hidden flex flex-col ">
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Attendance :{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [{allAssignProjects.length}]
            </span>
          </span>
          {isAdmin === "admin" && (
            <CustomButton
              label=" Add Assign Project"
              handleToggle={() => handleToggleViewModal("ADDPROJECT")}
            />
          )}
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setPageNo(1); // reset page to 1
                }}
              >
                {numbers.map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </span>
            <span>entries</span>
          </div>
          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
          <div
            className="grid grid-cols-[0.5fr_1fr_1fr_1fr] bg-gray-200 text-gray-900 font-semibold
           border border-gray-600 text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr#</span>
            <span>Users</span>
            <span>Project</span>
            <span>Actions</span>
          </div>

          {paginatedProjects.map(
            (allAssign: ALLASSIGNPROJECTT, index: number) => (
              <div
                className="grid grid-cols-[0.5fr_1fr_1fr_1fr] border border-gray-600
                 text-gray-800 hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[7px]"
                key={allAssign.id}
              >
                <span>{(pageNo - 1) * entriesPerPage + index + 1}</span>
                <span>{allAssign.name}</span>
                <span>{allAssign.projectName}</span>
                <span className="flex items-center gap-1">
                  <EditButton
                    handleUpdate={() => {
                      setEditData(allAssign);
                      handleToggleViewModal("EDITPROJECT");
                    }}
                  />
                  <DeleteButton
                    handleDelete={() => {
                      setEditData(allAssign);
                      handleToggleViewModal("DELETEPROJECT");
                    }}
                  />
                </span>
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber
          start={(pageNo - 1) * entriesPerPage + 1}
          end={Math.min(pageNo * entriesPerPage, filteredProjects.length)}
          total={filteredProjects.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
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
          setModal={() => handleToggleViewModal("")}
          editData={editData}
          onUpdate={(updatedProject) => {
            handleUpdateAssignProject({
              ...editData,
              ...updatedProject,
            });
            handleToggleViewModal("");
          }}
        />
      )}

      {isOpenModal === "DELETEPROJECT" && editData && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("DELETEPROJECT")}
          onClose={() => handleToggleViewModal("")}
          onConfirm={() => handleDeleteAssignProject(editData.id)}
        />
      )}
    </div>
  );
};
