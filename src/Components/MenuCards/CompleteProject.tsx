import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BiArrowFromTop } from "react-icons/bi";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type Project = {
  id: number;
  projectName: string;
  projectCategory: string;
  description: string;
  startDate: string;
  endDate: string;
  projectStatus: "Y" | "N";
  completionStatus: string;
};

export const CompleteProject = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [allCompleteProjects, setAllCompleteProjects] = useState<
    Project[] | null
  >(null);

  const [catchId, setCatchId] = useState<number | null>(null);

  const handleGetAllCompleteProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getCompleteProjects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllCompleteProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  } , [token]);

  useEffect(() => {
    handleGetAllCompleteProjects();
  }, [handleGetAllCompleteProjects]);

  return (
    <div className="w-full max-w-2xl h-96 bg-white mt-4 rounded-lg shadow-lg overflow-y-auto p-4 mx-auto relative">
      {/* Title */}
      <h1 className="text-center text-lg font-semibold bg-white border-blue-500  text-black p-3 rounded-md f sticky z-10 top-0">
        Complete Project
      </h1>

      {/* Project List Items */}
      <div className="space-y-3 mt-4">
        {allCompleteProjects?.map((project) => {
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
                      // handleMoveToWorking(project.id); // call your action
                    }}
                    className="bg-green-500 text-white px-4 py-1 rounded-md text-sm hover:bg-green-600 transition-all duration-300"
                  >
                    Move to Working
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
