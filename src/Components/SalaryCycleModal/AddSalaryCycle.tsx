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
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const match = calendarList.find(
      (item) => Number(item.year) === salaryYear && item.month === salaryMonth
    );
    setStatus(match?.calendarStatus ?? "Inactive");
  }, [calendarList, salaryYear, salaryMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (salaryYear !== currentYear || salaryMonth !== currentMonth) {
      setModal();
      toast.error("Only current month salary cycle can run");
      return;
    }

    if (status?.toLowerCase() === "active") {
      setModal();
      toast.info("Salary cycle already active for this month");
      return;
    }

    console.log("Submitted:", { salaryYear, salaryMonth });
    setStatus("Active");
    setModal();
    toast.success("Salary cycle is now Active");
  };

  const isSaveDisabled = status?.toLowerCase() === "active";

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border border-indigo-500 p-4 overflow-auto">
        <form onSubmit={handleSubmit}>
          <Title setModal={() => setModal()}>Add Salary Cycle</Title>

          <div className="mx-2 flex items-center gap-4 justify-center mt-4">
            {/* Year */}
            <div className="flex flex-col text-sm">
              <label className="font-medium">Year</label>
              <select
                className="border rounded px-2 py-1"
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

            {/* Month */}
            <div className="flex flex-col text-sm">
              <label className="font-medium">Month</label>
              <select
                className="border rounded px-2 py-1"
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

          <div className="flex justify-center gap-2 mt-4">
            <CancelBtn setModal={() => setModal()} />
            <AddButton label="Save Run Cycle" disabled={isSaveDisabled} />
          </div>
        </form>
      </div>
    </div>
  );
};
