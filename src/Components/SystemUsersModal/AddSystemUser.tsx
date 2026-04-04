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
  contact: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  roleId: "" as string | number, // Added roleId to state
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
    const { name, value } = e.target;
    let processedValue = value.replace(/^\s+/, "");

    // Logic to handle Role selection and mapping to roleId
    if (name === "role") {
      const selectedRole = roles.find((r) => r.roleName === value);
      setFormData((prev) => ({
        ...prev,
        role: value,
        roleId: selectedRole ? selectedRole.id : "",
      }));
      return;
    }

    if (name === "name") {
      processedValue = processedValue.replace(/[^a-zA-Z0-9 _-]/g, "");
      processedValue = processedValue
        .split(" ")
        .map((word) =>
          word ? word.charAt(0).toUpperCase() + word.slice(1) : "",
        )
        .join(" ");
      processedValue = processedValue.slice(0, 50);
    }

    if (name === "email") {
      processedValue = processedValue.replace(/[^a-zA-Z0-9@._+-]/g, "");
    }

    if (name === "contact") {
      processedValue = processedValue.replace(/\D/g, "").slice(0, 11);
    }

    if (name === "cnic") {
      const digits = processedValue.replace(/\D/g, "");
      if (digits.length <= 5) processedValue = digits;
      else if (digits.length <= 12)
        processedValue = `${digits.slice(0, 5)}-${digits.slice(5)}`;
      else
        processedValue = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(
          12,
          13,
        )}`;
    }

    if (name === "password" || name === "confirmPassword") {
      processedValue = processedValue.slice(0, 20);
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      confirmPassword,
      contact,
      cnic,
      role,
      roleId,
    } = formData;

    if (
      !name ||
      !contact ||
      !cnic ||
      !email ||
      !password ||
      !confirmPassword ||
      !role ||
      !roleId
    ) {
      toast.error("Please fill all required fields", {
        toastId: "required-fields",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email format", { toastId: "invalid-email" });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { toastId: "password-mismatch" });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        email: email.toLowerCase().trim(),
        cnic: cnic.replace(/\D/g, ""), // Send raw digits to DB
      };

      const res = await axios.post(
        `${BASE_URL}/api/admin/addSystemUser`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(res.data.message || "User added successfully");
      setFormData(initialState);
      handlerGetUsers();
      setModal();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError?.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-50">
      <div className="w-[45rem] max-h-[90vh] overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-white rounded-xl border-t-5 border-blue-400 sticky top-0 z-10">
            <Title setModal={setModal}>ADD SYSTEM USER</Title>
          </div>

          <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 py-4 gap-4">
            <div className="sm:col-span-2">
              <InputField
                labelName="Full Name *"
                name="name"
                value={formData.name}
                handlerChange={handlerChange}
              />
            </div>

            <InputField
              labelName="CNIC *"
              name="cnic"
              value={formData.cnic}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Phone Number *"
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
                {roles.map((r) => (
                  <option key={r.id} value={r.roleName}>
                    {r.roleName}
                  </option>
                ))}
              </select>
            </div>

            <InputField
              labelName="Password *"
              type="password"
              name="password"
              value={formData.password}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Confirm Password *"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 py-3 bg-gray-50 sticky bottom-0 border-t">
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
