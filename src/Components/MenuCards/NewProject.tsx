import axios from "axios";
import { useState } from "react";
import { BiArrowFromTop } from "react-icons/bi";
import { BASE_URL } from "../../Content/URL";
import { toast } from "react-toastify";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";

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

type NewProjectProps = {
  allProjects: Project[];
  handlegetNewProjects: () => void;
};

export const NewProject = ({
  allProjects,
  handlegetNewProjects,
}: NewProjectProps) => {
  const [catchId, setCatchId] = useState<number | null>(null);

  console.log("All new project =>", allProjects);

  const handleMoveToWorking = async (projectId: number) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/getNewProjects/${projectId}`
      );
      console.log(res.data);
      toast.success("Project moved to Working process successfully");
      handlegetNewProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    console.log("task Id", taskId);
    console.log("new Status ", newStatus);
  };
  return (
    <div className="w-full h-96 bg-white mt-4 rounded-lg shadow-lg overflow-y-auto p-4 relative">
      {/* Title */}
      <h1 className="text-center text-lg font-semibold bg-white border-blue-500  text-black p-3 rounded-md sticky z-10 top-0">
        New Project
      </h1>

      {/* Project List Items */}
      <div className="space-y-3 mt-4">
        <DndContext onDragEnd={handleDragEnd}>
          {allProjects.map((project) => {
            const isActive = catchId === project.id;

            return (
              <div
                key={project.id}
                className="shadow-md py-3 px-5 bg-gray-100 rounded-md hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                onClick={() =>
                  setCatchId((prev) =>
                    prev === project.id ? null : project.id
                  )
                }
              >
                <DndContext onDragEnd={handleDragEnd}>
                  <div className="flex items-center justify-between ">
                    <span className="text-gray-800 font-medium">
                      {project.projectName}
                    </span>
                    <BiArrowFromTop className="text-gray-700 hover:text-indigo-500 transition-all duration-300" />
                  </div>
                </DndContext>

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
                        handleMoveToWorking(project.id); // call your action
                      }}
                      className="bg-indigo-500 text-white px-4 py-1 rounded-md text-sm hover:bg-indigo-600 transition-all duration-300"
                    >
                      Move to Working
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </DndContext>
      </div>
    </div>
  );
};
