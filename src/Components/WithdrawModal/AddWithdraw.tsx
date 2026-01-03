import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { TextareaField } from "../InputFields/TextareaField";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { UserSelect } from "../InputFields/UserSelect";
import { toast } from "react-toastify";


type UserOption = {
  id: number;
  name: string;
  role: string;
  loginStatus: string;
};

type WithdrawState = {
  id: string;
  withdrawReason: string;
};

type AddWithdrawProps = {
  setModal: () => void;
  handlegetwithDrawEmployeess: () => void;
};


const initialState: WithdrawState = {
  id: "",
  withdrawReason: "",
};

export const AddWithdraw = ({
  setModal,
  handlegetwithDrawEmployeess,
}: AddWithdrawProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [addWithdraw, setAddWithdraw] =
    useState<WithdrawState>(initialState);

  const [allUsers, setAllUsers] = useState<
    { value: number; label: string }[]
  >([]);


  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAddWithdraw((prev) => ({ ...prev, [name]: value }));
  };


  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      });

      const filteredUsers = res?.data?.users
        ?.filter(
          (user: UserOption) =>
            user.role === "user" && user.loginStatus === "Y"
        )
        .map((user: UserOption) => ({
          value: user.id,
          label: user.name,
        }));

      setAllUsers(filteredUsers);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    }
  }, [token]);

  const handlerSubmitted = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/withdrawEmployee/${addWithdraw.id}`,
        {
          withdrawReason: addWithdraw.withdrawReason,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log(res.data);
      handlegetwithDrawEmployeess();
      setModal();
      toast.success("Employee withdrawn successfully");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    }
  };


  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);


  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border border-indigo-500">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={setModal}>Add Employee Withdraw</Title>

          <div className="mx-2 flex-wrap gap-3">
            <UserSelect
              labelName="Select Employee*"
              name="id"
              value={addWithdraw.id}
              handlerChange={handlerChange}
              optionData={allUsers}
            />

            <TextareaField
              labelName="Withdraw Reason*"
              name="withdrawReason"
              inputVal={addWithdraw.withdrawReason}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex items-center justify-center m-2 gap-2 text-xs">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save Withdraw" />
          </div>
        </form>
      </div>
    </div>
  );
};
