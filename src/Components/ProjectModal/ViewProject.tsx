import { Title } from "../Title";

type AllProjectT = {
  id: number;
  projectName: string;
  projectCategory: string;
  description: string;
  startDate: string;
  endDate: string;
};

type CustomerDetailProps = {
  setIsOpenModal: () => void;
  viewProject: AllProjectT | null;
};
export const ViewProject = ({
  setIsOpenModal,
  viewProject,
}: CustomerDetailProps) => {
  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          {/* Title */}
          <div className="bg-blue-600 rounded">
            <Title
              setModal={setIsOpenModal}
              className="text-white text-lg font-semibold"
            >
              Project Details
            </Title>
          </div>

          {/* User Details List */}
          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Project Name:
              </span>
              <p className="text-gray-600">{viewProject?.projectName}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Project Category:
              </span>
              <p className="text-gray-600">{viewProject?.projectCategory}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Project Description:
              </span>
              <p className="text-gray-600">{viewProject?.description}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Start Date:
              </span>
              <p className="text-gray-600">
                {viewProject?.startDate.slice(0, 10)}
              </p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                End Date:
              </span>
              <p className="text-gray-600">
                {viewProject?.endDate.slice(0, 10)}
              </p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Status:
              </span>
              <p className="text-gray-600">{"Current"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
