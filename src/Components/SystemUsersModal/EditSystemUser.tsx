import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

import { AddButton } from "../CustomButtons/AddButton"; // Using AddButton for consistent styling
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type RoleOption = {
  id: number;
  roleName: string;
};

type UserType = {
  id: number;
  name: string;
  contact: string;
  email: string;
  role: string;
  cnic?: string; // Optional if not always returned by list API
};

type EditSystemUserProps = {
  selectUser: UserType;
  setModal: () => void;
  handlerGetUsers: () => void;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex =
    /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._+-]+(?<!\.)@(?!(?:-|\.)).*?(?<!-)\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const EditSystemUser = ({
  selectUser,
  setModal,
  handlerGetUsers,
}: EditSystemUserProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [formData, setFormData] = useState({
    name: selectUser.name || "",
    cnic: selectUser.cnic || "",
    contact: selectUser.contact || "",
    email: selectUser.email || "",
    role: selectUser.role || "",
    password: "", // Usually left empty for security on edit
  });

  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/getRoles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(res?.data?.roles || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, [token]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name } = e.target;
    let value = e.target.value;

    value = value.replace(/^\s+/, "");

    if (name === "name") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
      value = value
        .split(" ")
        .map((word) =>
          word ? word.charAt(0).toUpperCase() + word.slice(1) : "",
        )
        .join(" ");
      value = value.slice(0, 50);
    }

    if (name === "email") {
      value = value.replace(/[^a-zA-Z0-9@._+-]/g, "");

      const [local, domain] = value.split("@");

      if (local?.includes("..")) return;
      if (local?.startsWith(".")) return;
      if (local?.endsWith(".") && !domain) return;
      if (domain?.startsWith(".")) return;
      if (local?.startsWith("-") || local?.endsWith("-")) return;
      if (domain?.startsWith("-") || domain?.endsWith("-")) return;
    }

    if (name === "contact") {
      value = value.replace(/\D/g, "").slice(0, 11);
    }

    if (name === "cnic") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 5) value = digits;
      else if (digits.length <= 12)
        value = `${digits.slice(0, 5)}-${digits.slice(5)}`;
      else
        value = `${digits.slice(0, 5)}-${digits.slice(
          5,
          12,
        )}-${digits.slice(12, 13)}`;
    }

    if (name === "password") {
      value = value.slice(0, 20);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, role, password, contact } = formData;

    if (!name || !email || !role) {
      toast.error("Please fill all required fields", {
        toastId: "required-fields-edit",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address", {
        toastId: "invalid-email-edit",
      });
      return;
    }

    if (contact && contact.length !== 11) {
      toast.error("Phone number must be exactly 11 digits", {
        toastId: "invalid-contact-edit",
      });
      return;
    }

    if (password) {
      if (password.length < 8 || password.length > 20) {
        toast.error("Password must be between 8 and 20 characters", {
          toastId: "password-length-edit",
        });
        return;
      }
    }

    setLoading(true);

    try {
      const payload: Partial<typeof formData> & { password?: string } = {
        ...formData,
        cnic: formData.cnic ? formData.cnic.replace(/\D/g, "") : "",
      };

      if (!payload.password) {
        delete payload.password;
      }

      const res = await axios.put(
        `${BASE_URL}/api/admin/updateSystemUser/${selectUser.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(res.data.message || "User updated successfully", {
        toastId: "edit-success",
      });

      handlerGetUsers();
      setModal();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Something went wrong",
        { toastId: "edit-error" },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-50"
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      <div className="w-[45rem] max-h-[90vh] overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-white rounded-xl border-t-5 border-blue-400 sticky top-0 z-10">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              EDIT SYSTEM USER
            </Title>
          </div>

          <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 py-4 gap-4">
            <div className="sm:col-span-2">
              <InputField
                labelName="Full Name *"
                type="text"
                name="name"
                value={formData.name}
                handlerChange={handlerChange}
                minLength={3}
                maxLength={50}
              />
            </div>

            <InputField
              labelName="CNIC *"
              type="text"
              name="cnic"
              value={formData.cnic}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Phone Number *"
              type="text"
              name="contact"
              value={formData.contact}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Email Address *"
              type="email"
              name="email"
              value={formData.email}
              handlerChange={handlerChange}
              minLength={3}
              maxLength={250}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handlerChange}
                className="border border-gray-300 rounded-md p-2 outline-none focus:border-blue-400 text-sm h-[40px]"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.roleName}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <InputField
                labelName="Password *"
                type="password"
                name="password"
                value={formData.password}
                handlerChange={handlerChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-gray-50 sticky bottom-0 border-t border-gray-100">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={loading ? "Updating..." : "Update User"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
