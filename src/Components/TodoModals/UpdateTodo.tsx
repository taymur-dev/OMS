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
  name: string;
  task: string;
  startDate: string;
  endDate: string;
  note: string;
  deadline: string;
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
  const [allUsers, setAllUsers] = useState<{ id: number; name: string }[]>([]);

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
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: token },
      });
      setAllUsers(res?.data?.users);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

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
        { headers: { Authorization: token } }
      );

      onUpdate({ ...todo });
      setModal();
    } catch (error) {
      console.error("Update Todo Error:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[28rem] bg-white mx-auto rounded-xl border border-indigo-500">
        <form onSubmit={handleSubmit}>
          <Title setModal={setModal}>Update Todo</Title>
          <div className="mx-2 flex-wrap gap-3">
            <UserSelect
              labelName="Employees*"
              name="employee_id"
              value={todo?.employee_id?.toString() || ""}
              handlerChange={handlerChange}
              optionData={allUsers.map((u) => ({
                id: u.id,
                name: u.name,
                loginStatus: "",
                projectName: "",
              }))}
            />
            <InputField
              labelName="Task*"
              name="task"
              handlerChange={handlerChange}
              inputVal={todo?.task}
            />
            <InputField
              labelName="Note*"
              name="note"
              handlerChange={handlerChange}
              inputVal={todo?.note}
            />

            <div className="flex items-center justify-center gap-6">
              <InputField
                labelName="Start Date*"
                type="date"
                name="startDate"
                handlerChange={handlerChange}
                inputVal={todo?.startDate}
              />
              <InputField
                labelName="End Date*"
                type="date"
                name="endDate"
                handlerChange={handlerChange}
                inputVal={todo?.endDate}
              />
              <InputField
                labelName="Deadline*"
                type="date"
                name="deadline"
                handlerChange={handlerChange}
                inputVal={todo?.deadline}
              />
            </div>
          </div>

          <div className="flex items-center justify-center m-2 gap-2 text-xs">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update Todo" />
          </div>
        </form>
      </div>
    </div>
  );
};
