import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import { Title } from "../Title";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { UserSelect } from "../InputFields/UserSelect";

type UpdateAttendanceT = {
  id: number;
  attendanceStatus: string;
  clockIn: string;
  clockOut: string;
  date: string;
  day: string;
  leaveApprovalStatus: string | null;
  leaveReason: string | null;
  name: string;
  role: string;
  status: string;
  userId: number;
  workingHours: string;
};

type AddAttendanceProps = {
  setModal: () => void;
  updatedAttendance: UpdateAttendanceT | null;
};

type OptionType = {
  id: number;
  name: string;
  loginStatus: string;
  projectName: string;
};

const reasonLeaveOption = [
  { id: 1, label: "Present", value: "present" },
  { id: 2, label: "Absent", value: "absent" },
  { id: 3, label: "Leave", value: "leave" },
];

export const UpdateAttendance = ({
  setModal,
  updatedAttendance,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addUserAttendance, setAddUserAttendance] =
    useState<UpdateAttendanceT | null>(
      updatedAttendance
        ? {
            ...updatedAttendance,
            attendanceStatus: updatedAttendance.attendanceStatus.toLowerCase(),
          }
        : null,
    );

  const [allUsers, setAllUsers] = useState<OptionType[]>([]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAddUserAttendance((prev) =>
      prev
        ? { ...prev, [name]: name === "userId" ? Number(value) : value }
        : prev,
    );
  };

  const handlerGetUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: token },
      });
      setAllUsers(res?.data?.users ?? []);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to fetch users",
      );
    }
  }, [token]);

  useEffect(() => {
    handlerGetUsers();
  }, [handlerGetUsers]);

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUserAttendance) return;

    try {
      const formattedDate = addUserAttendance.date.slice(0, 10);
      const clockIn =
        addUserAttendance.clockIn.length === 5
          ? `${addUserAttendance.clockIn}:00`
          : addUserAttendance.clockIn;
      const clockOut =
        addUserAttendance.clockOut.length === 5
          ? `${addUserAttendance.clockOut}:00`
          : addUserAttendance.clockOut;

      await axios.patch(
        `${BASE_URL}/api/admin/updateAttendance/${addUserAttendance.id}`,
        {
          date: formattedDate,
          clockIn,
          clockOut,
          attendanceStatus: addUserAttendance.attendanceStatus,
        },
        { headers: { Authorization: token } },
      );
      toast.success("Attendance updated successfully!");
      setModal();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to update attendance.",
      );
    }
  };

  const userOptions = allUsers.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-lg border border-indigo-900">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded-t-xl px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              EDIT ATTENDANCE
            </Title>
          </div>
          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            <UserSelect
              labelName="Select User *"
              name="userId"
              value={addUserAttendance?.userId?.toString() ?? ""}
              handlerChange={handlerChange}
              optionData={userOptions}
            />

            <InputField
              labelName="Date *"
              type="date"
              name="date"
              value={addUserAttendance?.date?.slice(0, 10) ?? ""}
              handlerChange={handlerChange}
            />
            <InputField
              labelName="Clock In *"
              type="time"
              name="clockIn"
              value={addUserAttendance?.clockIn ?? ""}
              handlerChange={handlerChange}
              disabled={
                addUserAttendance?.attendanceStatus === "absent" ||
                addUserAttendance?.attendanceStatus === "leave"
              }
            />
            <InputField
              labelName="Clock Out *"
              type="time"
              name="clockOut"
              value={addUserAttendance?.clockOut ?? ""}
              handlerChange={handlerChange}
              disabled={
                addUserAttendance?.attendanceStatus === "absent" ||
                addUserAttendance?.attendanceStatus === "leave"
              }
            />

            <OptionField
              labelName="Attendance Status *"
              name="attendanceStatus"
              value={addUserAttendance?.attendanceStatus ?? ""}
              handlerChange={handlerChange}
              optionData={reasonLeaveOption}
              inital="Please Select Attendance Status"
            />
          </div>

          <div className="flex justify-end  gap-3 px-6 py-4 bg-indigo-900 rounded-b-xl">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update" />
          </div>
        </form>
      </div>
    </div>
  );
};
