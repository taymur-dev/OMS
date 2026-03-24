import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type RoleOption = {
  id: number;
  roleName: string;
};

type AddSystemUserProps = {
  setModal: () => void;
  handlerGetUsers: () => void;
};

const initialState = {
  name: "",
  cnic: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
};

const isValidEmail = (email: string): boolean => {
  const emailRegex =
    /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._+-]+(?<!\.)@(?!(?:-|\.)).*?(?<!-)\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const AddSystemUser = ({
  setModal,
  handlerGetUsers,
}: AddSystemUserProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [formData, setFormData] = useState(initialState);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch roles for the dropdown on component mount
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
      value = value.replace(/[^a-zA-Z0-9 _-]/g, "");

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
      if (local?.startsWith(".") || local?.endsWith(".")) return;
      if (local?.startsWith("-") || local?.endsWith("-")) return;
      if (domain?.startsWith("-") || domain?.endsWith("-")) return;
    }

    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 11);
    }

    if (name === "cnic") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 5) value = digits;
      else if (digits.length <= 12)
        value = `${digits.slice(0, 5)}-${digits.slice(5)}`;
      else
        value = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(
          12,
          13,
        )}`;
    }

    if (name === "password" || name === "confirmPassword") {
      value = value.slice(0, 20);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, phone, cnic, role } =
      formData;

    if (
      !name ||
      !phone ||
      !cnic ||
      !email ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      toast.error("Please fill all required fields", {
        toastId: "required-fields",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address", {
        toastId: "invalid-email",
      });
      return;
    }

    if (phone && phone.length !== 11) {
      toast.error("Phone number must be exactly 11 digits", {
        toastId: "invalid-phone",
      });
      return;
    }

    if (cnic) {
      const digitsOnly = cnic.replace(/\D/g, "");
      if (digitsOnly.length !== 13) {
        toast.error("CNIC must be exactly 13 digits", {
          toastId: "invalid-cnic",
        });
        return;
      }
    }

    if (password.length < 8 || password.length > 20) {
      toast.error("Password must be between 8 and 20 characters", {
        toastId: "password-length",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        toastId: "password-mismatch",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        email: email.toLowerCase(),
        cnic: formData.cnic ? formData.cnic.replace(/\D/g, "") : "",
      };

      const res = await axios.post(
        `${BASE_URL}/api/admin/addSystemUser`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(res.data.message || "User added successfully", {
        toastId: "user-success",
      });

      setFormData(initialState);
      handlerGetUsers();
      setModal();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Something went wrong",
        { toastId: "server-error" },
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
              ADD SYSTEM USER
            </Title>
          </div>

          <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 py-4 gap-4">
            {/* Name */}
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

            {/* CNIC */}
            <InputField
              labelName="CNIC *"
              type="text"
              name="cnic"
              value={formData.cnic}
              handlerChange={handlerChange}
            />

            {/* Phone */}
            <InputField
              labelName="Phone Number *"
              type="text"
              name="phone"
              value={formData.phone}
              handlerChange={handlerChange}
            />

            {/* Email */}
            <InputField
              labelName="Email Address *"
              type="email"
              name="email"
              value={formData.email}
              handlerChange={handlerChange}
            />

            {/* Role Dropdown */}
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

            {/* Password */}
            <InputField
              labelName="Password *"
              type="password"
              name="password"
              value={formData.password}
              handlerChange={handlerChange}
            />

            {/* Confirm Password */}
            <InputField
              labelName="Confirm Password *"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-gray-50 sticky bottom-0 border-t border-gray-100">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={loading ? "Saving..." : "Save"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
