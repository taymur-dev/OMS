// import React, { useState, useEffect, useCallback } from "react";
// import { AddButton } from "../CustomButtons/AddButton";
// import { CancelBtn } from "../CustomButtons/CancelBtn";
// import { InputField } from "../InputFields/InputField";
// import { Title } from "../Title";
// import axios from "axios";
// import { BASE_URL } from "../../Content/URL";
// import { useAppSelector } from "../../redux/Hooks";
// import { toast } from "react-toastify";

// type RoleType = {
//   id: number;
//   roleName: string;
// };

// type EditRoleProps = {
//   setModal: () => void;
//   selectRole: RoleType | null;
//   getAllRoles: () => void;
// };

// export const EditRole = ({
//   setModal,
//   selectRole,
//   getAllRoles,
// }: EditRoleProps) => {
//   const { currentUser } = useAppSelector((state) => state.officeState);
//   const token = currentUser?.token;

//   const [loading, setLoading] = useState(false);
//   const [allRoles, setAllRoles] = useState<RoleType[]>([]);
//   const [updateRole, setUpdateRole] = useState<RoleType | null>(null);

//   // Fetch all roles for duplicate validation
//   const fetchAllRoles = useCallback(async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/admin/getRoles`, {
//         headers: { Authorization: token },
//       });
//       setAllRoles(res?.data?.roles || []);
//     } catch (error) {
//       console.error("Failed to fetch roles for validation:", error);
//     }
//   }, [token]);

//   useEffect(() => {
//     if (selectRole) {
//       setUpdateRole(selectRole);
//       fetchAllRoles();
//     }
//   }, [selectRole, fetchAllRoles]);

//   const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     const updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);

//     setUpdateRole({
//       ...updateRole,
//       [name]: updatedValue,
//     } as RoleType);
//   };

//   const isDuplicateRole = (roleName: string, currentId: number): boolean => {
//     return allRoles.some(
//       (role) =>
//         role.roleName.toLowerCase() === roleName.toLowerCase() &&
//         role.id !== currentId,
//     );
//   };

//   const handleUpdateRole = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!updateRole?.roleName?.trim()) {
//       toast.error("Role name is required", { toastId: "role-required" });
//       return;
//     }

//     const trimmedRoleName = updateRole.roleName.trim();

//     // Duplicate validation
//     if (isDuplicateRole(trimmedRoleName, updateRole.id)) {
//       toast.error("Role name already exists. Please use a different name.", {
//         toastId: "role-duplicate",
//       });
//       return;
//     }

//     // No changes check
//     if (trimmedRoleName === selectRole?.roleName) {
//       toast.info("No changes were made to the role", {
//         toastId: "role-no-change",
//       });
//       setModal();
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.put(
//         `${BASE_URL}/api/admin/updateRole/${updateRole.id}`,
//         { roleName: trimmedRoleName },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );

//       toast.success(res.data.message, { toastId: "role-update-success" });
//       getAllRoles();
//       setModal();
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         const message =
//           error.response?.data?.message || "Failed to update role";
//         toast.error(message, { toastId: "role-update-failed" });
//       } else {
//         toast.error("Unexpected error occurred", {
//           toastId: "role-update-failed",
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-50">
//         <div className="w-[42rem] max-h-[28rem] overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
//           <form
//             onSubmit={handleUpdateRole}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") e.preventDefault();
//             }}
//           >
//             <div className="bg-white rounded-xl border-t-5 border-blue-400">
//               <Title
//                 setModal={setModal}
//                 className="text-white text-lg font-semibold"
//               >
//                 EDIT ROLE
//               </Title>
//             </div>

//             <div className="mx-4 flex-wrap gap-3 py-6">
//               <InputField
//                 labelName="Role Name *"
//                 type="text"
//                 name="roleName"
//                 value={updateRole?.roleName}
//                 handlerChange={handlerChange}
//                 minLength={3}
//                 maxLength={50}
//               />

//               {updateRole?.roleName &&
//                 updateRole.roleName.trim() !== selectRole?.roleName &&
//                 isDuplicateRole(updateRole.roleName.trim(), updateRole.id) && (
//                   <p className="text-red-500 text-sm mt-1 ml-1">
//                     This role name already exists
//                   </p>
//                 )}
//             </div>

//             <div className="flex justify-end gap-3 px-4 rounded py-6 bg-white">
//               <CancelBtn setModal={setModal} />
//               <AddButton
//                 loading={loading}
//                 label={loading ? "Updating" : "Update"}
//               />
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
