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
  const [salaryYear, setSalaryYear] = useState("");
  const [salaryMonth, setSalaryMonth] = useState("");
  const [status, setStatus] = useState<string | null>(null);

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

  const years = Array.from(
    new Set(calendarList.map((item) => String(item.year)))
  );

  const months = Array.from(
    new Set(
      calendarList
        .filter((item) => String(item.year) === String(salaryYear))
        .map((item) => item.month)
    )
  ).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

  useEffect(() => {
    if (salaryYear && salaryMonth) {
      const match = calendarList.find(
        (item) =>
          String(item.year) === String(salaryYear) && item.month === salaryMonth
      );
      setStatus(match?.calendarStatus ?? "Inactive");
    } else {
      setStatus(null);
    }
  }, [salaryYear, salaryMonth, calendarList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status?.toLowerCase() === "active") return;
    console.log("Submitted:", { salaryYear, salaryMonth, status });
  };

  const isSaveDisabled =
    !salaryYear || !salaryMonth || status?.toLowerCase() === "active";

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border border-indigo-500 p-4 overflow-auto">
        <form onSubmit={handleSubmit}>
          <Title setModal={() => setModal()}>Add Salary Cycle</Title>

          <div className="mx-2 flex flex-wrap gap-3 justify-center mt-4">
            <div className="flex flex-col text-sm">
              <label className="font-medium">Year*</label>
              <select
                className="border rounded px-2 py-1"
                value={salaryYear}
                onChange={(e) => {
                  setSalaryYear(e.target.value);
                  setSalaryMonth("");
                }}
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col text-sm">
              <label className="font-medium">Month*</label>
              <select
                className="border rounded px-2 py-1"
                value={salaryMonth}
                onChange={(e) => setSalaryMonth(e.target.value)}
                disabled={!salaryYear || months.length === 0}
              >
                <option value="">Select Month</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {status && (
            <div className="text-center mt-4">
              <span
                className={`px-4 py-1 rounded text-white text-sm font-semibold ${
                  status.toLowerCase() === "active"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {status}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-center gap-2 mt-4">
            <CancelBtn setModal={() => setModal()} />
            <AddButton label="Save Run Cycle" disabled={isSaveDisabled} />
          </div>
        </form>
      </div>
    </div>
  );
};
