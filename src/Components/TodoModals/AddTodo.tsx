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
import { TextareaField } from "../InputFields/TextareaField";

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
  const [loading, setLoading] = useState(false);

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "task") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
    }

    if (name === "note") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 250);
    }

    setAddTodo((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !addTodo.task ||
      !addTodo.startDate ||
      !addTodo.endDate ||
      !addTodo.deadline
    ) {
      toast.error("Please fill all required fields", {
        toastId: "required-fields",
      });
      return;
    }

    if (
      new Date(addTodo.startDate) > new Date(addTodo.deadline) &&
      new Date(addTodo.endDate) > new Date(addTodo.deadline)
    ) {
      toast.error("Start Date and End Date cannot be later than Deadline", {
        toastId: "date-validation",
      });
      return;
    }

    if (new Date(addTodo.startDate) > new Date(addTodo.endDate)) {
      toast.error("Start Date cannot be later than End Date", {
        toastId: "date-validation",
      });
      return;
    }

    if (new Date(addTodo.startDate) > new Date(addTodo.deadline)) {
      toast.error("Start Date cannot be later than Deadline", {
        toastId: "date-validation",
      });
      return;
    }

    if (new Date(addTodo.endDate) > new Date(addTodo.deadline)) {
      toast.error("End Date cannot be later than Deadline", {
        toastId: "date-validation",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/api/admin/createTodo`, addTodo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Todo added successfully", { toastId: "success" });
      getAllTodos();
      setModal();
      setAddTodo(initialState);
    } catch (err: unknown) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        if (
          err.response?.status === 400 &&
          err.response?.data?.message.includes("already exists")
        ) {
          toast.error(err.response.data.message, { toastId: "duplicate-task" });
        } else {
          toast.error("Failed to add todo", { toastId: "failed" });
        }
      } else {
        toast.error("An unexpected error occurred", {
          toastId: "unexpected-error",
        });
      }
    } finally {
      setLoading(false);
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur flex items-center px-4  justify-center z-50">
      <div className="w-[42rem] max-h-[35rem] bg-white rounded border border-indigo-900">
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              ADD TODO
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  py-2 gap-3">
            {isAdmin && (
              <UserSelect
                labelName="Employees *"
                name="employee_id"
                value={addTodo.employee_id}
                handlerChange={handleChange}
                optionData={userOptions}
              />
            )}

            <InputField
              labelName="Task *"
              name="task"
              value={addTodo.task}
              handlerChange={handleChange}
            />

            <InputField
              labelName="Start Date *"
              name="startDate"
              type="date"
              value={addTodo.startDate}
              handlerChange={handleChange}
            />
            <InputField
              labelName="End Date *"
              name="endDate"
              type="date"
              value={addTodo.endDate}
              handlerChange={handleChange}
            />

            <div className="md:col-span-2">
              <InputField
                labelName="Deadline *"
                name="deadline"
                type="date"
                value={addTodo.deadline}
                handlerChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <TextareaField
                labelName="Note *"
                name="note"
                inputVal={addTodo.note}
                handlerChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 py-3 rounded bg-indigo-900  border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton loading={loading} label={loading ? "Saving" : "Save"} />
          </div>
        </form>
      </div>
    </div>
  );
};
