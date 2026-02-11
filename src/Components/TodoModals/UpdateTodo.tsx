import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import { TextareaField } from "../InputFields/TextareaField";
import { toast } from "react-toastify";

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
  completionStatus: string;
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

const StatusOptions: { id: number; label: string; value: string }[] = [
  { id: 1, label: "Completed", value: "Completed" },
  { id: 2, label: "Defer", value: "Defer" },
  { id: 2, label: "Pending", value: "Pending" },
];

export const UpdateTodo = ({
  setModal,
  seleteTodo,
  onUpdate,
}: UpdateTodoProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [todo, setTodo] = useState<TodoType | null>(seleteTodo);
    const [loading, setLoading] = useState(false);

  const [allUsers, setAllUsers] = useState<UserT[]>([]);

  const handlerChange = (
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

    setTodo((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === "employee_id" ? Number(updatedValue) : updatedValue,
          }
        : prev,
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

    if (
      !todo.task ||
      !todo.startDate ||
      !todo.endDate ||
      !todo.deadline ||
      !todo.note ||
      (isAdmin && !todo.employee_id)
    ) {
      return toast.error(
        "Please fill all required fields (Task, Dates, Note, Employee)",
        { toastId: "required-fields" },
      );
    }

        setLoading(true);

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
          completionStatus: todo.completionStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      onUpdate({ ...todo });

      toast.success("Todo updated successfully!", {
        toastId: "update-success",
      });
      setModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to update Todo!";
        toast.error(message, { toastId: "update-error" });
      } else {
        toast.error("Something went wrong!", { toastId: "update-error" });
      }
    } finally {
      setLoading(false);
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
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[30rem] bg-white mx-auto rounded border border-indigo-900 ">
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
              EDIT TODO
            </Title>
          </div>
          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  py-2 gap-3">
            {isAdmin && (
              <UserSelect
                labelName="Employees *"
                name="employee_id"
                value={todo?.employee_id?.toString() || ""}
                handlerChange={handlerChange}
                optionData={userOptions}
              />
            )}

            <InputField
              labelName="Task *"
              name="task"
              handlerChange={handlerChange}
              value={todo?.task}
            />

            <InputField
              labelName="Start Date *"
              type="date"
              name="startDate"
              handlerChange={handlerChange}
              value={todo?.startDate}
            />
            <InputField
              labelName="End Date *"
              type="date"
              name="endDate"
              handlerChange={handlerChange}
              value={todo?.endDate}
            />
            <InputField
              labelName="Deadline *"
              type="date"
              name="deadline"
              handlerChange={handlerChange}
              value={todo?.deadline}
            />

            <OptionField
              labelName="Completion Status"
              name="completionStatus"
              value={todo?.completionStatus || ""}
              handlerChange={handlerChange}
              optionData={StatusOptions}
              inital="Select Completion Status"
            />
            <div className="md:col-span-2">
              <TextareaField
                labelName="Note *"
                name="note"
                inputVal={todo?.note || ""}
                handlerChange={handlerChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={loading ? "Updating" : "Update"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
