import { useEffect, useState } from "react";

import { InputField } from "../InputFields/InputField";

import { Title } from "../Title";

import { AddButton } from "../CustomButtons/AddButton";

import { CancelBtn } from "../CustomButtons/CancelBtn";

import axios, { AxiosError } from "axios";

import { BASE_URL } from "../../Content/URL";

import { useAppSelector } from "../../redux/Hooks";

import { toast } from "react-toastify";
import { UserSelect } from "../InputFields/UserSelect";
import { TextareaField } from "../InputFields/TextareaField";

const currentDate = new Date().toISOString().split("T")[0];

type AddResignationProps = {
  setModal: () => void;
};

const initialState = {
  id: "",
  designation: "",
  note: "",
  resignationDate: currentDate,
  approvalStatus: "",
};

export const AddResignation = ({ setModal }: AddResignationProps) => {
  const [allUsers, setAllUsers] = useState([]);

  const [addResignation, setAddResignation] = useState(initialState);

  console.log("=>", addResignation);

  const { currentUser } = useAppSelector((state) => state?.officeState);

  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAddResignation({ ...addResignation, [name]: value });
  };

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getUsers`, {
        headers: {
          Authorization: token,
        },
      });
      setAllUsers(res?.data?.users);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    }
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/admin/addCustomer`,
        addResignation,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data.message);
      setModal();
      toast.success(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
      <div className="w-[42rem]  bg-white mx-auto rounded-xl border  border-indigo-500 ">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={() => setModal()}>Add Employee Resignation</Title>
          <div className="mx-2  flex-wrap gap-3  ">
            <UserSelect
              labelName="Select Employee*"
              name="id"
              handlerChange={handlerChange}
              optionData={allUsers}
              value={addResignation.id}
            />
            <InputField
              labelName="Current Designation*"
              placeHolder="Enter the current designation"
              type="text"
              name="currentDesignation"
              handlerChange={handlerChange}
              inputVal={addResignation?.designation}
            />

            <TextareaField
              labelName="Note*"
              placeHolder="Write here your resignation description"
              handlerChange={handlerChange}
              name="note"
              inputVal={addResignation.note}
            />

            <InputField
              labelName="Date*"
              placeHolder="Enter the Resignation Date "
              type="date"
              name="resignationDate"
              handlerChange={handlerChange}
              inputVal={addResignation.resignationDate}
            />
          </div>

          <div className="flex items-center justify-center m-2 gap-2 text-xs ">
            <CancelBtn setModal={() => setModal()} />
            <AddButton label={"Add Resignation"} />
          </div>
        </form>
      </div>
    </div>
  );
};
