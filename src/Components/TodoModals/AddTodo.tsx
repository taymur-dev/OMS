import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type AddTodoProps = {
  setModal: () => void;
  getAllTodos: () => void;
};

type UserT = {
  id: number;
  name?: string;
  employeeName?: string;
  loginStatus?: string;
  role: string; 
};

type UserOption = {
  id: number;
  value: string;
  label: string;
  name: string; 
  loginStatus: string; 
  projectName: string;
  role: string;
};

const today = new Date();
const currentDate = today.toLocaleDateString("en-CA");


const initialState = {
  employee_id: "",
  task: "",
  note: "",
  startDate: currentDate,
  endDate: currentDate,
  deadline: currentDate,
};

export const AddTodo = ({ setModal, getAllTodos }: AddTodoProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [addTodo, setAddTodo] = useState(initialState);
  const [allUsers, setAllUsers] = useState<UserT[]>([]);

  useEffect(() => {
    if (!isAdmin && currentUser?.id) {
      setAddTodo((prev) => ({
        ...prev,
        employee_id: currentUser.id.toString(),
      }));
    }
  }, [currentUser, isAdmin]);

  const getAllUsers = useCallback(async () => {
    if (!token || !isAdmin) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res.data?.users ?? []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, [token, isAdmin]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddTodo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !addTodo.task ||
      !addTodo.startDate ||
      !addTodo.endDate ||
      !addTodo.deadline
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/admin/createTodo`, addTodo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Todo added successfully");
      getAllTodos();
      setModal();
      setAddTodo(initialState);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add todo");
    }
  };

  const userOptions: UserOption[] = allUsers
    .filter((u) => u.role === "user" && u.loginStatus === "Y")
    .map((u) => ({
      id: u.id,
      value: String(u.id),
      label: u.employeeName || u.name || "User",
      name: u.employeeName || u.name || "User",
      loginStatus: u.loginStatus ?? "Y",
      projectName: "", 
      role: u.role, 
    }));

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[28rem] bg-white rounded-xl border border-indigo-500 overflow-auto">
        <form onSubmit={handleSubmit}>
          <Title setModal={setModal}>Add Todo</Title>

          <div className="mx-2 flex flex-col gap-3">
            {isAdmin && (
              <UserSelect
                labelName="Employees*"
                name="employee_id"
                value={addTodo.employee_id}
                handlerChange={handleChange}
                optionData={userOptions}
              />
            )}

            <InputField
              labelName="Task*"
              name="task"
              value={addTodo.task}
              handlerChange={handleChange}
            />

            <InputField
              labelName="Note*"
              name="note"
              value={addTodo.note}
              handlerChange={handleChange}
            />

            <div className="flex flex-wrap gap-4">
              <InputField
                labelName="Start Date*"
                name="startDate"
                type="date"
                value={addTodo.startDate}
                handlerChange={handleChange}
              />
              <InputField
                labelName="End Date*"
                name="endDate"
                type="date"
                value={addTodo.endDate}
                handlerChange={handleChange}
              />
              <InputField
                labelName="Deadline*"
                name="deadline"
                type="date"
                value={addTodo.deadline}
                handlerChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-center gap-2 m-2">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save Todo" />
          </div>
        </form>
      </div>
    </div>
  );
};
