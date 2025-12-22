import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
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

type TPROJECT = "ADDPROJECT" | "EDITPROJECT" | "VIEWPROJECT" | "DELETEPROJECT" | "";

type AllProjectT = {
  id: number;
  projectName: string;
  projectCategory: string;
  description: string;
  startDate: string;
  endDate: string;
};

export const ProjectsDetails = () => {
  const { loader } = useAppSelector((state) => state?.NavigateSate);
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
        headers: { Authorization: token },
      });
      const sortedProjects = res.data.sort(
        (a: AllProjectT, b: AllProjectT) => a.id - b.id
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
        { headers: { Authorization: token } }
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
          project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.projectCategory.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [allProjects, searchTerm]
  );

  const paginatedProjects = useMemo(
    () =>
      filteredProjects.slice(
        (pageNo - 1) * entriesPerPage,
        pageNo * entriesPerPage
      ),
    [filteredProjects, pageNo, entriesPerPage]
  );

  useEffect(() => {
    handleGetAllProjects();
  }, [handleGetAllProjects]);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Projects" activeFile="All Projects list" />

      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white overflow-hidden flex flex-col">
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total Projects:{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              {filteredProjects.length}
            </span>
          </span>
          <CustomButton
            label="Add Project"
            handleToggle={() => setIsOpenModal("ADDPROJECT")}
          />
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setPageNo(1);
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
          <TableInputField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
          <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr] bg-gray-200 text-gray-900 font-semibold border border-gray-600 text-sm sticky top-0 z-10 p-[10px]">
            <span>Sr#</span>
            <span>Project</span>
            <span>Project Category</span>
            <span className="text-center w-40">Actions</span>
          </div>

          {paginatedProjects?.map((project, index) => (
            <div
              key={project.id}
              className="grid grid-cols-[0.5fr_1fr_1fr_1fr] border border-gray-600 text-gray-800 hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[7px]"
            >
              <span className="px-2">{(pageNo - 1) * entriesPerPage + index + 1}</span>
              <span>{project.projectName}</span>
              <span>{project.projectCategory}</span>
              <span className="flex items-center gap-2">
                <EditButton handleUpdate={() => handleClickEditButton(project)} />
                <ViewButton handleView={() => handleClickViewButton(project)} />
                <DeleteButton handleDelete={() => handleClickDeleteButton(project.id)} />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <ShowDataNumber
          start={(pageNo - 1) * entriesPerPage + 1}
          end={Math.min(pageNo * entriesPerPage, filteredProjects.length)}
          total={filteredProjects.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((prev) => (prev > 1 ? prev - 1 : 1))}
          handleIncrementPageButton={() => setPageNo((prev) => prev + 1)}
        />
      </div>

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
          onUpdate={(updatedProject) => {
            setAllProjects((prev) =>
              prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
            );
          }}
        />
      )}

      {isOpenModal === "DELETEPROJECT" && (
        <ConfirmationModal
          isOpen={() => setIsOpenModal("DELETEPROJECT")}
          onClose={() => setIsOpenModal("")}
          message="Are you sure you want to delete this project"
          onConfirm={handleDeleteProject}
        />
      )}

      {isOpenModal === "VIEWPROJECT" && viewProject && (
        <ViewProject setIsOpenModal={() => setIsOpenModal("")} viewProject={viewProject} />
      )}
    </div>
  );
};
