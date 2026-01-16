import React, { useState, useEffect } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { toast } from "react-toastify";

type CalendarSession = {
  year: string | number;
  month: string;
  calendarStatus?: string;
};

type AddSalaryCycleProps = {
  setModal: () => void;
  calendarList: CalendarSession[];
};

export const AddSalaryCycle = ({
  setModal,
  calendarList,
}: AddSalaryCycleProps) => {
  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = monthOrder[currentDate.getMonth()];

  const years = Array.from(
    new Set(calendarList.map((item) => Number(item.year)))
  ).sort((a, b) => a - b);

  const [salaryYear, setSalaryYear] = useState<number>(currentYear);
  const [salaryMonth, setSalaryMonth] = useState<string>(currentMonth);
  const [status, setStatus] = useState<string>("Inactive");

  useEffect(() => {
    const match = calendarList.find(
      (item) => Number(item.year) === salaryYear && item.month === salaryMonth
    );
    setStatus(match?.calendarStatus ?? "Inactive");
  }, [calendarList, salaryYear, salaryMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (salaryYear !== currentYear || salaryMonth !== currentMonth) {
      toast.error("Only current month salary cycle can run");
      return;
    }

    if (status.toLowerCase() === "active") {
      toast.info("Salary cycle already active for this month");
      return;
    }

    setStatus("Active");
    toast.success("Salary cycle is now Active");
    setModal();
  };

  const isActive = status.toLowerCase() === "active";

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border border-indigo-900">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="bg-indigo-900 rounded-t-xl px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Add Salary Cycle
            </Title>
          </div>

          {/* Body */}
          <div className="mx-2 py-4 gap-4 flex flex-col">
            {/* Year & Month */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-900">
                  Year
                </label>
                <select
                  className="border px-3 py-2 rounded-md text-sm"
                  value={salaryYear}
                  onChange={(e) => setSalaryYear(Number(e.target.value))}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-900">
                  Month
                </label>
                <select
                  className="border px-3 py-2 rounded-md text-sm"
                  value={salaryMonth}
                  onChange={(e) => setSalaryMonth(e.target.value)}
                >
                  {monthOrder.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between border rounded-md px-4 py-2 bg-gray-50">
              <span className="text-sm font-medium text-gray-700">
                Current Status
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {status}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save" disabled={isActive} />
          </div>
        </form>
      </div>
    </div>
  );
};
