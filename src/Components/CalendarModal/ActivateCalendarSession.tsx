import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import { Title } from "../Title";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

export type CalendarStatus = "Active" | "InActive" | "Processing";

interface CalendarSession {
  id: number;
  session_name: string;
  year: string;
  month: string;
  calendarStatus: CalendarStatus;
}

interface ActivateCalendarSessionProps {
  setModal: () => void;
  refreshSessions: (sessions?: CalendarSession[]) => Promise<void>

}

const currentYear = new Date().getFullYear();

const initialState = {
  session_name: "",
  year: String(currentYear),
  month: "",
};

const months = [
  { id: 1, label: "January", value: "January" },
  { id: 2, label: "February", value: "February" },
  { id: 3, label: "March", value: "March" },
  { id: 4, label: "April", value: "April" },
  { id: 5, label: "May", value: "May" },
  { id: 6, label: "June", value: "June" },
  { id: 7, label: "July", value: "July" },
  { id: 8, label: "August", value: "August" },
  { id: 9, label: "September", value: "September" },
  { id: 10, label: "October", value: "October" },
  { id: 11, label: "November", value: "November" },
  { id: 12, label: "December", value: "December" },
];

export const ActivateCalendarSession = ({
  setModal,
  refreshSessions,
}: ActivateCalendarSessionProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [formData, setFormData] = useState(initialState);
  const [sessions, setSessions] = useState<CalendarSession[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get<CalendarSession[]>(
          `${BASE_URL}/api/admin/getCalendarSession`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const uniqueSessions = [
          ...new Map(
            res.data.map((item) => [item.session_name, item]),
          ).values(),
        ];

        setSessions(uniqueSessions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSessions();
  }, [token]);

  const handlerChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
) => {
  const { name, value } = e.target;

  let updatedValue = value;

  if (name === "year") {
    updatedValue = value.replace(/[^0-9]/g, "").slice(0, 4);
  }

  setFormData({ ...formData, [name]: updatedValue });
};


  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!formData.session_name || !formData.year || !formData.month) {
    return toast.error("Please fill in all required fields", {
      toastId: "activate-session-validation",
    });
  }

  if (!token) {
    return toast.error("Unauthorized", {
      toastId: "activate-session-unauthorized",
    });
  }

  setLoading(true);

  try {
    await axios.post(
      `${BASE_URL}/api/admin/activate-calendar-session`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    toast.success("Calendar session activated successfully", {
      toastId: "activate-session-success",
    });

    const res = await axios.get<CalendarSession[]>(
      `${BASE_URL}/api/admin/getCalendarSession`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const updatedSessions = res.data;

    await refreshSessions(updatedSessions);

  
    setModal();
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message || "Failed to activate calendar session",
        { toastId: "activate-session-error" },
      );
    } else {
      toast.error("Something went wrong", {
        toastId: "activate-session-error-unknown",
      });
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <div
        className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-50"
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <div className="w-[40rem] bg-white mx-auto rounded border border-indigo-900">
          <form onSubmit={handlerSubmit}>
            <div className="bg-indigo-900 rounded px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                ACTIVATE CALENDAR SESSION
              </Title>
            </div>

            <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 py-4 gap-4">
              <div className="md:col-span-2">
                <OptionField
                  labelName="Session Name *"
                  name="session_name"
                  value={formData.session_name}
                  handlerChange={handlerChange}
                  optionData={sessions.map((s) => ({
                    id: s.id,
                    label: s.session_name,
                    value: s.session_name,
                  }))}
                  inital="Select Session"
                />
              </div>

              <InputField
                labelName="Year *"
                type="text"
                name="year"
                value={formData.year}
                handlerChange={handlerChange}
              />

              <OptionField
                labelName="Month *"
                name="month"
                value={formData.month}
                handlerChange={handlerChange}
                optionData={months}
                inital="Select Month"
              />
            </div>

            <div className="flex justify-end gap-3 px-4 py-3 bg-indigo-900 border-t border-indigo-900">
              <CancelBtn setModal={setModal} />
              <AddButton
                loading={loading}
                label={loading ? "Activating" : "Activate"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
