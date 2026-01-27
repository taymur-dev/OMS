import React, { useState } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type AddAttendanceProps = {
  setModal: () => void;
  refreshCalendar: () => void;
};

const initialState = {
  startingMonth: new Date(),
};

const currentDate = new Date();
const startOfCurrentMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  1
);
const endOfCurrentMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  0
);

export const AddCalendarSession = ({
  setModal,
  refreshCalendar,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addCalendar, setAddCalendar] = useState<{
    startingMonth: Date | null;
  }>(initialState);

  const handlerChange = (e: {
    target: { name: string; value: Date | null };
  }) => {
    const { name, value } = e.target;
    setAddCalendar((prev) => ({ ...prev, [name]: value }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!addCalendar.startingMonth) {
        toast.error("Please select a month");
        return;
      }

      const year = addCalendar.startingMonth.getFullYear().toString();
      const month = addCalendar.startingMonth.toLocaleString("default", {
        month: "long",
      });

      const formattedData = {
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
        }
      );

      toast.success("Calendar session added successfully");
      refreshCalendar();
      setModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.warning("Calendar session already exists for this month");
        } else {
          toast.error(
            error.response?.data?.message ||
              "Something went wrong. Please try again"
          );
        }
      } else {
        toast.error("Unexpected error occurred");
      }

      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50">
        <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border border-indigo-900">
          <form onSubmit={handlerSubmitted}>

             <div className="bg-indigo-900 rounded-t-xl px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                ADD CALENDAR SESSION
              </Title>
            </div>

            <div className="mx-2 flex-wrap py-2  flex flex-col justify-center">
              <label className="block text-gray-900 text-xs font-semibold">
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
                minDate={startOfCurrentMonth}
                maxDate={endOfCurrentMonth}
                className="border px-3 py-2 rounded-md w-full text-gray-800"
              />
            </div>

             <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
              <CancelBtn setModal={setModal} />
              <AddButton label="Save" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
