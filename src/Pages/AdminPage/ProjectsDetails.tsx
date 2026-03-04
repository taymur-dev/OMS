import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
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
import { RiInboxArchiveLine } from "react-icons/ri";

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

interface ProjectsDetailsProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const ProjectsDetails = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: ProjectsDetailsProps) => {
  const { loader } = useAppSelector((state) => state?.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [allProjects, setAllProjects] = useState<AllProjectT[]>([]);
  const [viewProject, setViewProject] = useState<AllProjectT | null>(null);
  const [catchId, setCatchId] = useState<number>();
  const [selectProject, setSelectProject] = useState<AllProjectT | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<TPROJECT | "">("");
  const [pageNo, setPageNo] = useState(1);

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

  useEffect(() => {
    handleGetAllProjects();
  }, [handleGetAllProjects]);

  // Sync with parent trigger
  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("ADDPROJECT");
    }
  }, [triggerModal]);

  // Reset page when filters change
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

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

  const filteredProjects = useMemo(
    () =>
      allProjects.filter(
        (project) =>
          project.projectName
            .toLowerCase()
            .includes(externalSearch.toLowerCase()) ||
          project.projectCategory
            .toLowerCase()
            .includes(externalSearch.toLowerCase()),
      ),
    [allProjects, externalSearch],
  );

  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + externalPageSize,
  );

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm";
    switch (status?.toLowerCase()) {
      case "complete":
        return `${baseClasses} bg-green-100 text-green-600 border border-green-200`;
      case "new":
        return `${baseClasses} bg-blue-100 text-blue-600 border border-blue-200`;
      case "working":
        return `${baseClasses} bg-yellow-100 text-yellow-600 border border-yellow-200`;
      default:
        return `${baseClasses} bg-gray-400 text-white`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loader) return <Loader />;
  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          {/* 1. Header Section */}
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[60px_2fr_1.5fr_1.2fr_1.2fr_1fr_auto] bg-blue-400 text-white
             rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span className="text-left">Sr#</span>
              <span className="text-left">Project Name</span>
              <span className="text-left">Category</span>
              <span className="text-left">Start Date</span>
              <span className="text-left">End Date</span>
              <span className="text-center">Status</span>
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>

          {/* 2. Body Section */}
          <div className="px-0.5 py-2">
            {paginatedProjects.length === 0 ? (
              <div
                className="bg-gray-50 rounded-lg border-2 border p-12 flex flex-col items-center justify-center
               text-gray-400"
              >
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No projects found!</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="grid grid-cols-[60px_2fr_1.5fr_1.2fr_1.2fr_1fr_auto] items-center px-3 py-2 gap-3
                     text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    {/* Serial Number */}
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Project Name (Icon Removed) */}
                    <div className="flex flex-col min-w-0">
                      <span className="truncate  text-gray-600">
                        {project.projectName}
                      </span>
                    </div>

                    {/* Category (Icon Removed) */}
                    <div className="text-gray-600 truncate">
                      {project.projectCategory}
                    </div>

                    {/* Start Date (Icon Removed) */}
                    <div className="text-gray-600 truncate">
                      {formatDate(project.startDate)}
                    </div>

                    {/* End Date (Icon Removed) */}
                    <div className="text-gray-600 truncate">
                      {formatDate(project.endDate)}
                    </div>

                    {/* Status */}
                    <div className="flex justify-center">
                      <span
                        className={getStatusBadge(project.completionStatus)}
                      >
                        {project.completionStatus}
                      </span>
                    </div>

                    {/* Actions (Aligned to 140px width like Users) */}
                    <div className="flex items-center justify-end gap-1 w-[140px]">
                      <ViewButton
                        handleView={() => {
                          setViewProject(project);
                          setIsOpenModal("VIEWPROJECT");
                        }}
                      />
                      <EditButton
                        handleUpdate={() => {
                          setSelectProject(project);
                          setIsOpenModal("EDITPROJECT");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setCatchId(project.id);
                          setIsOpenModal("DELETEPROJECT");
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

      {/* 3. Pagination Section */}
      <div className="flex flex-row items-center justify-between p-1">
        <ShowDataNumber
          start={filteredProjects.length === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + externalPageSize, filteredProjects.length)}
          total={filteredProjects.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() =>
            setPageNo((prev) => Math.max(prev - 1, 1))
          }
          handleIncrementPageButton={() => {
            if (pageNo * externalPageSize < filteredProjects.length)
              setPageNo((prev) => prev + 1);
          }}
        />
      </div>

      {/* --- MODALS --- */}
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
          onUpdate={(updated) =>
            setAllProjects((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p)),
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
