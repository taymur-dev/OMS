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
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-indigo-900">
        {/* Header - Indigo-900 */}
        <div className="flex items-center justify-between px-6 py-4 bg-indigo-900">
          <h2 className="text-lg font-semibold text-white tracking-wide">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-indigo-200 hover:bg-indigo-800 hover:text-white transition-colors"
          >
            <RxCross2 size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
              <FaExclamationTriangle size={28} className="text-red-600" />
            </div>
            <p className="text-black text-sm leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Footer - Indigo-900 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-indigo-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-indigo-900 bg-white rounded-lg transition-colors"
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
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};
