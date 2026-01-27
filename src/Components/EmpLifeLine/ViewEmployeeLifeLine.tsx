import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaBriefcase,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";

import { Title } from "../Title";
import { DeleteButton } from "../CustomButtons/DeleteButton";
import { EditButton } from "../CustomButtons/EditButton";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import profilePicture from "../../assets/vector.png";

type LifeLine = {
  id: number;
  employeeName: string;
  email: string;
  contact: string;
  position: string;
  date: string;
};

type ViewEmployeeLifeLineProps = {
  setIsOpenModal: () => void;
  employeeData: LifeLine;
  handleEdit: (data: LifeLine) => void;
  handleDelete: (id: number) => void;
};

export const ViewEmployeeLifeLine = ({
  setIsOpenModal,
  employeeData,
  handleEdit,
  handleDelete,
}: ViewEmployeeLifeLineProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<LifeLine>(employeeData);

  const token = useAppSelector((state) => state.officeState.currentUser?.token);

  useEffect(() => {
    setEditData(employeeData);
  }, [employeeData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/admin/updateEmpll/${editData.id}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      handleEdit(editData);
      setIsEditing(false);
      toast.success("Employee updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update employee.");
    }
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      `Delete ${employeeData.employeeName}?`,
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${BASE_URL}/api/admin/deleteEmpll/${employeeData.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      handleDelete(employeeData.id);
      setIsOpenModal();
      toast.success("Employee deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete employee.");
    }
  };

  const inputStyle =
    "w-full border-b border-indigo-200 focus:border-indigo-500 outline-none text-gray-800 font-medium bg-transparent py-1";

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-300">
        <Toaster position="top-center" />

        {/* Header */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>VIEW EMPLOYEE LIFELINE</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Profile & Identity */}
          <div className="border border-gray-200 rounded-md p-4 relative flex flex-col sm:flex-row gap-6 items-center">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Profile Information
            </h3>

            <img
              className="w-20 h-20 rounded-full border-4 border-indigo-900 object-cover"
              src={profilePicture}
              alt="Profile"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Employee Name
                </label>
                {isEditing ? (
                  <input
                    name="employeeName"
                    value={editData.employeeName}
                    onChange={handleInputChange}
                    className={inputStyle}
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {employeeData.employeeName}
                  </p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaEnvelope className="text-gray-400" /> Email Address
                </label>
                {isEditing ? (
                  <input
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    className={inputStyle}
                  />
                ) : (
                  <p className="text-gray-800 font-medium break-all">
                    {employeeData.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Employment Details */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Employment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaBriefcase className="text-gray-400" /> Position
                </label>
                {isEditing ? (
                  <input
                    name="position"
                    value={editData.position}
                    onChange={handleInputChange}
                    className={inputStyle}
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {employeeData.position}
                  </p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaPhone className="text-gray-400" /> Contact
                </label>
                {isEditing ? (
                  <input
                    name="contact"
                    value={editData.contact}
                    onChange={handleInputChange}
                    className={inputStyle}
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {employeeData.contact}
                  </p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-gray-400" /> Date Joined
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(employeeData.date)
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

          {/* Section 3: Actions */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Management Actions
            </h3>
            <div className="flex gap-3 pt-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-6 rounded shadow-sm transition-colors uppercase"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold py-2 px-6 rounded shadow-sm transition-colors uppercase"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <EditButton handleUpdate={() => setIsEditing(true)} />
                  <DeleteButton handleDelete={handleDeleteClick} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
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
