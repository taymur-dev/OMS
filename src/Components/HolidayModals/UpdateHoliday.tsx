import React, { useState, useEffect } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { useAppSelector } from "../../redux/Hooks";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { toast } from "react-toastify";

export type HolidayType = {
  id: number;
  date: string;
  holiday: string;
};

type UpdateHolidayProps = {
  setModal: () => void;
  handleGetAllHodidays: () => void;
  editHoliday: HolidayType | null;
};

export const UpdateHoliday = ({
  setModal,
  handleGetAllHodidays,
  editHoliday,
}: UpdateHolidayProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token ?? "";

  const formatDateForInput = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("sv-SE");
  };

  const [holidayData, setHolidayData] = useState<HolidayType>({
    id: 0,
    date: "",
    holiday: "",
  });

  useEffect(() => {
    if (editHoliday) {
      setHolidayData({
        id: editHoliday.id,
        holiday: editHoliday.holiday,
        date: formatDateForInput(editHoliday.date),
      });
    }
  }, [editHoliday]);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHolidayData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!holidayData.id) {
      toast.error("Invalid holiday ID");
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/updateHoliday/${holidayData.id}`,
        {
          holiday: holidayData.holiday,
          date: holidayData.date,
        },
        {
          headers: { Authorization: `Bearer: ${token}` },
        }
      );

      toast.success(res.data.message);
      setModal();
      handleGetAllHodidays();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border border-indigo-500">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-blue-600 rounded-t-xl px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Update Holiday
            </Title>
          </div>
          <div className="mx-2 grid grid-cols-2 py-5 gap-3">
            <InputField
              labelName="Holiday*"
              placeHolder="Enter holiday title"
              type="text"
              name="holiday"
              value={holidayData.holiday}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Date*"
              placeHolder="Select date"
              type="date"
              name="date"
              value={holidayData.date}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 py-3 bg-blue-600 border-t border-indigo-500">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save" />
          </div>
        </form>
      </div>
    </div>
  );
};
