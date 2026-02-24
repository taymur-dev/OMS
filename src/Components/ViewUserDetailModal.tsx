import { Title } from "./Title";
import {
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";

export type ViewUserT = {
  id: number;
  name: string;
  email: string;
  contact: string;
  cnic: string;
  address: string;
  date: string;
  password: string;
  confirmPassword: string;
  role: string;
};

type ModalTProps = {
  setModal: () => void;
  viewUserDetail: ViewUserT;
};

export const ViewUserDetailModal = ({
  setModal,
  viewUserDetail,
}: ModalTProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4  flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-300">
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setModal}>VIEW USER</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Basic Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-blue-400" /> User Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewUserDetail.name}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaTag className="text-green-400" /> Role
                </label>
                <p className="text-gray-800 font-medium">
                  {viewUserDetail.role}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Contact Details
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaEnvelope className="text-yellow-400" /> Email Address
                </label>
                <p className="text-gray-800 font-medium">
                  {viewUserDetail.email}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaIdCard className="text-orange-400" /> CNIC / ID
                </label>
                <p className="text-gray-800 font-medium">
                  {viewUserDetail.cnic}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Additional Info */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Location & Date
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaMapMarkerAlt className="text-red-400" /> Address
                </label>
                <p className="text-gray-800 font-medium break-words">
                  {viewUserDetail.address || "N/A"}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-purple-400" /> Joined Date
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(viewUserDetail.date)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, "-")}
                </p>
              </div>
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
