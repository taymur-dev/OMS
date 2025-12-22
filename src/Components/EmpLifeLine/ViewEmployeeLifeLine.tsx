import { DeleteButton } from "../CustomButtons/DeleteButton";
import { EditButton } from "../CustomButtons/EditButton";
import { Title } from "../Title";
import profilePicture from "../../assets/vector.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";

import toast, { Toaster } from "react-hot-toast";

import { useAppSelector } from "../../redux/Hooks";

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
        { headers: { Authorization: token } }
      );

      handleEdit(editData);
      setIsEditing(false);
      toast.success("Employee updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update employee. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditData(employeeData);
    setIsEditing(false);
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${employeeData.employeeName}?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${BASE_URL}/api/admin/deleteEmpll/${employeeData.id}`,
        { headers: { Authorization: token } }
      );
      handleDelete(employeeData.id);
      setIsOpenModal();
      toast.success("Employee deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete employee. Please try again.");
    }
  };

  const inputStyle =
    "p-1 text-sm text-gray-700 focus:outline-none focus:ring-0 bg-transparent";

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
        <Toaster position="top-center" reverseOrder={false} />
        <Title setModal={setIsOpenModal}>Employee Lifeline</Title>

        {/* Profile Section */}
        <div className="flex items-center gap-6 bg-white p-3 shadow-md rounded-lg mb-4">
          <img
            className="w-20 h-20 rounded-full border-4 border-indigo-500 object-cover"
            src={profilePicture}
            alt="Profile"
          />
          <div className="flex flex-col">
            {isEditing ? (
              <input
                name="employeeName"
                value={editData.employeeName}
                onChange={handleInputChange}
                className={`text-lg font-semibold ${inputStyle}`}
              />
            ) : (
              <h2 className="text-2xl font-semibold text-gray-800">
                {employeeData.employeeName}
              </h2>
            )}
            {isEditing ? (
              <input
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                className={inputStyle}
              />
            ) : (
              <h4 className="text-sm text-gray-500">{employeeData.email}</h4>
            )}
          </div>
        </div>

        {/* Employee Details Table */}
        <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr] bg-gray-100 text-gray-800 font-semibold text-sm border border-gray-300 rounded-t-md">
          <span className="p-2 text-left">Sr#</span>
          <span className="p-2 text-left">Date</span>
          <span className="p-2 text-left">Position</span>
          <span className="p-2 text-left">Contact</span>
          <span className="p-2 text-left">Actions</span>
        </div>

        <div className="max-h-[20rem] overflow-y-auto border-x border-b border-gray-300">
          <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr] text-sm text-gray-700 hover:bg-gray-50 transition duration-200 p-2 items-center">
            <span>1</span>
            <span>{new Date(employeeData.date).toLocaleDateString()}</span>
            <span>
              {isEditing ? (
                <input
                  name="position"
                  value={editData.position}
                  onChange={handleInputChange}
                  className={`w-full ${inputStyle}`}
                />
              ) : (
                employeeData.position
              )}
            </span>
            <span>
              {isEditing ? (
                <input
                  name="contact"
                  value={editData.contact}
                  onChange={handleInputChange}
                  className={`w-full ${inputStyle}`}
                />
              ) : (
                employeeData.contact
              )}
            </span>
            <span className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
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
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
