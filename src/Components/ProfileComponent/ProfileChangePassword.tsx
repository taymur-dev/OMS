import React, { useState } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type ProfileChangePasswordProps = {
  setModal: () => void;
};

const initialState = {
  oldPassword: "",
  newPassword: "",
};

export const ProfileChangePassword = ({
  setModal,
}: ProfileChangePasswordProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const id = currentUser?.userId;
  const token = currentUser?.token;

  const [changePassword, setChangePassword] = useState(initialState);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangePassword({ ...changePassword, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!changePassword.oldPassword || !changePassword.newPassword) {
      setMessage("Please fill both old and new passwords.");
      return;
    }

    // Check if old and new passwords are the same
    if (changePassword.oldPassword === changePassword.newPassword) {
      setMessage("New password cannot be the same as old password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.put(
        `${BASE_URL}/api/changePassword/${id}`,
        {
          oldPassword: changePassword.oldPassword,
          newPassword: changePassword.newPassword,
        },
        {
          headers: { Authorization: token || "" },
        },
      );

      setMessage(res.data.message);
      setChangePassword(initialState);

      // Close modal after successful password change
      setTimeout(() => {
        setModal();
      }, 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || "Error updating password");
      } else {
        setMessage("Network error or server is down");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="w-full max-w-lg overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
        <form onSubmit={handlerSubmitted}>
          {/* Header */}
          <div className="bg-white rounded-xl border-t-5 border-blue-400">
            <Title
              setModal={setModal}
              className="text-white text-xl font-semibold"
            >
              Change Password
            </Title>
          </div>

          {/* Body */}
          <div className="px-6 py-6 flex flex-col gap-5">
            <InputField
              labelName="Old Password *"
              type="password"
              name="oldPassword"
              value={changePassword.oldPassword}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="New Password *"
              type="password"
              name="newPassword"
              value={changePassword.newPassword}
              handlerChange={handlerChange}
            />

            {message && (
              <p
                className={`text-center text-sm font-medium ${
                  message.includes("success")
                    ? "text-green-600 bg-green-50"
                    : "text-red-600 bg-red-50"
                } py-2 rounded-md`}
              >
                {message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-white">
            <CancelBtn setModal={setModal} />
            <AddButton loading={loading} label={loading ? "Saving" : "Save"} />
          </div>
        </form>
      </div>
    </div>
  );
};
