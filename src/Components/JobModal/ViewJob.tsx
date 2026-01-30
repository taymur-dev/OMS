import { Title } from "../Title";
import { 
  FaBriefcase, 
  FaAlignLeft, 
  FaCalendarAlt, 
  FaInfoCircle 
} from "react-icons/fa";

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
  if (!viewJob) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header Section */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>VIEW JOB DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Job Header Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Position Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaBriefcase className="text-gray-400" /> Job Title
                </label>
                <p className="text-gray-800 font-medium">
                  {viewJob.job_title}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-gray-400" /> Posted Date
                </label>
                <p className="text-gray-800 font-medium">
                  {viewJob.date ? viewJob.date.slice(0, 10) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Description */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Job Description
            </h3>
            <div className="pt-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase mb-1">
                <FaAlignLeft className="text-gray-400" /> Details
              </label>
              <p className="text-gray-800 font-medium leading-relaxed">
                {viewJob.description}
              </p>
            </div>
          </div>

          {/* Section 3: Optional/Meta Info (Placeholder for symmetry) */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Status
            </h3>
            <div className="grid grid-cols-1 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaInfoCircle className="text-gray-400" /> Job Status
                </label>
                <p className="text-green-600 font-bold">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-indigo-900 p-3 flex justify-end">
          <button
            onClick={setIsOpenModal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-1 px-8 rounded shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};