import React, { useState, useEffect } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type EditCalendarSessionProps = {
  setModal: () => void;
  refreshCalendar: () => void;
  selectedSession: {
    id?: number;
    session_name: string;
    year: string;
    month: string;
  };
};

export const EditCalendarSession = ({
  setModal,
  refreshCalendar,
  selectedSession,
}: EditCalendarSessionProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [editCalendar, setEditCalendar] = useState<{
    session_name: string;
    startingMonth: Date | null;
  }>({
    session_name: "",
    startingMonth: null,
  });

  const [loading, setLoading] = useState(false);

  // Prefill Data
  useEffect(() => {
    if (selectedSession) {
      const monthIndex = new Date(
        `${selectedSession.month} 1, ${selectedSession.year}`,
      );

      setEditCalendar({
        session_name: selectedSession.session_name,
        startingMonth: monthIndex,
      });
    }
  }, [selectedSession]);

  const handlerChange = (e: {
    target: { name: string; value: Date | null };
  }) => {
    const { name, value } = e.target;
    setEditCalendar((prev) => ({ ...prev, [name]: value }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (!editCalendar.session_name.trim()) {
        toast.error("Please enter session name");
        setLoading(false);
        return;
      }

      if (!editCalendar.startingMonth) {
        toast.error("Please select a month");
        setLoading(false);
        return;
      }

      const year = editCalendar.startingMonth
        .getFullYear()
        .toString();

      const month = editCalendar.startingMonth.toLocaleString("default", {
        month: "long",
      });

      const formattedData = {
        session_name: editCalendar.session_name.trim(),
        year,
        month,
      };

      await axios.put(
        `${BASE_URL}/api/admin/updateCalendarSession/${selectedSession.id}`,
        formattedData,
        {
          headers: {
            Authorization: token,
          },
        },
      );

      toast.success("Calendar session updated successfully");
      refreshCalendar();
      setModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again",
        );
      } else {
        toast.error("Unexpected error occurred");
      }

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-50"
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded border border-indigo-900">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                EDIT CALENDAR SESSION
              </Title>
            </div>

            <div className="px-2 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Session Name */}
                <div className="flex flex-col">
                  <label className="text-gray-700 text-sm font-semibold mb-2">
                    Session Name *
                  </label>
                  <input
                    type="text"
                    name="session_name"
                    value={editCalendar.session_name}
                    onChange={(e) =>
                      setEditCalendar((prev) => ({
                        ...prev,
                        session_name: e.target.value,
                      }))
                    }
                    placeholder="Enter Session Name"
                    className="border border-gray-300 px-3 py-2.5 rounded-lg w-full text-gray-800 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>

                {/* Starting Month */}
                <div className="flex flex-col">
                  <label className="text-gray-700 text-sm font-semibold mb-2">
                    Starting Month *
                  </label>
                  <DatePicker
                    selected={editCalendar.startingMonth}
                    onChange={(date: Date | null) =>
                      handlerChange({
                        target: { name: "startingMonth", value: date },
                      })
                    }
                    dateFormat="yyyy-MM"
                    showMonthYearPicker
                    className="border border-gray-300 px-3 py-2.5 rounded-lg w-full text-gray-800 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
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
    </>
  );
};
