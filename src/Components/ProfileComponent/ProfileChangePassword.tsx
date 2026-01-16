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

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangePassword({ ...changePassword, [name]: value.trim() });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!changePassword.oldPassword || !changePassword.newPassword) {
      setMessage("Please fill both old and new passwords.");
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/api/changePassword/${id}`,
        {
          oldPassword: changePassword.oldPassword,
          newPassword: changePassword.newPassword,
        },
        {
          headers: { Authorization: token || "" },
        }
      );

      setMessage(res.data.message);
      setChangePassword(initialState);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || "Error updating password");
      } else {
        setMessage("Network error or server is down");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-indigo-900 overflow-hidden">
        <form onSubmit={handlerSubmitted}>
          {/* Header */}
          <div className="bg-indigo-900 px-6">
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
              labelName="Old Password*"
              placeHolder="Enter your old password"
              type="password"
              name="oldPassword"
              value={changePassword.oldPassword}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="New Password*"
              placeHolder="Enter your new password"
              type="password"
              name="newPassword"
              value={changePassword.newPassword}
              handlerChange={handlerChange}
            />

            {message && (
              <p className="text-center text-sm font-medium text-red-600 bg-red-50 py-2 rounded-md">
                {message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-500">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save" />
          </div>
        </form>
      </div>
    </div>
  );
};
