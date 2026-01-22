import { BiArrowFromTop, BiBriefcaseAlt2 } from "react-icons/bi";

type columT = { id: string; title: string };
type projectT = {
  id: string | number;
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

const ProjectCard = ({ project }: { project: projectT }) => {
  return (
    <div
      className="
        group bg-white rounded-lg shadow-sm 
        px-3 py-2.5 border-1 border-indigo-900 
        hover:shadow-md hover:border-white hover:-translate-y-0.5
        transition-all duration-300 ease-in-out cursor-pointer
      "
    >
      {/* Updated: 
          - default: border-indigo-900
          - hover: hover:border-white 
      */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-50 rounded-md group-hover:bg-indigo-50 transition-colors">
            <BiBriefcaseAlt2 className="text-slate-400 group-hover:text-indigo-600 text-sm" />
          </div>
          <span className="text-slate-700 font-medium text-xs leading-tight">
            {project.projectName}
          </span>
        </div>
        <BiArrowFromTop className="text-base text-slate-300 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
      </div>
    </div>
  );
};

export const Columns = ({ colum, allProject }: columDataT) => {
  return (
    <div
      className="w-full h-full min-h-[400px] rounded-lg border-1 border-indigo-900 hover:border-white
                 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      {/* Header - Reduced padding to p-3 */}
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

      {/* Project List - Reduced padding to p-2 and gap to space-y-2 */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        <div className="space-y-1">
          {allProject?.length ? (
            allProject.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6 opacity-40">
              <div className="w-8 h-8 border-2 border-indigo-900  rounded-full mb-2" />
              <p className="text-slate-500 text-[10px] font-medium italic">
                Empty
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
