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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangePassword({ ...changePassword, [name]: value.trim() });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) {
      console.error("User ID is missing");
      return;
    }

    if (!changePassword.oldPassword || !changePassword.newPassword) {
      setMessage("Please fill both old and new passwords.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${BASE_URL}/api/changePassword/${id}`,
        {
          oldPassword: changePassword.oldPassword,
          newPassword: changePassword.newPassword,
        },
        {
          headers: {
            Authorization: token || "",
          },
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
      console.error(error);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border border-indigo-500 p-6">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={setModal}>Change Password</Title>

            <div className="flex flex-col gap-4 my-4">
              <InputField
                labelName="Old Password*"
                placeHolder="Enter the old password"
                type="password"
                name="oldPassword"
                value={changePassword.oldPassword}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="New Password*"
                placeHolder="Enter the new password"
                type="password"
                name="newPassword"
                value={changePassword.newPassword}
                handlerChange={handlerChange}
              />
            </div>

            {message && (
              <p className="text-center text-sm text-red-600 mb-2">{message}</p>
            )}

            <div className="flex items-center justify-center gap-4 mt-4">
              <CancelBtn setModal={setModal} />
              <AddButton label={loading ? "Saving..." : "Save Password"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
