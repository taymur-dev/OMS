import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";

import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";
import { OptionField } from "../InputFields/OptionField";
import { UserSelect } from "../InputFields/UserSelect";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

import { AxiosError } from "axios";

interface BackendError {
  message: string;
}

type UpdateOvertimeData = {
  id: number;
  employeeId: number;
  date: string;
  time: string;
  description: string;
  status: string;
};

type User = {
  id: number;
  name: string;
  role?: string;
  loginStatus?: string;
};

type SelectOption = {
  value: string;
  label: string;
};

type UpdateOvertimeProps = {
  setModal: () => void;
  EditOvertime: UpdateOvertimeData | null;
  refreshOvertimes: () => Promise<void>;
};

const optionData = [
  { id: 1, label: "Approved", value: "approved" },
  { id: 2, label: "Rejected", value: "rejected" },
  { id: 3, label: "Pending", value: "pending" },
];

const currentDate = new Date().toLocaleDateString("sv-SE", {
  timeZone: "Asia/Karachi",
});

export const UpdateOverTime = ({
  setModal,
  EditOvertime,
  refreshOvertimes,
}: UpdateOvertimeProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  /* ------------------ STATE ------------------ */
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    date: currentDate,
    time: "00:00:00",
    description: "",
    status: "pending",
  });

  /* ------------------ PREFILL FORM ------------------ */
  useEffect(() => {
    if (!EditOvertime) return;

    setFormData({
      employeeId: String(EditOvertime.employeeId),
      date: new Date(EditOvertime.date).toLocaleDateString("sv-SE", {
        timeZone: "Asia/Karachi",
      }),
      time: EditOvertime.time,
      description: EditOvertime.description,
      status: EditOvertime.status?.toLowerCase() || "pending",
    });
  }, [EditOvertime]);

  /* ------------------ GET USERS ------------------ */
  const getAllUsers = useCallback(async () => {
    if (currentUser?.role !== "admin") return;

    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      setAllUsers(res.data?.users || []);
    } catch (error) {
      console.error(error);
    }
  }, [currentUser]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  /* ------------------ MAP USERS FOR SELECT ------------------ */
  const userOptions: SelectOption[] = useMemo(() => {
    return allUsers
      .filter((user) => user.loginStatus === "Y" && user.role === "user")
      .map((user) => ({
        value: String(user.id),
        label: user.name,
      }));
  }, [allUsers]);

  /* ------------------ HANDLERS ------------------ */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "description" && e.isTrusted) {
      // isTrusted = user input
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EditOvertime) return;

    setLoading(true);

    try {
      const payload = {
        employeeId: Number(formData.employeeId),
        date: formData.date,
        time: formData.time,
        description: formData.description,
        status: formData.status,
      };

      await axios.put(
        `${BASE_URL}/api/admin/updateOvertime/${EditOvertime.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${currentUser?.token}` },
        },
      );

      if (!validateTime(formData.time)) {
        toast.error(
          "Invalid overtime! Hours: 0-24, Minutes/Seconds: 0-59, cannot be 00:00:00",
        );
        setLoading(false);
        return;
      }

      toast.success("Overtime updated successfully!");
      await refreshOvertimes();
      setModal();
    } catch (error) {
      const axiosError = error as AxiosError<BackendError>;
      const msg =
        axiosError.response?.data?.message || "Failed to update overtime.";

      console.error(error);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex px-4  items-center justify-center z-50"
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      <div className="w-[42rem] max-h-[85vh] bg-white rounded border border-indigo-300 shadow-xl overflow-hidden">
        {currentUser?.role !== "admin" ? (
          <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
            <p className="text-red-600 font-semibold text-lg">
              Only admins can edit overtime.
            </p>

            <button
              onClick={setModal}
              className="mt-6 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-900 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Header */}
            <div className="bg-indigo-900 rounded-t-lg px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                EDIT OVERTIME
              </Title>
            </div>

            <div className="mx-2 p-6 grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              <UserSelect
                labelName="Employee *"
                name="employeeId"
                value={formData.employeeId}
                handlerChange={handleChange}
                optionData={userOptions}
              />

              <InputField
                labelName="Date *"
                type="date"
                name="date"
                value={formData.date}
                handlerChange={handleChange}
              />

              <InputField
                labelName="Overtime Hours *"
                name="time"
                value={formData.time}
                handlerChange={handleChange}
              />

              <OptionField
                labelName="Status"
                name="status"
                value={formData.status}
                handlerChange={handleChange}
                optionData={optionData}
                inital="Pending"
              />

              {/* Responsive Full width textarea */}
              <div className="md:col-span-2">
                <TextareaField
                  labelName="Description *"
                  name="description"
                  inputVal={formData.description}
                  handlerChange={handleChange}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 bg-indigo-900 border-t border-indigo-800">
              <CancelBtn setModal={setModal} />
              <AddButton
                loading={loading}
                label={loading ? "Updating" : "Update"}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
