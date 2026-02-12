import { Title } from "../Title";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaBuilding,
} from "react-icons/fa";

type CustomerDetailT = {
  id: number;
  customerStatus: string;
  customerName: string;
  customerAddress: string;
  customerContact: string;
  companyName: string;
  companyAddress: string;
};

type CustomerDetailProps = {
  customerDetail: CustomerDetailT | null;
  setIsOpenModal: () => void;
};

export const CustomerViewModal = ({
  customerDetail,
  setIsOpenModal,
}: CustomerDetailProps) => {
  if (!customerDetail) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>CUSTOMER DETAILS</Title>
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
                  <FaUser className="text-gray-400" /> Customer Name
                </label>
                <p className="text-gray-800 font-medium">
                  {customerDetail.customerName}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Contact & Location
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaPhoneAlt className="text-gray-400" /> Contact Number
                </label>
                <p className="text-gray-800 font-medium">
                  {customerDetail.customerContact}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaMapMarkerAlt className="text-gray-400" /> Personal Address
                </label>
                <p className="text-gray-800 font-medium break-words">
                  {customerDetail.customerAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Company Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Company Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaBuilding className="text-gray-400" /> Company Name
                </label>
                <p className="text-gray-800 font-medium">
                  {customerDetail.companyName}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaMapMarkerAlt className="text-gray-400" /> Company Address
                </label>
                <p className="text-gray-800 font-medium break-words">
                  {customerDetail.companyAddress}
                </p>
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
