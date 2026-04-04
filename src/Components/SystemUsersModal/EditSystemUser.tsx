import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { FiUpload, FiX } from "react-icons/fi";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

// ✅ TYPES
type RoleOption = {
  id: number;
  roleName: string;
};

type SystemUser = {
  id: number;
  name: string;
  email: string;
  contact: string;
  cnic: string;
  role: string;
  roleId: number | string;
  image?: string;
};

type FormDataType = {
  name: string;
  email: string;
  contact: string;
  cnic: string;
  role: string;
  roleId: number | string;
};

type Props = {
  setModal: () => void;
  handlerGetUsers: () => void;
  userData: SystemUser;
};

export const EditSystemUser = ({
  setModal,
  handlerGetUsers,
  userData,
}: Props) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    contact: "",
    cnic: "",
    role: "",
    roleId: "",
  });

  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Image states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // ================= INIT =================
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        contact: userData.contact || "",
        cnic: userData.cnic || "",
        role: userData.role || "",
        roleId: userData.roleId || "",
      });

      if (userData.image) {
        const img = userData.image.startsWith("http")
          ? userData.image
          : `${BASE_URL}/${userData.image}`;
        setImagePreview(img);
      }
    }
  }, [userData]);

  // ================= FETCH ROLES =================
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get<{ roles: RoleOption[] }>(
          `${BASE_URL}/api/admin/getRoles`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setRoles(res.data.roles || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoles();
  }, [token]);

  // ================= INPUT HANDLER =================
  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "role") {
      const selectedRole = roles.find((r) => r.roleName === value);
      setFormData((prev) => ({
        ...prev,
        role: value,
        roleId: selectedRole ? selectedRole.id : "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= IMAGE HANDLER =================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Select a valid image");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Max size 5MB");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview("");

    const fileInput = document.getElementById(
      "image-upload",
    ) as HTMLInputElement;

    if (fileInput) fileInput.value = "";
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("contact", formData.contact);
      data.append("cnic", formData.cnic.replace(/\D/g, ""));
      data.append("role", formData.role);
      data.append("roleId", String(formData.roleId));

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      await axios.put(
        `${BASE_URL}/api/admin/updateSystemUser/${userData.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("User updated successfully");

      handlerGetUsers();
      setModal();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="w-[45rem] bg-white rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          <div className="border-t-4 border-blue-400">
            <Title setModal={setModal}>EDIT SYSTEM USER</Title>
          </div>

          <div className="p-4 grid grid-cols-2 gap-4">
            <InputField
              labelName="Full Name"
              name="name"
              value={formData.name}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Email"
              name="email"
              value={formData.email}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Contact"
              name="contact"
              value={formData.contact}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="CNIC"
              name="cnic"
              value={formData.cnic}
              handlerChange={handlerChange}
            />

            <select
              name="role"
              value={formData.role}
              onChange={handlerChange}
              className="border p-2 rounded"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.roleName}>
                  {r.roleName}
                </option>
              ))}
            </select>

            {/* ✅ IMAGE */}
            <div className="col-span-2">
              <label className="text-sm font-semibold">Profile Image</label>

              <div className="flex items-center gap-4 mt-2">
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                )}

                {!imagePreview && (
                  <label
                    htmlFor="image-upload"
                    className="border-dashed border-2 p-4 cursor-pointer rounded"
                  >
                    <FiUpload />
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4">
            <CancelBtn setModal={setModal} />
            <AddButton loading={loading} label="Update" />
          </div>
        </form>
      </div>
    </div>
  );
};