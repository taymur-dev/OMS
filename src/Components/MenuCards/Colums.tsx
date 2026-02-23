import {
  BiBriefcaseAlt2,
  BiFolderPlus,
  BiLoaderCircle,
  BiCheckCircle,
} from "react-icons/bi";
import { Droppable, Draggable } from "@hello-pangea/dnd";

type columT = { id: string; title: string };
type projectT = {
  id: string;
  projectName: string;
  completionStatus: string;
};
type columDataT = { colum: columT; allProject: projectT[] | undefined };

const columnHeaderStyles = (id: string) => {
  switch (id) {
    case "New":
      return "bg-blue-600 text-blue-50 border-blue-200";
    case "Working":
      return "bg-amber-500 text-amber-50 border-amber-200";
    case "Complete":
      return "bg-emerald-600 text-emerald-50 border-emerald-200";
    default:
      return "bg-slate-500 text-slate-50 border-slate-200";
  }
};

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "New":
      return <BiFolderPlus className="text-base text-blue-500" />;
    case "Working":
      return (
        <BiLoaderCircle className="text-base text-amber-500 animate-spin-slow" />
      );
    case "Complete":
      return <BiCheckCircle className="text-base text-emerald-500" />;
    default:
      return null;
  }
};

const ProjectCard = ({
  project,
  index,
}: {
  project: projectT;
  index: number;
}) => {
  return (
    <Draggable draggableId={String(project.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style }}
          className={`
            group bg-white rounded-lg shadow-sm px-3 py-2.5 border 
            ${snapshot.isDragging ? "border-indigo-500 shadow-xl" : "border-indigo-900"}
            hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing
          `}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-slate-50 rounded-md">
                <BiBriefcaseAlt2 className="text-slate-400 group-hover:text-indigo-600 text-sm" />
              </div>
              <span className="text-slate-700 font-medium text-xs leading-tight">
                {project.projectName}
              </span>
            </div>
            {/* Replaced BiArrowFromTop with dynamic StatusIcon */}
            <StatusIcon status={project.completionStatus} />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export const Columns = ({ colum, allProject }: columDataT) => {
  return (
    <div className="w-full h-full min-h-[400px] rounded-lg border border-indigo-900 flex flex-col overflow-y bg-gray-100/50">
      <div
        className={`p-3 flex items-center justify-between border-b ${columnHeaderStyles(colum.id)}`}
      >
        <h2 className="text-[11px] font-bold uppercase tracking-wider">
          {colum.title}
        </h2>
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[12px] font-bold">
          {allProject?.length || 0}
        </span>
      </div>

      <Droppable droppableId={colum.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`
        flex-1 p-2 space-y-2
        overflow-y-auto
        max-h-[350px]   /* adjust if needed */
        transition-colors duration-200
        ${snapshot.isDraggingOver ? "bg-indigo-50/50" : ""}
      `}
          >
            {allProject?.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
