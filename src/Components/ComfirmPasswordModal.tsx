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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white border border-indigo-900 rounded shadow-lg">
        {/* Header */}
        <div className="bg-indigo-900 rounded-t px-6 ">
          <Title
            setModal={setModal}
            className="text-white text-lg font-semibold"
          >
            Confirm Password
          </Title>
        </div>

        {/* Body */}
        <div className="px-4 py-4 sm:px-6 sm:py-6 space-y-4">
          <InputField
            type="password"
            labelName="Password *"
            name="password"
            handlerChange={handleOnchange}
            value={formData.password}
          />

          <InputField
            type="password"
            labelName="Confirm Password *"
            name="confirmPassword"
            handlerChange={handleOnchange}
            value={formData.confirmPassword}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-4 py-3 bg-indigo-900 border-t border-indigo-900 rounded-b">
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
