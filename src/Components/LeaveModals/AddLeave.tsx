import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { TextareaField } from "../InputFields/TextareaField";
import { UserSelect } from "../InputFields/UserSelect";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type AddLeaveProps = {
  setModal: () => void;
  refreshLeaves: () => void;
};

type AddLeaveType = {
  employee_id: string;
  leaveSubject: string;
  date: string;
  leaveReason: string;
};

type UserT = {
  id: number;
  employeeName?: string;
  name?: string;
  loginStatus?: string;
};

const currentDate = new Date().toLocaleDateString("sv-SE", {
  timeZone: "Asia/Karachi",
});

const initialState: AddLeaveType = {
  employee_id: "",
  leaveSubject: "",
  date: currentDate,
  leaveReason: "",
};

export const AddLeave = ({ setModal, refreshLeaves }: AddLeaveProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [addLeave, setAddLeave] = useState<AddLeaveType>(initialState);
  const [allUsers, setAllUsers] = useState<UserT[]>([]);

  const getAllUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res.data?.users ?? []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    if (!currentUser || !token) return;

    if (!isAdmin) {
      setAddLeave((prev) => ({
        ...prev,
        employee_id: String(currentUser.id),
      }));
    } else {
      getAllUsers();
    }
  }, [currentUser, token, isAdmin, getAllUsers]);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setAddLeave((prev) => ({ ...prev, [name]: value }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(
        `${BASE_URL}/api/addLeave`,
        {
          leaveSubject: addLeave.leaveSubject,
          date: addLeave.date,
          leaveReason: addLeave.leaveReason,
          ...(isAdmin && { employee_id: addLeave.employee_id }),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      refreshLeaves();
      setModal();
      setAddLeave(initialState);
    } catch (err) {
      console.error("Add leave failed:", err);
      alert("Failed to add leave");
    }
  };

  const userOptions = allUsers
    .filter((u) => u.loginStatus === "Y")
    .map((u) => ({
      id: u.id,
      value: String(u.id),
      label: u.employeeName || u.name || "User",
      name: u.employeeName || u.name || "User",
      loginStatus: u.loginStatus || "Y",
      projectName: "",
    }));

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur flex px-4 items-center justify-center z-10">
      <div className="w-[42rem] bg-white rounded-xl border border-indigo-900">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded-t-xl px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Add Leave
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2  py-2 space-y-2 gap-3">
            {isAdmin && (
              <UserSelect
                labelName="Employee*"
                name="employee_id"
                value={addLeave.employee_id}
                handlerChange={handlerChange}
                optionData={userOptions}
              />
            )}

            <InputField
              labelName="Leave Subject*"
              name="leaveSubject"
              value={addLeave.leaveSubject}
              handlerChange={handlerChange}
            />

            <TextareaField
              labelName="Leave Reason*"
              name="leaveReason"
              inputVal={addLeave.leaveReason}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Date*"
              type="date"
              name="date"
              value={addLeave.date}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex justify-end gap-3 rounded-b-xl px-4 py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save" />
          </div>
        </form>
      </div>
    </div>
  );
};
