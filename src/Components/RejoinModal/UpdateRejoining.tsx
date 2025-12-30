import { useCallback, useEffect, useState } from "react";

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

import { OptionField } from "../InputFields/OptionField";

const currentDate = new Date().toISOString().split("T")[0];

type AddPromotionProps = {
  setModal: () => void;
};

const ApprovalOptions = [
  {
    id: 1,
    label: "Accepted",
    value: "accepted",
  },
  {
    id: 2,
    label: "Rejected",
    value: "rejected",
  },
];

const initialState = {
  id: "",
  designation: "",
  resignationDate: "",
  rejoinDate: "",
  approval: "",
  note: "",
  rejoiningStatus: "",
  date: currentDate,
};

export const UpdateRejoining = ({ setModal }: AddPromotionProps) => {
  const [allUsers, setAllUsers] = useState([]);

  const [addRejoining, setAddRejoining] = useState(initialState);

  console.log("=>", addRejoining);

  const { currentUser } = useAppSelector((state) => state?.officeState);

  const token = currentUser?.token;

  // const [showTime, setShowTime] = useState("");
  // setInterval(() => {
  //   const getTime = new Date().toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //     hour12: true,
  //   });
  //   setShowTime(getTime);
  // }, 1000);
  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAddRejoining({ ...addRejoining, [name]: value });
  };

  const getAllUsers = useCallback(async () => {
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
  } , [token]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/admin/addCustomer`,
        addRejoining,
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
  }, [getAllUsers]);
  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
      <div className="w-[42rem]  bg-white mx-auto rounded-xl border  border-indigo-500 ">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={() => setModal()}>Update Rejoining Employee</Title>
          <div className="mx-2  flex-wrap gap-3  ">
            <UserSelect
              labelName="Select Employee*"
              name="id"
              handlerChange={handlerChange}
              optionData={allUsers}
              value={addRejoining.id}
            />
            <InputField
              labelName="Current Designation*"
              placeHolder="Enter the Current Designation"
              type="text"
              name="designation"
              handlerChange={handlerChange}
              value={addRejoining?.designation}
            />
            <InputField
              labelName="Resignation Date*"
              placeHolder="Enter the Resignation Date"
              type="text"
              name="resignationDate"
              handlerChange={handlerChange}
              value={addRejoining.resignationDate}
            />
            <TextareaField
              labelName="Note*"
              placeHolder="Write here your rejoining description"
              handlerChange={handlerChange}
              name="note"
              inputVal={addRejoining.note}
            />

            <InputField
              labelName="Rejoin Date*"
              placeHolder="Enter the Rejoin Date"
              type="date"
              name="rejoinDate"
              handlerChange={handlerChange}
              value={addRejoining.rejoinDate}
            />
          </div>

          <div className="px-2">
            <OptionField
              labelName="Approval Status*"
              name="approvalStatus"
              value={addRejoining.rejoiningStatus}
              handlerChange={handlerChange}
              optionData={ApprovalOptions}
              inital="Pending"
            />
          </div>

          <div className="flex items-center justify-center m-2 gap-2 text-xs ">
            <CancelBtn setModal={() => setModal()} />

            <AddButton label={"update Rejoining"} />
          </div>
        </form>
      </div>
    </div>
  );
};
