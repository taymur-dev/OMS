import React, { useState, useEffect } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type CalendarSession = {
  year: string | number;
  month: string;
  calendarStatus?: string;
};

type AddSalaryCycleProps = {
  setModal: () => void;
  calendarList: CalendarSession[];
  refreshData?: () => void;
};

export const AddSalaryCycle = ({
  setModal,
  calendarList,
  refreshData,
}: AddSalaryCycleProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

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
    new Set(calendarList.map((item) => Number(item.year))),
  ).sort((a, b) => a - b);

  const [salaryYear, setSalaryYear] = useState<number>(currentYear);
  const [salaryMonth, setSalaryMonth] = useState<string>(currentMonth);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("InActive");

  useEffect(() => {
    const match = calendarList.find(
      (item) =>
        Number(item.year) === salaryYear &&
        item.month.trim().toLowerCase() === salaryMonth.trim().toLowerCase(),
    );
    setStatus(match?.calendarStatus ?? "InActive");
  }, [calendarList, salaryYear, salaryMonth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "InActive") {
      toast.error(
        `Cannot run cycle. Calendar status is ${status}. Please activate this  month in the Calendar first.`,
      );
      return;
    }

    setLoading(true);
    try {
      // 3. Actual API Call
      const response = await axios.post(
        `${BASE_URL}/api/admin/runSalaryCycle`,
        {
          year: salaryYear,
          month: salaryMonth,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(response.data.message || "Salary cycle run successfully");
      if (refreshData) refreshData();
      setModal();
    } catch (error: unknown) {
      console.error("Run Salary Cycle Error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to run salary cycle",
        );
      } else if (error instanceof Error) {
        toast.error(error.message || "Failed to run salary cycle");
      } else {
        toast.error("Failed to run salary cycle");
      }
    } finally {
      setLoading(false);
    }
  };

  const isProcessed = status.toLowerCase() === "processed";
  const isInActive = status.toLowerCase() === "inActive";

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded border border-indigo-900">
        <form onSubmit={handleSubmit}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              RUN SALARY CYCLE
            </Title>
          </div>

          <div className="mx-2 py-4 gap-4 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-900">
                  Year *
                </label>
                <select
                  className="border px-3 py-2 rounded-md text-sm"
                  value={salaryYear}
                  onChange={(e) => setSalaryYear(Number(e.target.value))}
                >
                  {years.length > 0 ? (
                    years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))
                  ) : (
                    <option value={currentYear}>{currentYear}</option>
                  )}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-900">
                  Month *
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

            <div className="flex items-center justify-between border rounded-md px-4 py-2 bg-gray-50">
              <span className="text-sm font-medium text-gray-700">
                Calendar Status *
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  status.toLowerCase() === "active"
                    ? "bg-green-500 text-white"
                    : isProcessed
                      ? "bg-blue-500 text-white"
                      : "bg-red-200 text-red-700"
                }`}
              >
                {status}
              </span>
            </div>
            {isInActive && (
              <p className="text-[10px] text-red-500 italic">
                * You must activate this session in the Calendar module before
                running the cycle.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={loading ? "Processing..." : "Run Cycle"}
              disabled={isProcessed || isInActive || loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
