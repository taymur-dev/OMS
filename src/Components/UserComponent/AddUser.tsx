import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { TextareaField } from "../InputFields/TextareaField";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import { FiUpload, FiX } from "react-icons/fi";

export interface IAddUserValues {
  userId: number | string;
  name: string;
  email: string;
  contact: string;
  cnic: string;
  address: string;
  date: string;
  role: string;
  password: string;
  confirmPassword?: string;
  image?: string; // Add image field to store URL
}

export interface IAddUserProps extends React.ComponentPropsWithoutRef<"div"> {
  handlerGetUsers: () => void;
  setModal: () => void;
  initialValues?: IAddUserValues;
  viewType: "ADD" | "UPDATE" | "View";
  userId?: number;
  onSuccesAction: () => void;
}

const currentDate = new Date().toLocaleDateString("sv-SE", {
  timeZone: "Asia/Karachi",
});

const initialState: IAddUserValues = {
  name: "",
  email: "",
  contact: "",
  cnic: "",
  address: "",
  date: currentDate,
  role: "User",
  userId: "",
  password: "",
  confirmPassword: "",
  image: "",
};

const isValidEmail = (email: string): boolean => {
  const emailRegex =
    /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._+-]+(?<!\.)@(?!(?:-|\.)).*?(?<!-)\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const AddUser = ({
  handlerGetUsers,
  setModal,
  initialValues,
  viewType,
  userId,
  onSuccesAction,
}: IAddUserProps) => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAppSelector((state) => state?.officeState);
  const token = currentUser?.token;

  const [userData, setUserData] = useState<IAddUserValues>(initialState);

  // Image Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (initialValues) {
      setUserData({
        ...initialValues,
        role: "User",
      });

      if (initialValues.image) {
        setImagePreview(`${BASE_URL}/${initialValues.image}`);
      }
    }
  }, [initialValues]);

  const handlerChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    let value = e.target.value;
    value = value.replace(/^\s+/, "");

    if (name === "name") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
      value = value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      value = value.slice(0, 50);
    }

    if (name === "email") {
      value = value.replace(/^\s+/, "");
      value = value.replace(/[^a-zA-Z0-9@._+-]/g, "");

      const [local, domain] = value.split("@");
      if (local?.includes("..")) {
        return;
      }

      if (local?.startsWith(".")) {
        return;
      }

      if (local?.endsWith(".") && !domain) {
        return;
      }

      if (domain?.startsWith(".")) {
        return;
      }

      if (local?.startsWith("-") || local?.endsWith("-")) {
        return;
      }
      if (domain?.startsWith("-") || domain?.endsWith("-")) {
        return;
      }
    }

    if (name === "contact") value = value.replace(/\D/g, "").slice(0, 11);

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

    if (name === "password" || name === "confirmPassword")
      value = value.slice(0, 20);

    if (name === "address") value = value.slice(0, 250);

    setUserData({ ...userData, [name]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
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
    // Reset file input
    const fileInput = document.getElementById(
      "image-upload",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handlerSubmitted = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (viewType === "ADD") {
      await handleAddUser();
    } else {
      await handleUpdateUser(userId);
    }
  };

  const prepareFormData = () => {
    const data = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && key !== "confirmPassword" && key !== "image") {
        data.append(key, value.toString());
      }
    });

    if (selectedFile) {
      data.append("image", selectedFile);
    }
    return data;
  };

  const handleAddUser = async (): Promise<void> => {
    const { name, email, password, confirmPassword, cnic, contact } = userData;

    if (!name || !email || !password || !confirmPassword || !contact || !cnic) {
      toast.error("Please fill all required fields", {
        toastId: "required-fields",
      });
      return;
    }

    if (password.length < 8 || password.length > 20) {
      toast.error("Password must be between 8 and 20 characters", {
        toastId: "password-length",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { toastId: "password-mismatch" });
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address", {
        toastId: "invalid-email",
      });
      return;
    }

    const data = prepareFormData();

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/admin/addUser`, data, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("User added successfully", { toastId: "user-success" });
      setUserData(initialState);
      setSelectedFile(null);
      setImagePreview("");
      handlerGetUsers();
      onSuccesAction();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error adding user", {
          toastId: "user-error",
        });
      } else {
        toast.error("An unexpected error occurred", { toastId: "user-error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (
    id: string | number | undefined,
  ): Promise<void> => {
    if (!id) return;

    const { password } = userData;

    if (password.length < 8 || password.length > 20) {
      toast.error("Password must be between 8 and 20 characters", {
        toastId: "password-length-update",
      });
      return;
    }

    const data = prepareFormData();

    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/admin/updateUser/${id}`, data, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("User updated successfully", {
        toastId: "user-update-success",
      });
      handlerGetUsers();
      onSuccesAction();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error updating user", {
          toastId: "user-update-error",
        });
      } else {
        toast.error("An unexpected error occurred", {
          toastId: "user-update-error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[90vh] overflow-y-auto bg-white mx-auto rounded shadow-xl">
        <form
          onSubmit={handlerSubmitted}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          {/* ===== Header ===== */}
          <div className="bg-indigo-900 rounded px-4">
            <div className="text-white">
              <Title setModal={setModal}>{viewType} USER</Title>
            </div>
          </div>

          {/* ===== Body ===== */}
          <div className="mx-4 my-4 grid grid-cols-1 sm:grid-cols-2 width-full gap-4">
            {/* Image Upload Field */}

            <InputField
              labelName="Name *"
              type="text"
              name="name"
              handlerChange={handlerChange}
              value={userData.name}
            />
            <InputField
              labelName="Email *"
              type="email"
              name="email"
              handlerChange={handlerChange}
              value={userData.email}
            />
            <InputField
              labelName="Phone Number *"
              type="number"
              name="contact"
              handlerChange={handlerChange}
              value={userData.contact}
            />
            <InputField
              labelName="CNIC *"
              type="text"
              name="cnic"
              handlerChange={handlerChange}
              value={userData.cnic}
            />

            <InputField
              labelName="Password *"
              type="password"
              name="password"
              handlerChange={handlerChange}
              value={userData.password}
            />
            <InputField
              labelName="Confirm Password *"
              type="password"
              name="confirmPassword"
              handlerChange={handlerChange}
              value={userData.confirmPassword}
            />

            <div className="md:col-span-2">
              <InputField
                labelName="Joining Date *"
                type="date"
                name="date"
                handlerChange={handlerChange}
                value={userData.date}
              />
            </div>

            <div className="md:col-span-2">
              <TextareaField
                labelName="Address *"
                name="address"
                handlerChange={handlerChange}
                inputVal={userData.address}
              />
            </div>

            <div className="md:col-span-2 mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>
              <div className="flex items-start gap-4">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex-1">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300
                       border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG or JPEG (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Footer ===== */}
          <div className="bg-indigo-900 rounded py-3 flex justify-end gap-3 px-4 sticky bottom-0">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={
                loading ? "Processing" : viewType === "ADD" ? "Save" : "Update"
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};
