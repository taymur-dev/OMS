import { Title } from "../Title";
import {
  FaUser,
  FaBriefcase,
  FaArrowAltCircleUp,
  FaStickyNote,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

type PromotionType = {
  employee_name: string;
  current_designation: string;
  requested_designation: string;
  note: string;
  date: string;
  approval: string;
};

type ViewPromotionModalProps = {
  setModal: () => void;
  promotionData: PromotionType;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? "N/A"
    : date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
};

export const ViewPromotion = ({
  setModal,
  promotionData,
}: ViewPromotionModalProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-300">
        {/* Header Section */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setModal}>VIEW PROMOTION DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Employee Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Employee Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Employee Name
                </label>
                <p className="text-gray-800 font-medium">
                  {promotionData.employee_name || "N/A"}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCheckCircle className="text-gray-400" /> Approval Status
                </label>
                <p
                  className={`font-bold ${promotionData.approval?.toLowerCase() === "accepted" ? "text-green-600" : "text-orange-500"}`}
                >
                  {promotionData.approval || "Pending"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Designation Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Promotion Details
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaBriefcase className="text-gray-400" /> Current Designation
                </label>
                <p className="text-gray-800 font-medium">
                  {promotionData.current_designation || "N/A"}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaArrowAltCircleUp className="text-gray-400" /> Requested
                  Designation
                </label>
                <p className="text-indigo-700 font-bold">
                  {promotionData.requested_designation || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Additional Notes & Date */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Timeline & Remarks
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div className="col-span-1">
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-gray-400" /> Effective Date
                </label>
                <p className="text-gray-800 font-medium">
                  {formatDate(promotionData.date)}
                </p>
              </div>
              <div className="col-span-1">
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaStickyNote className="text-gray-400" /> Admin Note
                </label>
                <p className="text-gray-700 text-sm italic">
                  {promotionData.note || "No additional notes provided."}
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
