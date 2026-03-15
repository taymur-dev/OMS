import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

interface ConfirmationModalProps {
  isOpen: () => void;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete? This action cannot be undone.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
        {/* Header - blue-400 */}
        <div className="flex items-center justify-between px-6 py-4 bg-white rounded-xl border-t-5 border-blue-400">
          <h2 className="text-lg font-semibold text-black tracking-wide">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md  text-black transition-colors"
          >
            <RxCross2 size={25} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-13">
              <FaExclamationTriangle size={40} className="text-red-600" />
            </div>
            <p className="text-black text-sm leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Footer - blue-400 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-500 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-500
             transform active:scale-95 transition-all shadow-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
