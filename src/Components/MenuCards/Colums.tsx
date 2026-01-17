import { BiArrowFromTop } from "react-icons/bi";

type columT = { id: string; title: string };
type projectT = { id: string | number; projectName: string; completionStatus: string };
type columDataT = { colum: columT; allProject: projectT[] | undefined };

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

const ProjectCard = ({ project }: { project: projectT }) => {
  return (
    <div
      className="
        bg-white rounded-lg shadow-md px-4 py-3 border border-white
        hover:shadow-xl hover:border-indigo-900 hover:scale-105
        transition-transform transition-shadow transition-colors duration-300
        cursor-pointer
      "
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-800 font-semibold">{project.projectName}</span>
        <BiArrowFromTop className="text-xl text-gray-400" />
      </div>
    </div>
  );
};

export const Columns = ({ colum, allProject }: columDataT) => {
  return (
    <div
      className={`w-full max-w-md h-96 mt-1 mx-1 rounded-xl overflow-y-auto p-4
      relative transition-all border-2 bg-white gap-6 shadow-sm
      ${columnBorderColor()}`}
    >
      <h1
        className={`text-center text-lg font-semibold text-white p-3
        rounded-lg sticky top-0 z-10 shadow ${columnHeaderBg(colum.id)}`}
      >
        {colum.title}
      </h1>

      <div className="space-y-3 mt-4">
        {allProject?.length ? (
          allProject.map((project) => <ProjectCard key={project.id} project={project} />)
        ) : (
          <p className="text-gray-400 text-center py-6">No projects yet</p>
        )}
      </div>
    </div>
  );
};
