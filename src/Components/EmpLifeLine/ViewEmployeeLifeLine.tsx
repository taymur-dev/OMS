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
        { headers: { Authorization: `Bearer ${token}` } },
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
      `Are you sure you want to delete ${employeeData.employeeName}?`,
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${BASE_URL}/api/admin/deleteEmpll/${employeeData.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
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

  // return (
  //   <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-10">
  //     <div className="bg-white w-full max-w-3xl border border-indigo-900 rounded p-6 shadow-lg">
  //       <Toaster position="top-center" reverseOrder={false} />

  //       <div className="bg-indigo-900 rounded px-6">
  //         <Title
  //           setModal={setIsOpenModal}
  //           className="text-white text-lg font-semibold"
  //         >
  //           View Employee LifeLine
  //         </Title>
  //       </div>
  //       {/* Profile Section */}
  //       <div className="flex items-center gap-6 bg-white p-3 shadow-md rounded-lg mb-4">
  //         <img
  //           className="w-20 h-20 rounded-full border-4 border-indigo-900 object-cover"
  //           src={profilePicture}
  //           alt="Profile"
  //         />
  //         <div className="flex flex-col">
  //           {isEditing ? (
  //             <input
  //               name="employeeName"
  //               value={editData.employeeName}
  //               onChange={handleInputChange}
  //               className={`text-lg font-semibold ${inputStyle}`}
  //             />
  //           ) : (
  //             <h2 className="text-2xl font-semibold text-gray-800">
  //               {employeeData.employeeName}
  //             </h2>
  //           )}
  //           {isEditing ? (
  //             <input
  //               name="email"
  //               value={editData.email}
  //               onChange={handleInputChange}
  //               className={inputStyle}
  //             />
  //           ) : (
  //             <h4 className="text-sm text-gray-500">{employeeData.email}</h4>
  //           )}
  //         </div>
  //       </div>

  //       {/* Employee Details Table */}
  //       <div
  //         className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr] bg-indigo-900 text-white font-semibold
  //        text-sm border border-gray-300 rounded-t-md"
  //       >
  //         <span className="p-2 text-left">Sr#</span>
  //         <span className="p-2 text-left">Date</span>
  //         <span className="p-2 text-left">Position</span>
  //         <span className="p-2 text-left">Contact</span>
  //         <span className="p-2 text-left">Actions</span>
  //       </div>

  //       <div className="max-h-[20rem] overflow-y-auto border-x border-b border-gray-300">
  //         <div
  //           className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr] text-sm text-gray-700 hover:bg-gray-50
  //          transition duration-200 p-2 items-center"
  //         >
  //           <span>1</span>
  //           <span>{new Date(employeeData.date).toLocaleDateString()}</span>
  //           <span>
  //             {isEditing ? (
  //               <input
  //                 name="position"
  //                 value={editData.position}
  //                 onChange={handleInputChange}
  //                 className={`w-full ${inputStyle}`}
  //               />
  //             ) : (
  //               employeeData.position
  //             )}
  //           </span>
  //           <span>
  //             {isEditing ? (
  //               <input
  //                 name="contact"
  //                 value={editData.contact}
  //                 onChange={handleInputChange}
  //                 className={`w-full ${inputStyle}`}
  //               />
  //             ) : (
  //               employeeData.contact
  //             )}
  //           </span>
  //           <span className="flex gap-2">
  //             {isEditing ? (
  //               <>
  //                 <button
  //                   onClick={handleSave}
  //                   className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
  //                 >
  //                   Save
  //                 </button>
  //                 <button
  //                   onClick={handleCancel}
  //                   className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
  //                 >
  //                   Cancel
  //                 </button>
  //               </>
  //             ) : (
  //               <>
  //                 <EditButton handleUpdate={() => setIsEditing(true)} />
  //                 <DeleteButton handleDelete={handleDeleteClick} />
  //               </>
  //             )}
  //           </span>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  //   return (
  //   <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-10">
  //     <div className="bg-white w-full max-w-3xl border border-indigo-900 rounded p-6 shadow-lg">
  //       <Toaster position="top-center" reverseOrder={false} />

  //       <div className="bg-indigo-900 rounded px-6 py-2">
  //         <Title
  //           setModal={setIsOpenModal}
  //           className="text-white text-lg font-semibold"
  //         >
  //           View Employee LifeLine
  //         </Title>
  //       </div>

  //       {/* Profile Section */}
  //       <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white p-3 shadow-md rounded-lg mb-4">
  //         <img
  //           className="w-20 h-20 rounded-full border-4 border-indigo-900 object-cover"
  //           src={profilePicture}
  //           alt="Profile"
  //         />
  //         <div className="flex flex-col w-full sm:w-auto">
  //           {isEditing ? (
  //             <input
  //               name="employeeName"
  //               value={editData.employeeName}
  //               onChange={handleInputChange}
  //               className={`text-lg font-semibold ${inputStyle}`}
  //             />
  //           ) : (
  //             <h2 className="text-2xl font-semibold text-gray-800">
  //               {employeeData.employeeName}
  //             </h2>
  //           )}
  //           {isEditing ? (
  //             <input
  //               name="email"
  //               value={editData.email}
  //               onChange={handleInputChange}
  //               className={inputStyle}
  //             />
  //           ) : (
  //             <h4 className="text-sm text-gray-500">{employeeData.email}</h4>
  //           )}
  //         </div>
  //       </div>

  //       {/* Employee Details Table */}
  //       <div className="overflow-x-auto border border-gray-300 rounded">
  //         <div className="min-w-[600px]">
  //           <div className="grid grid-cols-5 bg-indigo-900 text-white font-semibold text-sm">
  //             <span className="p-2 text-left">Sr#</span>
  //             <span className="p-2 text-left">Date</span>
  //             <span className="p-2 text-left">Position</span>
  //             <span className="p-2 text-left">Contact</span>
  //             <span className="p-2 text-left">Actions</span>
  //           </div>

  //           <div className="max-h-80 overflow-y-auto">
  //             <div className="grid grid-cols-5 text-sm text-gray-700 hover:bg-gray-50 transition duration-200 p-2 items-center">
  //               <span>1</span>
  //               <span>{new Date(employeeData.date).toLocaleDateString()}</span>
  //               <span>
  //                 {isEditing ? (
  //                   <input
  //                     name="position"
  //                     value={editData.position}
  //                     onChange={handleInputChange}
  //                     className={`w-full ${inputStyle}`}
  //                   />
  //                 ) : (
  //                   employeeData.position
  //                 )}
  //               </span>
  //               <span>
  //                 {isEditing ? (
  //                   <input
  //                     name="contact"
  //                     value={editData.contact}
  //                     onChange={handleInputChange}
  //                     className={`w-full ${inputStyle}`}
  //                   />
  //                 ) : (
  //                   employeeData.contact
  //                 )}
  //               </span>
  //               <span className="flex gap-2 flex-wrap">
  //                 {isEditing ? (
  //                   <>
  //                     <button
  //                       onClick={handleSave}
  //                       className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
  //                     >
  //                       Save
  //                     </button>
  //                     <button
  //                       onClick={handleCancel}
  //                       className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
  //                     >
  //                       Cancel
  //                     </button>
  //                   </>
  //                 ) : (
  //                   <>
  //                     <EditButton handleUpdate={() => setIsEditing(true)} />
  //                     <DeleteButton handleDelete={handleDeleteClick} />
  //                   </>
  //                 )}
  //               </span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm px-2 sm:px-4 flex items-center justify-center z-10">
      <div className="bg-white w-full max-w-4xl border border-indigo-900 rounded-lg p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <Toaster position="top-center" reverseOrder={false} />

        {/* Header */}
        <div className="bg-indigo-900 rounded px-4 sm:px-6 py-2 mb-4">
          <Title
            setModal={setIsOpenModal}
            className="text-white text-base sm:text-lg font-semibold"
          >
            View Employee LifeLine
          </Title>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white p-4 shadow-md rounded-lg mb-6">
          {/* Avatar + Name */}
          <div className="flex flex-col items-center text-center sm:text-left">
            <img
              className="w-20 h-20 rounded-full border-4 border-indigo-900 object-cover"
              src={profilePicture}
              alt="Profile"
            />

            {isEditing ? (
              <input
                name="employeeName"
                value={editData.employeeName}
                onChange={handleInputChange}
                className={`mt-2 text-center font-semibold ${inputStyle}`}
              />
            ) : (
              <h2 className="mt-2 text-lg font-semibold text-gray-800">
                {employeeData.employeeName}
              </h2>
            )}
          </div>

          {/* Email */}
          <div className="w-full sm:flex-1 text-center sm:text-left">
            {isEditing ? (
              <input
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                className={`w-full ${inputStyle}`}
              />
            ) : (
              <p className="text-sm text-gray-500 break-all">
                {employeeData.email}
              </p>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="border border-gray-300 rounded-lg overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Table Header */}
            <div className="grid grid-cols-5 bg-indigo-900 text-white font-semibold text-sm">
              <span className="p-2">Sr#</span>
              <span className="p-2">Date</span>
              <span className="p-2">Position</span>
              <span className="p-2">Contact</span>
              <span className="p-2">Actions</span>
            </div>

            {/* Table Body */}
            <div className="max-h-72 overflow-y-auto">
              <div className="grid grid-cols-5 text-sm text-gray-700 p-2 items-center hover:bg-gray-50 transition">
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

                <span className="flex gap-2 flex-wrap">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
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
      </div>
    </div>
  );
};
