import React, { useCallback, useEffect, useState } from "react";

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
  task: "",
  note: "",
  startDate: currentDate,
  endDate: currentDate,
  deadline: currentDate,
};
export const AddAdvanceSalary = ({ setModal }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [addTodo, setAddTodo] = useState(initialState);

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

    setAddTodo({ ...addTodo, [name]: value });
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
      console.log(error);
    }
  } , [token]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/admin/createTodo`, addTodo, {
        headers: {
          Authorization: token,
        },
      });

      console.log(res.data);
      setModal();

      toast.success("Todo submitted successfully");
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
        <div className="w-[42rem] max-h-[28rem]  bg-white mx-auto rounded-xl border  border-indigo-500 ">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={() => setModal()}>Add Advance Salary</Title>
            <div className="mx-2 flex-wrap gap-3  ">
              {currentUser?.role === "admin" && (
                <UserSelect
                  labelName="Employees*"
                  name="employeeId"
                  value={addTodo.employeeId}
                  handlerChange={handlerChange}
                  optionData={allUsers}
                />
              )}
              {currentUser?.role === "user" && (
                <InputField
                  labelName="Employee*"
                  name="employeeId"
                  handlerChange={handlerChange}
                  value={
                    currentUser?.role === "user"
                      ? currentUser.name
                      : addTodo.employeeId
                  }
                />
              )}
              <InputField
                labelName="Date*"
                type="date"
                name="startDate"
                handlerChange={handlerChange}
                value={addTodo.startDate}
              />

              <TextareaField
                labelName="Note*"
                name="note"
                handlerChange={handlerChange}
                inputVal={addTodo.note}
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Save Advance Salary"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
