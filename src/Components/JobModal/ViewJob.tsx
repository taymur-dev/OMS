import { Title } from "../Title";

type JobDetailT = {
  job_title: string;
  description: string;
  date?: string;
};

type ViewJobProps = {
  setIsOpenModal: () => void;
  viewJob: JobDetailT | null;
};

export const ViewJob = ({ setIsOpenModal, viewJob }: ViewJobProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          <Title setModal={setIsOpenModal}>Job Detail</Title>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Job Title:
              </span>
              <p className="text-gray-600">{viewJob?.job_title}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Description:
              </span>
              <p className="text-gray-600">{viewJob?.description}</p>
            </div>

            {viewJob?.date && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Date:
                </span>
                <p className="text-gray-600">{viewJob.date.slice(0, 10)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
