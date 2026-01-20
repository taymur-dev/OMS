import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

export type TodoType = {
  id: number;
  employee_id: number;
  employeeName?: string;
  name: string;
  task: string;
  startDate: string;
  endDate: string;
  note: string;
  deadline: string;
};

type UserT = {
  id: number;
  name?: string;
  employeeName?: string;
  loginStatus?: string;
};

type UserOption = {
  id: number;
  value: string;
  label: string;
  name: string;
  loginStatus: string;
  projectName: string;
};

type UpdateTodoProps = {
  setModal: () => void;
  seleteTodo: TodoType | null;
  onUpdate: (updatedTodo: TodoType) => void;
};

export const UpdateTodo = ({
  setModal,
  seleteTodo,
  onUpdate,
}: UpdateTodoProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [todo, setTodo] = useState<TodoType | null>(seleteTodo);
  const [allUsers, setAllUsers] = useState<UserT[]>([]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setTodo((prev) =>
      prev
        ? { ...prev, [name]: name === "employee_id" ? Number(value) : value }
        : prev
    );
  };

  const getAllUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res?.data?.users ?? []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, [token]);

  useEffect(() => {
    if (!seleteTodo) return;

    const formatDate = (date?: string) => (date ? date.split("T")[0] : "");

    setTodo({
      ...seleteTodo,
      startDate: formatDate(seleteTodo.startDate),
      endDate: formatDate(seleteTodo.endDate),
      deadline: formatDate(seleteTodo.deadline),
    });
  }, [seleteTodo]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo?.id) return;

    try {
      await axios.put(
        `${BASE_URL}/api/admin/updateTodo/${todo.id}`,
        {
          employee_id: todo.employee_id,
          task: todo.task,
          note: todo.note,
          startDate: todo.startDate,
          endDate: todo.endDate,
          deadline: todo.deadline,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdate({ ...todo });
      setModal();
    } catch (error) {
      console.error("Update Todo Error:", error);
    }
  };

  const userOptions: UserOption[] = allUsers.map((u) => ({
    id: u.id,
    value: String(u.id),
    label: u.employeeName || u.name || "User",
    name: u.employeeName || u.name || "User",
    loginStatus: u.loginStatus || "",
    projectName: "",
  }));

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[30rem] bg-white mx-auto rounded-xl border border-indigo-900 ">
        <form onSubmit={handleSubmit}>
          <div className="bg-indigo-900 rounded-t-xl px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Edit Todo
            </Title>
          </div>
          <div className="mx-2 flex flex-col  py-2 gap-3">
            <UserSelect
              labelName="Employees*"
              name="employee_id"
              value={todo?.employee_id?.toString() || ""}
              handlerChange={handlerChange}
              optionData={userOptions}
            />

            <InputField
              labelName="Task*"
              name="task"
              handlerChange={handlerChange}
              value={todo?.task}
            />
            <InputField
              labelName="Note*"
              name="note"
              handlerChange={handlerChange}
              value={todo?.note}
            />

            <div className="flex flex-wrap items-center justify-center gap-6">
              <InputField
                labelName="Start Date*"
                type="date"
                name="startDate"
                handlerChange={handlerChange}
                value={todo?.startDate}
              />
              <InputField
                labelName="End Date*"
                type="date"
                name="endDate"
                handlerChange={handlerChange}
                value={todo?.endDate}
              />
              <InputField
                labelName="Deadline*"
                type="date"
                name="deadline"
                handlerChange={handlerChange}
                value={todo?.deadline}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update" />
          </div>
        </form>
      </div>
    </div>
  );
};
