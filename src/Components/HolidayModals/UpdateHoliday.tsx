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
  allHoliday: HolidayType[];
};

export const UpdateHoliday = ({
  setModal,
  handleGetAllHodidays,
  editHoliday,
  allHoliday,
}: UpdateHolidayProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [loading, setLoading] = useState(false);

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

    if (name === "holiday") {
      const cleanedValue = value.trimStart();

      if (cleanedValue.length > 50) return;

      const isPureNumber = /^\d+$/.test(cleanedValue);

      if (isPureNumber && cleanedValue !== "") return;

      setHolidayData((prev) => ({ ...prev, [name]: cleanedValue }));
    } else {
      setHolidayData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!holidayData.id) {
      toast.error("Invalid holiday ID", { toastId: "invalid-id-error" });
      return;
    }

    const holidayName = holidayData.holiday.trim();

    if (!holidayName) {
      toast.error("Holiday name is required", {
        toastId: "holiday-name-error",
      });
      return;
    }

    if (holidayName.length > 30) {
      toast.error("Holiday name cannot exceed 30 characters", {
        toastId: "holiday-length-error",
      });
      return;
    }

    if (new Date(holidayData.fromDate) > new Date(holidayData.toDate)) {
      toast.error("The 'From Date' cannot be later than the 'To Date'", {
        toastId: "date-error",
      });
      return;
    }

    const isDuplicate = allHoliday.some((h) => {
      if (h.id === holidayData.id) return false;
      return (
        h.holiday.trim().toLowerCase() === holidayName.toLowerCase() &&
        h.fromDate === holidayData.fromDate &&
        h.toDate === holidayData.toDate
      );
    });

    if (isDuplicate) {
      toast.error(
        "Another holiday with the same name and same dates already exists",
        { toastId: "duplicate-holiday-error" },
      );
      return;
    }

    setLoading(true);

    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/updateHoliday/${holidayData.id}`,
        {
          holiday: holidayName,
          fromDate: holidayData.fromDate,
          toDate: holidayData.toDate,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(res.data.message || "Updated successfully", {
        toastId: "update-success",
      });

      setModal();
      handleGetAllHodidays();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        if (serverMessage) {
          toast.error(serverMessage, { toastId: "server-error" });
        } else {
          toast.error("An unexpected error occurred", {
            toastId: "server-error",
          });
        }
      } else {
        toast.error("An unexpected error occurred", {
          toastId: "server-error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-50"
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
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

            <AddButton
              loading={loading}
              label={loading ? "Updating" : "Update"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
