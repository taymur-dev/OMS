import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";

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
  message = "Are you sure you want to delete this user",
}) => {
  if (!isOpen) return null;

  const handleComfirm = () => {
    onClose();
    onConfirm();
  };
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-4 border border-indigo-900 w-96">
        {/* Title */}
        <div className="flex justify-between items-center text-gray-900">
          <h2 className="text-xl font-semibold ">{title}</h2>

          <RxCross1
            className="cursor-pointer"
            size={22}
            onClick={onClose}
            title="close"
          />
        </div>
        <div className="border-b border-gray-300 mt-2"></div>

        <div className="flex items-center justify-center py-2">
          <FaExclamationCircle size={25} className="text-gray-400" />
        </div>

        {/* Message */}
        <p className="text-gray-800 text-center font-semibold ">{message}</p>

        {/* Buttons */}
        <div className="flex justify-center mt-5 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-800 bg-gray-200 hover:scale-105 duration-300 hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleComfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:scale-105 duration-300 hover:cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
