import { Title } from "../Title";
import { FaUser, FaPhoneAlt, FaEnvelope, FaIdCard, FaUserShield } from "react-icons/fa";

type UserType = {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  cnic?: string;
};

type ViewSystemUserProps = {
  setIsOpenModal: () => void;
  viewUser: UserType | null;
};

export const ViewSystemUser = ({ setIsOpenModal, viewUser }: ViewSystemUserProps) => {
  if (!viewUser) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-white mx-auto rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-white border-t-5 border-blue-400">
          <Title setModal={setIsOpenModal} className="text-white">
            USER DETAILS
          </Title>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Personal Information */}
          <div className="border border-gray-200 rounded-md p-5 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              Personal Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Full Name
                </label>
                <p className="text-gray-800 font-medium">{viewUser.name}</p>
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaIdCard className="text-gray-400" /> CNIC Number
                </label>
                <p className="text-gray-800 font-medium">{viewUser.cnic || "N/A"}</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaPhoneAlt className="text-gray-400" /> Phone Number
                </label>
                <p className="text-gray-800 font-medium">{viewUser.phone || "N/A"}</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaEnvelope className="text-gray-400" /> Email Address
                </label>
                <p className="text-gray-800 font-medium">{viewUser.email}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Account Permissions */}
          <div className="border border-gray-200 rounded-md p-5 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-blue-500 uppercase tracking-wider">
              System Access
            </h3>
            <div className="pt-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                <FaUserShield className="text-gray-400" /> Assigned Role
              </label>
              <div className="mt-1">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">
                  {viewUser.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 flex justify-end border-t border-gray-100">
          <button
            onClick={setIsOpenModal}
            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-semibold py-2 px-10 rounded shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};