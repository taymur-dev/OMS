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

type AddAttendanceProps = {
  setModal: () => void;
  handlegetwithDrawEmployeess: () => void;
};
const initialState = {
  id: "",
  withdrawReason: "",
};

export const AddWithdraw = ({ setModal , handlegetwithDrawEmployeess }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [allUsers, setAllUsers] = useState([]);

  const [addWithdraw, setAddWithdraw] = useState(initialState);

  console.log("user data =>", addWithdraw);

  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAddWithdraw({ ...addWithdraw, [name]: value });
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: {
          Authorization: token,
        },
      });
      setAllUsers(res?.data?.users);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    }
  }, [token]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/withdrawEmployee/${addWithdraw?.id}`,
        addWithdraw,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      handlegetwithDrawEmployeess();
      setModal();
      toast.success("Employee withdraw suceessfully");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);
  return (
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border  border-indigo-500 ">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={() => setModal()}>Add Employee Withdraw</Title>
            <div className="mx-2   flex-wrap gap-3  ">
              <UserSelect
                labelName="Select Employee*"
                name="id"
                handlerChange={handlerChange}
                optionData={allUsers}
                value={addWithdraw.id}
              />
              <TextareaField
                labelName="Withdraw Reason*"
                name="withdrawReason"
                inputVal={addWithdraw.withdrawReason}
                handlerChange={handlerChange}
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Save Withdraw"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
