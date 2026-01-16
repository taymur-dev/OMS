import { useDroppable, useDraggable } from "@dnd-kit/core";
import { BiArrowFromTop } from "react-icons/bi";

type columT = {
  id: string;
  title: string;
};

type projectT = {
  id: string | number;
  projectName: string;
  completionStatus: string;
};

type columDataT = {
  colum: columT;
  allProject: projectT[] | undefined;
};

const columnBorderColor = () => "border-indigo-900 hover:border-white";

const columnHeaderBg = (id: string) => {
  switch (id) {
    case "New":
      return "bg-blue-500";
    case "Working":
      return "bg-orange-500";
    case "Complete":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const DraggableProjectCard = ({ project }: { project: projectT }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: project.id.toString(),
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    boxShadow: isDragging ? "0 12px 25px rgba(0,0,0,0.25)" : undefined,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-white rounded-lg shadow-md hover:shadow-xl cursor-grab
      px-4 py-3 transition-all duration-200 border border-gray-200"
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

export const Columns = ({ colum, allProject }: columDataT) => {
  const { setNodeRef, isOver } = useDroppable({
    id: colum.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-full max-w-md h-96 mt-1 mx-1 rounded-xl overflow-y-auto p-4
      relative transition-all border-2 bg-white gap-6 shadow-sm
      ${columnBorderColor()}
      ${
        isOver
          ? "ring-2 ring-white ring-offset-2 scale-[1.01]"
          : "hover:shadow-md"
      }`}
    >
      <h1
        className={`text-center text-lg font-semibold text-white p-3
        rounded-lg sticky top-0 z-10 shadow ${columnHeaderBg(colum.id)}`}
      >
        {colum.title}
      </h1>

      <div className="space-y-3 mt-4">
        {allProject?.length ? (
          allProject.map((project) => (
            <DraggableProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p className="text-gray-400 text-center py-6">No projects yet</p>
        )}
      </div>
    </div>
  );
};
