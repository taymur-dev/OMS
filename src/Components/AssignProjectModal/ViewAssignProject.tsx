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
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          <Title setModal={setIsOpenModal}>Project Detail</Title>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Employee Name:
              </span>
              <p className="text-gray-600">{viewProject?.name}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Project Name:
              </span>
              <p className="text-gray-600">{viewProject?.projectName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
