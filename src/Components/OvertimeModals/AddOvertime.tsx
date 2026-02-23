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

import { AxiosError } from "axios";

interface BackendError {
  message: string;
}

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
  const [loading, setLoading] = useState(false);

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
    >,
  ) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "description") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
    }

    if (name === "time") {
      let cleaned = value.replace(/[^0-9]/g, "");

      if (cleaned.length > 6) cleaned = cleaned.slice(0, 6);

      const hours = cleaned.slice(0, 2);
      const minutes = cleaned.slice(2, 4);
      const seconds = cleaned.slice(4, 6);

      updatedValue = [hours, minutes, seconds].filter(Boolean).join(":");
    }

    setAddOvertime((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      (isAdmin && !addOvertime.employee_id) ||
      !addOvertime.date ||
      !addOvertime.time ||
      !addOvertime.description
    ) {
      return toast.error("All fields are required", {
        toastId: "overtime-required",
      });
    }

    const validateTime = (time: string) => {
      const regex = /^(\d{1,2}):([0-5]?\d):([0-5]?\d)$/;
      const match = time.match(regex);

      if (!match) return false;

      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const seconds = parseInt(match[3], 10);

      // hours must be 0-24, minutes 0-59, seconds 0-59
      if (hours > 24) return false;
      if (minutes > 59) return false;
      if (seconds > 59) return false;

      // Reject 00:00:00
      if (hours === 0 && minutes === 0 && seconds === 0) return false;

      return true;
    };

    setLoading(true);

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
        },
      );

      if (!validateTime(addOvertime.time)) {
        toast.error(
          "Invalid overtime! Hours: 0-24, Minutes/Seconds: 0-59, cannot be 00:00:00",
        );
        setLoading(false);
        return;
      }

      toast.success("Overtime added successfully");
      refreshOvertime?.();
      setModal();
      setAddOvertime(initialState);
    } catch (err) {
      const axiosError = err as AxiosError<BackendError>;
      const msg =
        axiosError.response?.data?.message || "Failed to add overtime";

      console.error("Add overtime failed:", err);
      toast.error(msg);
    } finally {
      setLoading(false);
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
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur px-4  flex items-center justify-center z-50"
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      <div className="w-[42rem] bg-white rounded border border-indigo-900">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              ADD OVERTIME
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-5 space-y-2">
            {isAdmin && (
              <UserSelect
                labelName="Employee *"
                name="employee_id"
                value={addOvertime.employee_id}
                handlerChange={handlerChange}
                optionData={userOptions}
              />
            )}

            <InputField
              labelName="Date *"
              type="date"
              name="date"
              value={addOvertime.date}
              handlerChange={handlerChange}
            />
            <div className="md:col-span-2">
              <InputField
                labelName="Overtime (HH:MM:SS) *"
                name="time"
                value={addOvertime.time}
                handlerChange={handlerChange}
              />
            </div>
            <div className="md:col-span-2">
              <TextareaField
                labelName="Description *"
                name="description"
                inputVal={addOvertime.description}
                handlerChange={handlerChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton loading={loading} label={loading ? "Saving" : "Save"} />
          </div>
        </form>
      </div>
    </div>
  );
};
