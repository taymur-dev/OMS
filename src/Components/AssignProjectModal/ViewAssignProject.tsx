import { Title } from "../Title";
import { ALLASSIGNPROJECTT } from "../../Pages/AdminPage/AssignProjects";

type ViewAssignProjectProps = {
  setIsOpenModal: () => void;
  viewProject: ALLASSIGNPROJECTT | null;
};

export const ViewAssignProject = ({
  setIsOpenModal,
  viewProject,
}: ViewAssignProjectProps) => {
  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
      <div className="w-full max-w-3xl mx-4">
        <div className="bg-white rounded shadow-xl overflow-hidden border border-indigo-900">
          {/* Header */}
          <div className="bg-indigo-900 px-6">
            <Title
              setModal={setIsOpenModal}
              className="text-white text-xl font-semibold"
            >
              Assign Project Details
            </Title>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-800 font-medium text-lg">
                Employee Name:
              </span>
              <p className="text-gray-600">{viewProject?.name || "-"}</p>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-800 font-medium text-lg">
                Project Name:
              </span>
              <p className="text-gray-600">{viewProject?.projectName || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
