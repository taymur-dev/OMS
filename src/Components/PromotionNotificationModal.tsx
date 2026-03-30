// PromotionNotificationModal.tsx
import { createPortal } from "react-dom";

interface PromotionNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: number;
    employee_name: string;
    current_designation: string;
    requested_designation: string;
    approval: string;
    note: string;
    date: string;
  } | null;
}

export const PromotionNotificationModal = ({
  isOpen,
  onClose,
  data,
}: PromotionNotificationProps) => {
  if (!isOpen || !data) return null;

  const formatDate = (date: string) =>
    new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");

  const getStatusStyle = () => {
    switch (data.approval) {
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-orange-100 text-orange-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const modalJSX = (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] px-3 pointer-events-none">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden pointer-events-auto">
          {/* Header */}
          <div className="bg-white rounded-t-xl border-t-4 border-purple-500 flex justify-between items-center px-5 py-4 shadow-sm">
            <p className="text-gray-800 text-base font-bold tracking-tight">
              Promotion Details
            </p>
            <button
              onClick={onClose}
              className="group p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close"
            >
              <span className="text-gray-500 group-hover:text-gray-700 text-2xl leading-none">
                &times;
              </span>
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 text-sm">
            <div>
              <span className="text-gray-500 block text-xs mb-0.5">
                Employee:
              </span>
              <p className="font-semibold text-gray-800">{data.employee_name}</p>
            </div>

            <div className="flex justify-between border-y border-gray-50 py-3">
              <div>
                <span className="text-gray-500 block text-xs mb-0.5">
                  Current Position:
                </span>
                <p className="font-medium text-gray-800">
                  {data.current_designation}
                </p>
              </div>

              <div className="text-right">
                <span className="text-gray-500 block text-xs mb-0.5">
                  Requested Position:
                </span>
                <p className="font-medium text-gray-800">
                  {data.requested_designation}
                </p>
              </div>
            </div>

            <div>
              <span className="text-gray-500 block text-xs mb-0.5">Date:</span>
              <p className="font-medium text-gray-800">
                {formatDate(data.date)}
              </p>
            </div>

            {data.note && (
              <div>
                <span className="text-gray-500 block text-xs mb-0.5">Note:</span>
                <p className="font-medium text-gray-800 leading-relaxed">
                  {data.note}
                </p>
              </div>
            )}

            <div>
              <span className="text-gray-500 block text-xs mb-1">Status:</span>
              <span
                className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${getStatusStyle()}`}
              >
                {data.approval}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 text-right">
            <button
              onClick={onClose}
              className="px-6 py-2 text-xs font-bold border border-gray-300 text-black rounded-lg transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalJSX, document.body);
};