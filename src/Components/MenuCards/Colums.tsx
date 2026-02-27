import {
  BiRocket,
  BiGlobe,
  BiPlus,
  BiLoaderCircle,
  BiCheckCircle,
  BiCog,
  BiCheckDouble,
} from "react-icons/bi";
import { Droppable, Draggable } from "@hello-pangea/dnd";

// Updated Type to include the fields from your ProjectsDetails data
type projectT = {
  id: string;
  projectName: string;
  completionStatus: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  subText?: string;
};

type columT = { id: string; title: string };
type columDataT = { colum: columT; allProject: projectT[] | undefined };

const columnBgStyles = (id: string) => {
  switch (id) {
    case "New":
      return "bg-blue-50";
    case "Working":
      return "bg-blue-100";
    case "Complete":
      return "bg-blue-200";
    default:
      return "bg-slate-50";
  }
};

const columnHeaderBadge = (id: string) => {
  switch (id) {
    case "New":
      return "bg-blue-50 text-[#000000]";
    case "Working":
      return "bg-blue-100 text-[#000000]";
    case "Complete":
      return "bg-blue-200 text-[#000000]";
    default:
      return "bg-gray-200 text-gray-600";
  }
};

const ProjectIcon = ({ name, status }: { name: string; status: string }) => {
  const iconClass = "text-base md:text-lg"; // Smaller base size
  if (name.includes("Global")) {
    return <BiGlobe className={`${iconClass} text-green-600`} />;
  }
  switch (status) {
    case "Working":
      return <BiCog className={`${iconClass} text-blue-600`} />;
    case "Complete":
      return <BiCheckDouble className={`${iconClass} text-blue-600`} />;
    default:
      return <BiRocket className={`${iconClass} text-blue-500`} />;
  }
};

const StatusActionIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "New":
      return <BiPlus className="text-blue-400 text-lg md:text-xl" />;
    case "Working":
      return (
        <BiLoaderCircle className="text-blue-400 text-lg md:text-xl animate-spin-slow" />
      );
    case "Complete":
      return <BiCheckCircle className="text-blue-400 text-lg md:text-xl" />;
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
  // Helper to format dates consistently
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  };

  // Truncate description for medium screens
  const truncateDescription = (text?: string, maxLength = 20) => {
    if (!text) return "In Progress...";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Draggable draggableId={String(project.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white rounded-xl md:rounded-2xl p-2 md:p-3 mb-2 md:mb-3 border border-transparent
            ${snapshot.isDragging ? "shadow-2xl ring-2 ring-blue-100" : "shadow-sm"}
            transition-all duration-200 flex items-center justify-between
          `}
        >
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <div
              className={`p-1.5 md:p-2 rounded-lg md:rounded-xl shrink-0 ${columnBgStyles(project.completionStatus)}`}
            >
              <ProjectIcon
                name={project.projectName}
                status={project.completionStatus}
              />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-slate-800 font-bold text-xs md:text-sm truncate max-w-[120px] md:max-w-[180px]">
                {project.projectName}
              </span>

              {/* CONDITIONAL CONTENT BASED ON COLUMN */}
              <div className="flex items-center gap-1 mt-0.5 text-[10px] md:text-[11px] text-slate-500">
                {project.completionStatus === "New" && (
                  <>
                    <span className="truncate max-w-[80px] md:max-w-[120px]">
                      {formatDate(project.startDate)}
                    </span>
                  </>
                )}

                {project.completionStatus === "Working" && (
                  <>
                    <span className="italic truncate max-w-[80px] md:max-w-[120px]">
                      {truncateDescription(project.description, 15)}
                    </span>
                  </>
                )}

                {project.completionStatus === "Complete" && (
                  <>
                    <span className="truncate max-w-[80px] md:max-w-[120px]">
                      {formatDate(project.endDate)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="shrink-0 ml-1">
            <StatusActionIcon status={project.completionStatus} />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export const Columns = ({ colum, allProject }: columDataT) => {
  return (
    <div
      className={`
        w-full flex flex-col shadow-sm border border-gray-100 
        rounded-2xl md:rounded-[32px] p-3 md:p-6 
        h-[450px] md:h-[550px] 
        ${columnBgStyles(colum.id)}
      `}
    >
      <div className="flex items-center bg-white rounded-xl md:rounded-[16px] justify-between mb-3 md:mb-6 p-2 md:p-4 shadow-sm shrink-0">
        <h2 className="text-[10px] md:text-[12px] font-black uppercase tracking-[1px] md:tracking-[1.5px] text-slate-700 ml-1 md:ml-2 truncate">
          {colum.title}
        </h2>
        <span
          className={`px-2 md:px-3 py-0.5 rounded-full text-[10px] md:text-[12px] font-bold shrink-0 ml-2 ${columnHeaderBadge(colum.id)}`}
        >
          {allProject?.length || 0}
        </span>
      </div>

      <Droppable droppableId={colum.id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex-1 overflow-y-auto custom-scrollbar pr-1"
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