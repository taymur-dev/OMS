import { Title } from "../Title";
import {
  FaUser,
  FaPhoneAlt,
  FaCalendarAlt,
  FaBriefcase,
  FaCheckCircle,
} from "react-icons/fa";

export interface Applicant {
  id: number;
  applicant_name: string;
  fatherName?: string;
  email?: string;
  applicant_contact: string;
  applied_date: string;
  job: string;
  status: "pending" | "approved" | "rejected";
}

type ViewApplicantProps = {
  setModal: () => void;
  applicant: Applicant | null;
};

export const ViewApplicant = ({ setModal, applicant }: ViewApplicantProps) => {
  if (!applicant) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setModal}>VIEW APPLICANT</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Basic Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Applicant Name
                </label>
                <p className="text-gray-800 font-medium">
                  {applicant.applicant_name}
                </p>
              </div>

               <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Father Name
                </label>
                <p className="text-gray-800 font-medium">
                  {applicant.fatherName}
                </p>
              </div>

               <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Email
                </label>
                <p className="text-gray-800 font-medium">
                  {applicant.email}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaPhoneAlt className="text-gray-400" /> Contact Number
                </label>
                <p className="text-gray-800 font-medium">
                  {applicant.applicant_contact}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Application Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Application Details
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaBriefcase className="text-gray-400" /> Applied Position
                </label>
                <p className="text-gray-800 font-medium">{applicant.job}</p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-gray-400" /> Applied Date
                </label>
                <p className="text-gray-800 font-medium">
                  {applicant.applied_date?.slice(0, 10)}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Status */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Current Status
            </h3>
            <div className="pt-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase mb-1">
                <FaCheckCircle className="text-gray-400" /> Application Status
              </label>
              <span
                className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                  ${
                    applicant.status === "pending" &&
                    "bg-orange-100 text-orange-600 border border-orange-200"
                  }
                  ${
                    applicant.status === "approved" &&
                    "bg-green-100 text-green-600 border border-green-200"
                  }
                  ${
                    applicant.status === "rejected" &&
                    "bg-red-100 text-red-600 border border-red-200"
                  }`}
              >
                {applicant.status}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-indigo-900 p-3 flex justify-end">
          <button
            onClick={setModal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-1 px-8 rounded shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};