import { useState } from "react";
import { InputField } from "./InputFields/InputField";
import { AddButton } from "./CustomButtons/AddButton";
import { CancelBtn } from "./CustomButtons/CancelBtn";
import { Title } from "./Title";
import { BASE_URL } from "../Content/URL";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "../redux/Hooks";
import { toast } from "react-toastify";

type PasswordProps = {
  catchId: number | null;
  setModal: () => void;
};

const initialState = {
  password: "",
  confirmPassword: "",
};

export const ComfirmPasswordModal = ({ catchId, setModal }: PasswordProps) => {
  const { currentUser } = useAppSelector((state) => state?.officeState);
  const token = currentUser?.token;

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.startsWith(" ")) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangePassword = async (id: number | null) => {
    if (!id) return;

    const { password, confirmPassword } = formData;

    // Basic validation
    if (!password || !confirmPassword) {
      toast.error("All fields are required", { toastId: "required-fields" });
      return;
    }

    if (password.length < 8 || password.length > 20) {
      toast.error("Password must be 8-20 characters", {
        toastId: "password-length",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { toastId: "password-mismatch" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/api/confirmPassword/${id}`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        },
      );

      toast.success(res.data.message, { toastId: "password-success" });
      setModal();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "An unexpected error occurred",
        { toastId: "password-error" },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      {/* Consistent width (max-w-3xl) and max-height with scrollbar */}
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white mx-auto rounded-xl shadow-xl flex flex-col">
        {/* Header: Matches AddCustomer border and Title style */}
        <div className="bg-white rounded-xl border-t-5 border-blue-400">
          <Title
            setModal={setModal}
            className="text-white text-lg font-semibold"
          >
            CONFIRM PASSWORD
          </Title>
        </div>

        {/* Body: Standardized padding (px-4 py-6) and gap to match AddCustomer */}
        <div className="px-4 py-6 space-y-5">
          <InputField
            type="password"
            labelName="Password *"
            name="password"
            handlerChange={handleOnchange}
            value={formData.password}
            autoComplete="new-password"
          />

          <InputField
            type="password"
            labelName="Confirm Password *"
            name="confirmPassword" // Note: Ensure this matches your state key (confirmPassword)
            handlerChange={handleOnchange}
            value={formData.confirmPassword}
            autoComplete="new-password"
          />
        </div>

        {/* Footer: Standardized padding and alignment */}
        <div className="flex justify-end items-center gap-3 px-4 py-4 bg-white rounded-b-xl border-t border-gray-100">
          <CancelBtn setModal={setModal} />
          <AddButton
            loading={loading}
            handleClick={() => handleChangePassword(catchId)}
            label={loading ? "Saving" : "Save Password"}
          />
        </div>
      </div>
    </div>
  );
};
