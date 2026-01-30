import React, { useState } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { useAppSelector } from "../../redux/Hooks";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { toast } from "react-toastify";

type AddAttendanceProps = {
  setModal: () => void;
  handleGetAllHodidays: () => void;
};

const currentDate = new Date().toLocaleDateString("sv-SE");

const initialState = {
  holiday: "",
  fromDate: currentDate,
  toDate: currentDate,
};

export const AddHoliday = ({
  setModal,
  handleGetAllHodidays,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [holiday, setHoliday] = useState(initialState);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setHoliday({ ...holiday, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/configHolidays`,
        holiday,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(res.data.message || "Holiday added successfully!");
      setModal();
      handleGetAllHodidays();
      setHoliday(initialState);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        toast.error(serverMessage || "Failed to add holiday");
        console.error("Axios Error:", serverMessage);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Unexpected Error:", error);
      }
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-50">
        <div className="w-[42rem] max-h-[35rem] bg-white mx-auto rounded border border-indigo-900 overflow-hidden">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                ADD HOLIDAY
              </Title>
            </div>

            <div className="mx-4 grid grid-cols-1 gap-4 py-6">
              <InputField
                labelName="Holiday Name *"
                placeHolder="e.g. Eid Holidays"
                type="text"
                name="holiday"
                value={holiday.holiday}
                handlerChange={handlerChange}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  labelName="From Date *"
                  type="date"
                  name="fromDate"
                  value={holiday.fromDate}
                  handlerChange={handlerChange}
                />

                <InputField
                  labelName="To Date *"
                  type="date"
                  name="toDate"
                  value={holiday.toDate}
                  handlerChange={handlerChange}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-4 py-3 bg-indigo-900 border-t border-indigo-900">
              <CancelBtn setModal={setModal} />
              <AddButton label="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
