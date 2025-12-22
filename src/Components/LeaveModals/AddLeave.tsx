import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { TextareaField } from "../InputFields/TextareaField";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { UserSelect } from "../InputFields/UserSelect";

type AddAttendanceProps = {
  setModal: () => void;
  refreshLeaves: () => void;
};

const currentDate =
  new Date(new Date().toISOString()).toLocaleDateString("sv-SE") ?? "";

const initialState = {
  employeeName: "",
  leaveSubject: "",
  date: currentDate,
  leaveReason: "",
};

export const AddLeave = ({ setModal, refreshLeaves }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const isAdmin = currentUser?.role;

  const token = currentUser?.token;

  const [allUsers, setAllUsers] = useState([]);

  const [addLeave, setAddLeave] = useState(initialState);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAddLeave({ ...addLeave, [name]: value });
  };
  const { employeeName, ...leaveData } = addLeave;

  console.log(leaveData);

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: {
          Authorization: token,
        },
      });
      setAllUsers(res?.data?.users);
    } catch (error) {
      console.log(error);
    }
  }, [token]);
  console.log("submitted", addLeave);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/addLeave/${employeeName}`,
        { employeeName, ...leaveData },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      refreshLeaves();
      setModal();
    } catch (error) {
      console.log(error);
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
            <Title setModal={() => setModal()}>Add Leave</Title>
            <div className="mx-2   flex-wrap gap-3  ">
              {isAdmin === "admin" && (
                <UserSelect
                  labelName="Employee Name*"
                  name="employeeName"
                  value={addLeave.employeeName}
                  handlerChange={handlerChange}
                  optionData={allUsers}
                />
              )}

              {isAdmin === "user" && (
                <InputField
                  labelName="Employee*"
                  name=""
                  placeHolder="Enter Leave subject"
                  inputVal={
                    currentUser?.role === "user" ? currentUser?.name : ""
                  }
                  handlerChange={handlerChange}
                />
              )}

              <InputField
                labelName="Subject Leave*"
                name="leaveSubject"
                placeHolder="Enter Leave subject"
                inputVal={addLeave.leaveSubject}
                handlerChange={handlerChange}
              />
              <InputField
                labelName="Date*"
                placeHolder="Enter the Company Name"
                type="Date"
                name="date"
                inputVal={addLeave.date}
                handlerChange={handlerChange}
              />

              <TextareaField
                labelName="Leave Reason*"
                placeHolder="Enter the Leave Reason"
                name="leaveReason"
                inputVal={addLeave.leaveReason}
                handlerChange={handlerChange}
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Save Leave"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


