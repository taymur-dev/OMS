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
  holiday: string;
  fromDate: string;
  toDate: string;
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
    return new Date(date).toLocaleDateString("en-CA"); 
  };

  const [holidayData, setHolidayData] = useState<HolidayType>({
    id: 0,
    holiday: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    if (editHoliday) {
      setHolidayData({
        id: editHoliday.id,
        holiday: editHoliday.holiday,
        fromDate: formatDateForInput(editHoliday.fromDate),
        toDate: formatDateForInput(editHoliday.toDate),
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
          fromDate: holidayData.fromDate,
          toDate: holidayData.toDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || "Updated successfully");
      setModal();
      handleGetAllHodidays();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-50">
      <div className="w-[42rem] bg-white mx-auto rounded border border-indigo-900">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              EDIT HOLIDAY
            </Title>
          </div>
          
          <div className="mx-4 grid grid-cols-1 gap-4 py-6">
            {/* Full width Title Field */}
            <InputField
              labelName="Holiday Name*"
              placeHolder="Enter holiday title"
              type="text"
              name="holiday"
              value={holidayData.holiday}
              handlerChange={handlerChange}
            />

            {/* Two columns for Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                labelName="From Date*"
                type="date"
                name="fromDate"
                value={holidayData.fromDate}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="To Date*"
                type="date"
                name="toDate"
                value={holidayData.toDate}
                handlerChange={handlerChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update Holiday" />
          </div>
        </form>
      </div>
    </div>
  );
};