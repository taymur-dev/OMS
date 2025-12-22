import { useDroppable, useDraggable } from "@dnd-kit/core";
import { BiArrowFromTop } from "react-icons/bi";

type columT = {
  id: string;
  title: string;
};

type projectT = {
  id: string;
  projectName: string;
  status: string;
};

type columDataT = {
  colum: columT;
  allProject: projectT[] | undefined;
};

const DraggableProjectCard = ({ project }: { project: projectT }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: project.id,
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    boxShadow: isDragging ? "0 10px 20px rgba(0,0,0,0.2)" : undefined,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-white rounded-lg shadow-md hover:shadow-xl cursor-grab px-4 py-3 transition-all duration-200 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-800 font-semibold">
          {project.projectName}
        </span>
        <BiArrowFromTop className="text-xl text-gray-400 hover:text-indigo-500 transition-colors" />
      </div>
    </div>
  );
};

// 👇 Droppable column component
export const Columns = ({ colum, allProject }: columDataT) => {
  const { setNodeRef, isOver } = useDroppable({
    id: colum.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-full max-w-md h-96 mt-4 rounded-lg overflow-y-auto p-4 relative transition-all ${
        isOver
          ? "bg-gray-50 border-2 border-dashed border-indigo-400"
          : "bg-gray-100"
      }`}
    >
      <h1
        className={`text-center text-lg font-semibold text-white p-3 rounded-md sticky top-0 z-10 shadow ${
          (colum.id === "newProject" &&
            "bg-gradient-to-r from-indigo-500 to-indigo-400") ||
          (colum.id === "working" &&
            "bg-gradient-to-r from-orange-400 to-orange-300") ||
          (colum.id === "complete" &&
            "bg-gradient-to-r from-green-500 to-green-400")
        }`}
      >
        {colum.title}
      </h1>

      <div className="space-y-3 mt-4">
        {allProject?.length ? (
          allProject.map((project) => (
            <DraggableProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p className="text-gray-400 text-center py-4">No projects yet</p>
        )}
      </div>
    </div>
  );
};
