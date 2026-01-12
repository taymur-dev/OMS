import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type AddOvertimeProps = {
  setModal: () => void;
  refreshOvertime?: () => void;
};

type AddOvertimeType = {
  employee_id: string;
  date: string;
  time: string;
  description: string;
};

type UserT = {
  id: number;
  employeeName?: string;
  name?: string;
  loginStatus?: string;
  role?: string;
};

const currentDate = new Date().toLocaleDateString("sv-SE", {
  timeZone: "Asia/Karachi",
});

const initialState: AddOvertimeType = {
  employee_id: "",
  date: currentDate,
  time: "00:00:00",
  description: "",
};

export const AddOverTime = ({
  setModal,
  refreshOvertime,
}: AddOvertimeProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [addOvertime, setAddOvertime] = useState<AddOvertimeType>(initialState);

  const [allUsers, setAllUsers] = useState<UserT[]>([]);

  const getAllUsers = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllUsers(res.data?.users ?? []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    if (!currentUser || !token) return;

    if (!isAdmin) {
      setAddOvertime((prev) => ({
        ...prev,
        employee_id: String(currentUser.id),
      }));
    } else {
      getAllUsers();
    }
  }, [currentUser, token, isAdmin, getAllUsers]);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setAddOvertime((prev) => ({ ...prev, [name]: value }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(
        `${BASE_URL}/api/createOvertime`,
        {
          date: addOvertime.date,
          time: addOvertime.time,
          description: addOvertime.description,
          ...(isAdmin && { employee_id: addOvertime.employee_id }),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Overtime added successfully");
      refreshOvertime?.();
      setModal();
      setAddOvertime(initialState);
    } catch (err) {
      console.error("Add overtime failed:", err);
      toast.error("Failed to add overtime");
    }
  };

  const userOptions = allUsers
    .filter((u) => u.loginStatus === "Y" && u.role === "user")
    .map((u) => ({
      id: u.id,
      value: String(u.id),
      label: u.employeeName || u.name || "User",
      name: u.employeeName || u.name || "User",
      loginStatus: u.loginStatus || "Y",
      projectName: "",
    }));

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur flex items-center justify-center z-10">
      <div className="w-[42rem] bg-white rounded-xl border border-indigo-500">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={setModal}>Add Overtime</Title>

          <div className="mx-2 space-y-2">
            {isAdmin && (
              <UserSelect
                labelName="Employee*"
                name="employee_id"
                value={addOvertime.employee_id}
                handlerChange={handlerChange}
                optionData={userOptions}
              />
            )}

            <InputField
              labelName="Date*"
              type="date"
              name="date"
              value={addOvertime.date}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Overtime (HH:MM:SS)*"
              name="time"
              value={addOvertime.time}
              handlerChange={handlerChange}
            />

            <TextareaField
              labelName="Description*"
              name="description"
              inputVal={addOvertime.description}
              handlerChange={handlerChange}
              placeHolder="Write overtime details..."
            />
          </div>

          <div className="flex justify-center gap-2 m-2">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save Overtime" />
          </div>
        </form>
      </div>
    </div>
  );
};
