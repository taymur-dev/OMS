import React, { useState, useEffect } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";

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

  // Extract unique years from calendarList, sorted
  const years = Array.from(
    new Set(calendarList.map((item) => Number(item.year)))
  ).sort((a, b) => a - b);

  const [salaryYear, setSalaryYear] = useState<number>(currentYear);
  const [salaryMonth, setSalaryMonth] = useState<string>(currentMonth);
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  // Check if selected month/year is already active
  useEffect(() => {
    const match = calendarList.find(
      (item) =>
        Number(item.year) === salaryYear && item.month === salaryMonth
    );
    setStatus(match?.calendarStatus ?? "Inactive");
    setMessage(match?.calendarStatus ? `This cycle is ${match.calendarStatus}` : "");
  }, [calendarList, salaryYear, salaryMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only allow current month to run
    if (salaryYear !== currentYear || salaryMonth !== currentMonth) {
      setMessage("Only current month salary cycle can run");
      return;
    }

    if (status?.toLowerCase() === "active") {
      setMessage("Salary cycle already active for this month");
      return;
    }

    console.log("Submitted:", { salaryYear, salaryMonth });
    setStatus("Active");
    setMessage("Salary cycle is now Active");
  };

  const isSaveDisabled = status?.toLowerCase() === "active";

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border border-indigo-500 p-4 overflow-auto">
        <form onSubmit={handleSubmit}>
          <Title setModal={() => setModal()}>Add Salary Cycle</Title>

          <div className="mx-2 flex flex-col items-center gap-3 justify-center mt-4">
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

            {message && (
              <p
                className={`mt-2 text-sm ${
                  status?.toLowerCase() === "active" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
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
