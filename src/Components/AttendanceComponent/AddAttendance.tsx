import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import { Title } from "../Title";
import { BASE_URL } from "../../Content/URL";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useAppSelector } from "../../redux/Hooks";
import { UserSelect } from "../InputFields/UserSelect";

type AddAttendanceProps = {
  setModal: () => void;
  handleGetALLattendance: () => void;
};

type User = {
  id: number;
  name: string;
  email: string;
  value: string;
  label: string;
  loginStatus: "Y" | "N";
  role: "admin" | "user";
};

const currentDate = new Date().toLocaleDateString("sv-SE");

const reasonLeaveOption = [
  {
    id: 1,
    label: "Present",
    value: "present",
  },
  {
    id: 2,
    label: "Absent",
    value: "absent",
  },
  {
    id: 3,
    label: "Leave",
    value: "leave",
  },
];
const initialState = {
  selectUser: "",
  date: currentDate,
  clockIn: "",
  clockOut: "",
  attendanceStatus: "",
};
export const AddAttendance = ({
  setModal,
  handleGetALLattendance,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [addUserAttendance, setAddUserAttendance] = useState(initialState);

  const [allUsers, setAllUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);

  const token = currentUser?.token;
  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAddUserAttendance({ ...addUserAttendance, [name]: value.trim() });
  };

  const isAbsentOrLeave =
    addUserAttendance.attendanceStatus === "absent" ||
    addUserAttendance.attendanceStatus === "leave";

 const handlerGetUsers = useCallback(async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const filteredUsers = res.data.users
      .filter(
        (user: User) =>
          user.loginStatus === "Y" && user.role === "user"
      )
      .map((user: User) => ({
        ...user,
        value: user.id,
        label: user.name,
      }));

    setAllUsers(filteredUsers);
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    toast.error(axiosError?.response?.data?.message);
  }
}, [token]);


  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/addAttendance/${addUserAttendance?.selectUser}`,
        addUserAttendance,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
      setModal();
      handleGetALLattendance();
      setLoading(false);
      toast.success("Attendance has been added successfully");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || "Something went wrong");
    }
  };
  useEffect(() => {
    handlerGetUsers();
  }, [handlerGetUsers]);

  useEffect(() => {
    if (isAbsentOrLeave) {
      setAddUserAttendance((prev) => ({
        ...prev,
        clockIn: "",
        clockOut: "",
      }));
    }
  }, [isAbsentOrLeave]);

  return (
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[28rem]  bg-white mx-auto rounded-xl border  border-indigo-900 ">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded-t-xl px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                Add Attendance
              </Title>
            </div>

            <div className="mx-2  grid grid-cols-2 gap-3  ">
              <UserSelect
                labelName="Select User*"
                name="selectUser"
                value={addUserAttendance.selectUser}
                handlerChange={handlerChange}
                optionData={allUsers}
              />

              <InputField
                labelName="Date*"
                placeHolder="Enter the Company Name"
                type="Date"
                name="date"
                value={addUserAttendance.date ?? ""}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Clock In*"
                placeHolder="Enter the Company Name"
                type="time"
                name="clockIn"
                value={addUserAttendance.clockIn}
                handlerChange={handlerChange}
                disabled={isAbsentOrLeave}
              />

              <InputField
                labelName="Clock Out*"
                placeHolder="Enter the Company Name"
                type="time"
                name="clockOut"
                value={addUserAttendance.clockOut}
                handlerChange={handlerChange}
                disabled={isAbsentOrLeave}
              />

              <OptionField
                labelName="Attendance Status*"
                name="attendanceStatus"
                value={addUserAttendance.attendanceStatus}
                handlerChange={handlerChange}
                optionData={reasonLeaveOption}
                inital="Please Select Status"
              />
            </div>

            <div className="flex justify-end  gap-3 px-6 py-4 bg-indigo-900 rounded-b-xl">
              <CancelBtn setModal={setModal} />
              <AddButton
                label={loading ? "Saving..." : "Save"}
                loading={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
