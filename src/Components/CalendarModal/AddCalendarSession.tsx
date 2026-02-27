import React, { useState } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type AddAttendanceProps = {
  setModal: () => void;
  refreshCalendar: () => void;
};

const initialState = {
  session_name: "",
  startingMonth: new Date(),
};

export const AddCalendarSession = ({
  setModal,
  refreshCalendar,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addCalendar, setAddCalendar] = useState<{
    session_name: string;
    startingMonth: Date | null;
  }>(initialState);

  const [loading, setLoading] = useState(false);

  const handlerChange = (e: {
    target: { name: string; value: Date | null };
  }) => {
    const { name, value } = e.target;
    setAddCalendar((prev) => ({ ...prev, [name]: value }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (!addCalendar.session_name.trim()) {
        toast.error("Please enter session name");
        setLoading(false);
        return;
      }

      if (!addCalendar.startingMonth) {
        toast.error("Please select a month");
        return;
      }

      const year = addCalendar.startingMonth.getFullYear().toString();
      const month = addCalendar.startingMonth.toLocaleString("default", {
        month: "long",
      });

      const formattedData = {
        session_name: addCalendar.session_name.trim(),
        year,
        month,
        calendarStatus: "Active",
      };

      await axios.post(
        `${BASE_URL}/api/admin/addCalendarSession`,
        formattedData,
        {
          headers: {
            Authorization: token,
          },
        },
      );

      toast.success("Calendar session added successfully");
      refreshCalendar();
      setModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("Calendar session already exists for this month");
        } else {
          toast.error(
            error.response?.data?.message ||
              "Something went wrong. Please try again",
          );
        }
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
        className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50"
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <div className="w-[42rem] max-h-[29rem] overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-white rounded-xl border-t-5 border-blue-400">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                ADD CALENDAR SESSION
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
                    value={addCalendar.session_name}
                    onChange={(e) =>
                      setAddCalendar((prev) => ({
                        ...prev,
                        session_name: e.target.value,
                      }))
                    }
                    placeholder="Enter Session Name"
                    className="border border-gray-300 px-3 py-2.5 rounded-lg w-full text-gray-800 
              focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>

                {/* Starting Month */}
                <div className="flex flex-col">
                  <label className="text-gray-700 text-sm font-semibold mb-2">
                    Starting Month *
                  </label>
                  <DatePicker
                    selected={addCalendar.startingMonth}
                    onChange={(date: Date | null) =>
                      handlerChange({
                        target: { name: "startingMonth", value: date },
                      })
                    }
                    dateFormat="yyyy-MM"
                    showMonthYearPicker
                    minDate={new Date(2021, 0)}
                    maxDate={new Date(2030, 11)}
                    className="border border-gray-300 px-3 py-2.5 rounded-lg w-full text-gray-800 
              focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-4 rounded py-3 bg-white">
              <CancelBtn setModal={setModal} />
              <AddButton
                loading={loading}
                label={loading ? "Saving" : "Save"}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
