import React, { useState } from "react";
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

  const initialState: HolidayType = {
    id: editHoliday?.id ?? 0,
    date: editHoliday?.date ?? "",
    holiday: editHoliday?.holiday ?? "",
  };

  const [holidayData, setHolidayData] = useState<HolidayType>(initialState);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        { headers: { Authorization: token } }
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
          <Title setModal={setModal}>Update Holiday</Title>

          <div className="mx-2 flex-wrap gap-3">
            <InputField
              labelName="Holiday*"
              placeHolder="Enter holiday title"
              type="text"
              name="holiday"
              inputVal={holidayData.holiday}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Date*"
              placeHolder="Select date"
              type="date"
              name="date"
              inputVal={holidayData.date}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex items-center justify-center m-2 gap-2 text-xs">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update Holiday" />
          </div>
        </form>
      </div>
    </div>
  );
};
