import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BiArrowFromTop } from "react-icons/bi";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type Project = {
  id: number;
  projectName: string;
  projectCategory: string;
  description: string;
  startDate: string;
  endDate: string;
  projectStatus: "Y" | "N";
};

export const WorkingProject = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [allWorkingProject, setAllWorkingProject] = useState<Project[] | null>(
    null
  );
  const [catchId, setCatchId] = useState<number | null>(null);

  const getAllWorkingProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getWorkingProjects`, {
        headers: {
          Authorization: token,
        },
      });
      setAllWorkingProject(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleMoveToCompletion = async (id: number) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/admin/handleDashboardProjects/${id}`
      );
      console.log(res.data);
      getAllWorkingProjects();
      toast.success("Project moved to the Completion process successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllWorkingProjects();
  }, [getAllWorkingProjects]);
  return (
    <div className="w-full max-w-2xl h-96 bg-white mt-4 rounded-lg shadow-lg overflow-y-auto p-4 mx-auto relative">
      {/* Title (Fixed) */}
      <h1 className="text-center text-lg font-semibold bg-orange-400 text-white p-3 rounded-md  sticky top-0 z-10">
        Working Project
      </h1>

      {/* Project List Items */}
      <div className="space-y-3 mt-4">
        {allWorkingProject?.map((project) => {
          const isActive = catchId === project.id;

          return (
            <div
              key={project.id}
              className="shadow-md py-3 px-5 bg-gray-100 rounded-md hover:bg-gray-200 transition-all duration-300 cursor-pointer"
              onClick={() =>
                setCatchId((prev) => (prev === project.id ? null : project.id))
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-medium">
                  {project.projectName}
                </span>
                <BiArrowFromTop className="text-gray-700 hover:text-indigo-500 transition-all duration-300" />
              </div>

              {/* Smooth appearing button with transition */}
              <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${
                  isActive ? "max-h-20 opacity-100 mt-3" : "max-h-0 opacity-0"
                }`}
              >
                <div className="text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent parent click
                      handleMoveToCompletion(project.id); // call your action
                    }}
                    className="bg-orange-400 text-white px-4 py-1 rounded-md text-sm hover:bg-orange-500 transition-all duration-300"
                  >
                    Move to Complete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
