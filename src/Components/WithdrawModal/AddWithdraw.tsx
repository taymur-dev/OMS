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

  const [addWithdraw, setAddWithdraw] = useState<WithdrawState>(initialState);

  const [loading, setLoading] = useState(false);

  const [allUsers, setAllUsers] = useState<{ value: number; label: string }[]>(
    [],
  );

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "withdrawReason") {
      updatedValue = updatedValue.slice(0, 250);
    }

    setAddWithdraw((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const filteredUsers = res?.data?.users
        ?.filter(
          (user: UserOption) =>
            user.role === "user" && user.loginStatus === "Y",
        )
        .map((user: UserOption) => ({
          value: user.id,
          label: user.name,
        }));

      setAllUsers(filteredUsers);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message, { toastId: "error" });
    }
  }, [token]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!addWithdraw?.id || !addWithdraw?.withdrawReason) {
      return toast.error("Please provide a reason for withdrawal", {
        toastId: "required-withdraw",
      });
    }

    setLoading(true);

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
        },
      );

      console.log(res.data);
      handlegetwithDrawEmployeess();
      setModal();
      toast.success("Employee withdrawn successfully", {
        toastId: "withdraw-success",
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message, { toastId: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded border border-indigo-900">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Add Employee Withdraw
            </Title>
          </div>
          <div className="mx-2 grid grid-cols-1 py-5 sm:grid-cols-2  md:grid-cols-2 gap-3">
            <UserSelect
              labelName="Select Employee *"
              name="id"
              value={addWithdraw.id}
              handlerChange={handlerChange}
              optionData={allUsers}
            />

            <TextareaField
              labelName="Withdraw Reason *"
              name="withdrawReason"
              inputVal={addWithdraw.withdrawReason}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={loading ? "Saving" : "Save"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
