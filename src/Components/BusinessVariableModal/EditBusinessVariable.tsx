import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

// Project Imports
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

// UI Components
import { Title } from "../Title";
import { InputField } from "../InputFields/InputField";
import { AddButton } from "../CustomButtons/AddButton"; // Using AddButton styled as "Update"
import { CancelBtn } from "../CustomButtons/CancelBtn";

type EditBusinessVariableProps = {
  setModal: () => void;
  refreshAssets: () => void;
  businessData: {
    id: number;
    name: string;
    email: string;
    contact: string;
    address: string;
    logo?: string;
  };
};

type FormDataType = {
  name: string;
  email: string;
  contact: string;
  address: string;
  logo: File | null;
};

export const EditBusinessVariable = ({
  setModal,
  refreshAssets,
  businessData,
}: EditBusinessVariableProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [formData, setFormData] = useState<FormDataType>({
    name: businessData.name,
    email: businessData.email,
    contact: businessData.contact,
    address: businessData.address,
    logo: null,
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    businessData.logo || null,
  );

  // Update local state if businessData changes
  useEffect(() => {
    setFormData({
      name: businessData.name,
      email: businessData.email,
      contact: businessData.contact,
      address: businessData.address,
      logo: null,
    });
    setPreview(businessData.logo || null);
  }, [businessData]);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "logo" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, logo: file }));
      setPreview(URL.createObjectURL(file));
      return;
    }

    let updatedValue = value;

    if (updatedValue.startsWith(" ")) return;

    if (name === "contact") {
      updatedValue = updatedValue.replace(/\D/g, "");

      if (updatedValue.length > 11) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.contact) {
      return toast.error("Required fields cannot be empty");
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.contact.trim()
    ) {
      return toast.error("Fields cannot be empty or spaces only");
    }

    if (!/^\d{11}$/.test(formData.contact)) {
      return toast.error("Contact must be exactly 11 digits");
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("contact", formData.contact);
      data.append("address", formData.address);

      // Only append logo if a new file was selected
      if (formData.logo) {
        data.append("logo", formData.logo);
      }

      await axios.put(
        `${BASE_URL}/api/admin/editBusinessVariable/${businessData.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Business information updated!");
      refreshAssets();
      setModal();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message || "Failed to add data";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur px-4 flex items-center justify-center z-50">
      <div className="w-[40rem] overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
        <form onSubmit={handlerSubmitted}>
          {/* Header */}
          <div className="bg-white rounded-xl border-t-5 border-blue-400">
            <Title setModal={setModal} className="text-lg font-semibold">
              UPDATE BUSINESS VARIABLE
            </Title>
          </div>

          <div className="px-4 py-6 space-y-4">
            {/* Logo Section */}
            <div className="flex items-center gap-4 pb-4">
              <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                {preview ? (
                  <img
                    src={preview}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-gray-400">No Logo</span>
                )}
              </div>
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update Logo (Optional)
                </label>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handlerChange}
                  className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                labelName="Business Name*"
                name="name"
                type="text"
                handlerChange={handlerChange}
                value={formData.name}
                minLength={3}
                maxLength={50}
              />

              <InputField
                labelName="Email Address*"
                name="email"
                type="email"
                handlerChange={handlerChange}
                value={formData.email}
              />

              <InputField
                labelName="Contact Number*"
                name="contact"
                type="phone"
                handlerChange={handlerChange}
                value={formData.contact}
              />

              <InputField
                labelName="Address*"
                name="address"
                type="text"
                handlerChange={handlerChange}
                value={formData.address}
                minLength={3}
                maxLength={50}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-4 py-6 bg-gray-50 rounded-b-xl">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={loading ? "Updating..." : "Update Changes"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
