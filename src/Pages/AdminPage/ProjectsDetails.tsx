import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";

import { useEffect, useState, useCallback, useMemo } from "react";
import { AddProject } from "../../Components/ProjectModal/AddProject";
import { UpdateProject } from "../../Components/ProjectModal/UpdateProject";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { useAppSelector } from "../../redux/Hooks";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { toast } from "react-toastify";
import { ViewProject } from "../../Components/ProjectModal/ViewProject";

const numbers = [10, 25, 50, 100];

type TPROJECT =
  | "ADDPROJECT"
  | "EDITPROJECT"
  | "VIEWPROJECT"
  | "DELETEPROJECT"
  | "";

type AllProjectT = {
  id: number;
  projectName: string;
  projectCategory: string;
  description: string;
  startDate: string;
  endDate: string;
  completionStatus: string;
};

export const ProjectsDetails = ({ triggerModal }: { triggerModal: number }) => {
  const { loader } = useAppSelector((state) => state?.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [allProjects, setAllProjects] = useState<AllProjectT[]>([]);
  const [viewProject, setViewProject] = useState<AllProjectT | null>(null);
  const [catchId, setCatchId] = useState<number>();
  const [selectProject, setSelectProject] = useState<AllProjectT | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<TPROJECT | "">("");
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const handleGetAllProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getProjects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedProjects = res.data.sort(
        (a: AllProjectT, b: AllProjectT) => a.id - b.id,
      );
      setAllProjects(sortedProjects);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleDeleteProject = async () => {
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteProject/${catchId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Project has been deleted successfully");
      setAllProjects((prev) => prev.filter((p) => p.id !== catchId));
      setIsOpenModal("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickEditButton = (projectData: AllProjectT) => {
    setSelectProject(projectData);
    setIsOpenModal("EDITPROJECT");
  };

  const handleClickViewButton = (viewData: AllProjectT) => {
    setViewProject(viewData);
    setIsOpenModal("VIEWPROJECT");
  };

  const handleClickDeleteButton = (id: number) => {
    setCatchId(id);
    setIsOpenModal("DELETEPROJECT");
  };

  const filteredProjects = useMemo(
    () =>
      allProjects.filter(
        (project) =>
          project.projectName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.projectCategory
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      ),
    [allProjects, searchTerm],
  );

  const paginatedProjects = useMemo(
    () =>
      filteredProjects.slice(
        (pageNo - 1) * entriesPerPage,
        pageNo * entriesPerPage,
      ),
    [filteredProjects, pageNo, entriesPerPage],
  );

  useEffect(() => {
    handleGetAllProjects();
  }, [handleGetAllProjects]);

   useEffect(() => {
      if (triggerModal > 0) {
        setIsOpenModal("ADDPROJECT");
      }
    }, [triggerModal]);

  if (loader) return <Loader />;

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";

    switch (status?.toLowerCase()) {
      case "complete":
        return `${baseClasses} bg-green-700 text-white border border-green-200`;
      case "new":
        return `${baseClasses} bg-blue-500 text-white border border-blue-200`;
      case "working":
        return `${baseClasses} bg-yellow-500 text-white border border-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
    }
  };

  return (
    <div className="flex flex-col flex-grow  bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col  bg-white">
      


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
                  {numbers.map((num) => (
                    <option key={num} value={num}>
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
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto">
          <div className="min-w-[900px]">
            {/* Sticky Table Header */}
            <div
              className="grid grid-cols-7 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2 "
            >
              <span>Sr#</span>
              <span>Project Category</span>
              <span>Project</span>
              <span>Start Date</span>
              <span>End Date</span>
              <span>Completion Status</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedProjects.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="grid grid-cols-7 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm px-2 py-1 hover:bg-gray-50 transition"
                >
                  <span>{(pageNo - 1) * entriesPerPage + index + 1}</span>
                  <span className="truncate">{project.projectCategory}</span>
                  <span className="truncate">{project.projectName}</span>
                  <span>
                    {new Date(project.startDate)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </span>
                  <span>
                    {new Date(project.endDate)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </span>
                  <span className="flex items-center">
                    <span className={getStatusBadge(project.completionStatus)}>
                      {project.completionStatus}
                    </span>
                  </span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    <EditButton
                      handleUpdate={() => handleClickEditButton(project)}
                    />
                    <ViewButton
                      handleView={() => handleClickViewButton(project)}
                    />
                    <DeleteButton
                      handleDelete={() => handleClickDeleteButton(project.id)}
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
              setPageNo((prev) => (prev > 1 ? prev - 1 : 1))
            }
            handleIncrementPageButton={() =>
              setPageNo((prev) =>
                prev * entriesPerPage < filteredProjects.length
                  ? prev + 1
                  : prev,
              )
            }
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
      {isOpenModal === "ADDPROJECT" && (
        <AddProject
          setModal={() => setIsOpenModal("")}
          handleGetAllProjects={handleGetAllProjects}
        />
      )}

      {isOpenModal === "EDITPROJECT" && selectProject && (
        <UpdateProject
          setModal={() => setIsOpenModal("")}
          selectProject={selectProject}
          onUpdate={(updatedProject) =>
            setAllProjects((prev) =>
              prev.map((p) =>
                p.id === updatedProject.id ? updatedProject : p,
              ),
            )
          }
        />
      )}

      {isOpenModal === "DELETEPROJECT" && (
        <ConfirmationModal
          isOpen={() => setIsOpenModal("DELETEPROJECT")}
          onClose={() => setIsOpenModal("")}
          message="Are you sure you want to delete this project?"
          onConfirm={handleDeleteProject}
        />
      )}

      {isOpenModal === "VIEWPROJECT" && viewProject && (
        <ViewProject
          setIsOpenModal={() => setIsOpenModal("")}
          viewProject={viewProject}
        />
      )}

     
    </div>
  );
};
