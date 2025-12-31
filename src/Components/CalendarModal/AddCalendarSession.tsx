import React, { useState } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type AddAttendanceProps = {
  setModal: () => void;
  refreshCalendar: () => void;
};

const initialState = {
  startingMonth: new Date(),
};

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
        alert("Please select a month");
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

      console.log(formattedData, "data to send");

      const res = await axios.post(
        `${BASE_URL}/api/admin/addCalendarSession`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer: ${token}`,
          },
        }
      );

      console.log(res.data);
      refreshCalendar();
      setModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border border-indigo-500">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={() => setModal()}>Add Calendar</Title>
            <div className="mx-2 flex-wrap gap-3 flex flex-col justify-center">
              <label className="block text-gray-900 text-xs font-semibold">
                Starting Month*
              </label>
              <DatePicker
                selected={addCalendar?.startingMonth}
                onChange={(date: Date | null) =>
                  handlerChange({
                    target: { name: "startingMonth", value: date },
                  })
                }
                dateFormat="yyyy-MM"
                showMonthYearPicker
                className="border px-3 py-2 rounded-md w-full text-gray-800"
              />
            </div>
            <div className="flex items-center justify-center m-2 gap-2 text-xs">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Save Calendar"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
