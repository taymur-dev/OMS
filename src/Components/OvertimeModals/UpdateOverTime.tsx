import React, { useEffect, useState } from "react";

import { AddButton } from "../CustomButtons/AddButton";

import { CancelBtn } from "../CustomButtons/CancelBtn";

import { Title } from "../Title";

import { UserSelect } from "../InputFields/UserSelect";

import axios from "axios";

import { BASE_URL } from "../../Content/URL";

import { useAppSelector } from "../../redux/Hooks";

import { InputField } from "../InputFields/InputField";

import { toast } from "react-toastify";

import { TextareaField } from "../InputFields/TextareaField";

type AddAttendanceProps = {
  setModal: () => void;
};

const currentDate =
  new Date(new Date().toISOString()).toLocaleDateString("sv-SE") ?? "";

const initialState = {
  employeeId: "",
  time: "00:00:00",
  date: currentDate,
  description: "",
};
export const UpdateOverTime = ({ setModal }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [addOverTime, setAddOverTime] = useState(initialState);

  const [allUsers, setAllUsers] = useState([]);

  const token = currentUser?.token;

  const isAdmin = currentUser?.role;

  console.log("res", isAdmin);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    e.preventDefault();

    const { name, value } = e.target;

    setAddOverTime({ ...addOverTime, [name]: value });
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
      console.log(error);
    }
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/admin/createTodo`,
        addOverTime,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log(res.data);
      setModal();

      toast.success("Todo submitted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[28rem]  bg-white mx-auto rounded-xl border  border-indigo-500 ">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={() => setModal()}>Update OverTime</Title>
            <div className="mx-2 flex-wrap gap-3  ">
              {currentUser?.role === "admin" && (
                <UserSelect
                  labelName="Employees*"
                  name="employeeId"
                  value={addOverTime.employeeId}
                  handlerChange={handlerChange}
                  optionData={allUsers}
                />
              )}
              {currentUser?.role === "user" && (
                <InputField
                  labelName="Employee*"
                  name="employeeId"
                  handlerChange={handlerChange}
                  inputVal={
                    currentUser?.role === "user"
                      ? currentUser.name
                      : addOverTime.employeeId
                  }
                />
              )}

              <InputField
                labelName="Date*"
                type="date"
                name="date"
                handlerChange={handlerChange}
                inputVal={addOverTime.date}
              />

              <InputField
                labelName="Over time*"
                name="time"
                handlerChange={handlerChange}
                inputVal={addOverTime.time}
              />

              <TextareaField
                labelName="Description*"
                name="description"
                handlerChange={handlerChange}
                placeHolder="write here detail..."
                inputVal={addOverTime.description}
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Updated Time"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
