import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { TextareaField } from "../InputFields/TextareaField";
import { UserSelect } from "../InputFields/UserSelect";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type AddLeaveProps = {
  setModal: () => void;
  refreshLeaves: () => void;
};

type AddLeaveType = {
  employee_id: string;
  leaveSubject: string;
  fromDate: string;
  toDate: string;
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
  fromDate: currentDate,
  toDate: currentDate,
  leaveReason: "",
};

export const AddLeave = ({ setModal, refreshLeaves }: AddLeaveProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [addLeave, setAddLeave] = useState<AddLeaveType>(initialState);
  const [allUsers, setAllUsers] = useState<UserT[]>([]);
  const [loading, setLoading] = useState(false);

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
    >,
  ) => {
    const { name } = e.target;
    let value = e.target.value;

    value = value.replace(/^\s+/, "");

    if (name === "leaveSubject") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
      value = value.slice(0, 50);
    }

    if (name === "leaveReason") {
      value = value.slice(0, 250);
    }

    setAddLeave((prev) => ({ ...prev, [name]: value }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { employee_id, leaveSubject, fromDate, toDate, leaveReason } =
      addLeave;

    if (
      (isAdmin && !employee_id) ||
      !leaveSubject ||
      !fromDate ||
      !toDate ||
      !leaveReason
    ) {
      toast.error("Please fill all required fields", {
        toastId: "leave-employee-required",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${BASE_URL}/api/addLeave`,
        {
          leaveSubject: addLeave.leaveSubject,
          fromDate: addLeave.fromDate,
          toDate: addLeave.toDate,
          leaveReason: addLeave.leaveReason,
          ...(isAdmin && { employee_id: addLeave.employee_id }),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Leave added successfully", {
        toastId: "leave-success",
      });

      refreshLeaves();
      setModal();
      setAddLeave(initialState);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to add leave",
        { toastId: "leave-error" },
      );
    } finally {
      setLoading(false);
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur flex px-4 items-center justify-center z-50">
      <div className="w-[42rem] bg-white rounded border border-indigo-900">
        <form
          onSubmit={handlerSubmitted}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              ADD LEAVE
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  py-2 space-y-2 gap-3">
            {isAdmin && (
              <UserSelect
                labelName="Employee *"
                name="employee_id"
                value={addLeave.employee_id}
                handlerChange={handlerChange}
                optionData={userOptions}
              />
            )}

            <InputField
              labelName="Leave Subject *"
              name="leaveSubject"
              value={addLeave.leaveSubject}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="From Date *"
              type="date"
              name="fromDate"
              value={addLeave.fromDate}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="To Date *"
              type="date"
              name="toDate"
              value={addLeave.toDate}
              handlerChange={handlerChange}
            />

            <TextareaField
              labelName="Leave Reason *"
              name="leaveReason"
              inputVal={addLeave.leaveReason}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex justify-end gap-3 rounded px-4 py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton loading={loading} label={loading ? "Saving" : "Save"} />
          </div>
        </form>
      </div>
    </div>
  );
};
