import { useState } from "react";
import { InputField } from "./InputFields/InputField";
import { AddButton } from "./CustomButtons/AddButton";
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

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleChangePassword = async (id: number | null) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/confirmPassword/${id}`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data.message);
      toast.success(res.data.message);
      setModal();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError?.response?.data?.message);
    }
  };
  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="min-w-[40rem] bg-white border border-indigo-500 rounded-sm ">
        <Title setModal={setModal}>Change Password</Title>
        <div className="px-2">
          <InputField
            type="password"
            placeHolder="Password"
            labelName="Password"
            name="password"
            handlerChange={handleOnchange}
          />

          <InputField
            type="password"
            placeHolder="Confirm Password"
            labelName="Confirm Password"
            name="confirmPassword"
            handlerChange={handleOnchange}
          />
        </div>
        <div className="text-center py-3">
          <AddButton
            handleClick={() => handleChangePassword(catchId)}
            label="Save Password"
          />
        </div>
      </div>
    </div>
  );
};
