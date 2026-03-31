import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect, SelectOption } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type Salary = {
  id: number;
  employee_id: number;
  salary_amount: number;
  emp_of_mon_allowance: number;
  transport_allowance: number;
  medical_allowance: number;
  total_salary: number;
  config_date: string;
  effective_from: string;
  attendance_base: string;
  salary_month: string;
  description: string;
};

type EditSalaryProps = {
  setModal: () => void;
  refreshSalaries: () => void;
  editData: Salary;
};

type ApiUser = {
  id: number;
  name: string;
  loginStatus: string;
  role: string;
};

type SalaryState = {
  employee_id: string;
  salary_amount: string;
  emp_of_mon_allowance: string;
  transport_allowance: string;
  medical_allowance: string;
  total_salary: string;
  config_date: string;
  effective_from: string;
  attendance_base: string;
  salary_month: string;
  description: string;
};

const initialState: SalaryState = {
  employee_id: "",
  salary_amount: "",
  emp_of_mon_allowance: "",
  transport_allowance: "",
  medical_allowance: "",
  total_salary: "0",
  config_date: "",
  effective_from: "",
  attendance_base: "Y",
  salary_month: "",
  description: "",
};

export const EditConfigEmpSalary = ({
  setModal,
  refreshSalaries,
  editData,
}: EditSalaryProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [editConfigEmployee, setEditConfigEmployee] =
    useState<SalaryState>(initialState);
  const [allUsers, setAllUsers] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      // Helper function to handle formatting for any date string
      const formatForInput = (dateString: string) => {
        if (!dateString) return "";
        const dateObj = new Date(dateString);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      setEditConfigEmployee({
        employee_id: editData.employee_id.toString(),
        salary_amount: editData.salary_amount?.toString() || "",
        emp_of_mon_allowance: editData.emp_of_mon_allowance?.toString() || "",
        transport_allowance: editData.transport_allowance?.toString() || "",
        medical_allowance: editData.medical_allowance?.toString() || "",
        total_salary: editData.total_salary?.toString() || "",
        config_date: formatForInput(editData.config_date),
        effective_from: formatForInput(editData.effective_from),
        attendance_base: editData.attendance_base,
        salary_month: editData.salary_month,
        description: editData.description,
      });
    }
  }, [editData]);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    let updatedValue = value;

    if (type === "number") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
    }

    setEditConfigEmployee((prev) => ({ ...prev, [name]: updatedValue }));
  };

  useEffect(() => {
    const total =
      Number(editConfigEmployee.salary_amount || 0) +
      Number(editConfigEmployee.emp_of_mon_allowance || 0) +
      Number(editConfigEmployee.transport_allowance || 0) +
      Number(editConfigEmployee.medical_allowance || 0);

    setEditConfigEmployee((prev) => ({
      ...prev,
      total_salary: total.toString(),
    }));
  }, [
    editConfigEmployee.salary_amount,
    editConfigEmployee.emp_of_mon_allowance,
    editConfigEmployee.transport_allowance,
    editConfigEmployee.medical_allowance,
  ]);

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get<{ users: ApiUser[] }>(
        `${BASE_URL}/api/admin/getUsers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const formattedUsers: SelectOption[] = res.data.users
        .filter((user) => user.role === "user" && user.loginStatus === "Y")
        .map((user) => ({
          value: user.id.toString(),
          label: user.name,
        }));

      setAllUsers(formattedUsers);
    } catch (error) {
      console.error("Get users failed:", error);
    }
  }, [token]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      return toast.error("Unauthorized", {
        toastId: "salary-update-unauthorized",
      });
    }

    if (
      !editConfigEmployee.employee_id ||
      !editConfigEmployee.salary_amount ||
      !editConfigEmployee.config_date ||
      !editConfigEmployee.salary_month
    ) {
      return toast.error(
        "Employee, Salary Amount, Salary Month and Config Date are required",
        {
          toastId: "salary-update-required",
        },
      );
    }

    setLoading(true);

    try {
      const payload = {
        employee_id: Number(editConfigEmployee.employee_id),
        salary_amount: Number(editConfigEmployee.salary_amount),
        emp_of_mon_allowance: Number(editConfigEmployee.emp_of_mon_allowance),
        transport_allowance: Number(editConfigEmployee.transport_allowance),
        medical_allowance: Number(editConfigEmployee.medical_allowance),
        total_salary: Number(editConfigEmployee.total_salary),
        config_date: editConfigEmployee.config_date,
        effective_from: editConfigEmployee.effective_from,
        attendance_base: editConfigEmployee.attendance_base,
        salary_month: editConfigEmployee.salary_month,
        description: editConfigEmployee.description,
      };

      await axios.put(
        `${BASE_URL}/api/admin/updatesalaries/${editData.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Salary updated successfully", {
        toastId: "salary-update-success",
      });

      refreshSalaries();
      setModal();
    } catch (error: unknown) {
      console.error("Salary update failed:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update salary",
          { toastId: "salary-update-error" },
        );
      } else {
        toast.error("Something went wrong", {
          toastId: "salary-update-error-unknown",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50"
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      <div className="w-[42rem] max-h-[42rem] bg-white mx-auto rounded-xl shadow-xl">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-white rounded-xl border-t-5 border-blue-400">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              EDIT EMPLOYEE SALARY
            </Title>
          </div>

          <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-6  gap-3">
            <UserSelect
              labelName="Employee Name *"
              name="employee_id"
              value={editConfigEmployee.employee_id}
              handlerChange={handlerChange}
              optionData={allUsers}
              disabled
            />

            <InputField
              labelName="Salary Amount *"
              name="salary_amount"
              type="number"
              handlerChange={handlerChange}
              value={editConfigEmployee.salary_amount}
              minLength={3}
              maxLength={12}
            />

            <InputField
              labelName="House Rent *"
              name="emp_of_mon_allowance"
              type="number"
              handlerChange={handlerChange}
              value={editConfigEmployee.emp_of_mon_allowance}
              minLength={3}
              maxLength={12}
            />

            <InputField
              labelName="Transport Allowance *"
              name="transport_allowance"
              type="number"
              handlerChange={handlerChange}
              value={editConfigEmployee.transport_allowance}
              minLength={3}
              maxLength={12}
            />

            <InputField
              labelName="Medical Allowance *"
              name="medical_allowance"
              type="number"
              handlerChange={handlerChange}
              value={editConfigEmployee.medical_allowance}
              minLength={3}
              maxLength={12}
            />

            <InputField
              labelName="Total Salary"
              name="total_salary"
              type="number"
              value={editConfigEmployee.total_salary}
              handlerChange={() => {}}
              disabled
              minLength={3}
              maxLength={12}
            />

            <InputField
              labelName="Configured Date *"
              name="config_date"
              type="date"
              handlerChange={handlerChange}
              value={editConfigEmployee.config_date}
            />

            <InputField
              labelName="With Effect From Date *"
              name="effective_from"
              type="date"
              handlerChange={handlerChange}
              value={editConfigEmployee.effective_from}
            />

            <InputField
              labelName="Salary Month*"
              name="salary_month"
              type="month"
              handlerChange={handlerChange}
              value={editConfigEmployee.salary_month}
            />

            <div className="flex flex-col px-2 py-1">
              <label className="text-sm font-bold text-gray-500 mb-1">
                Attendance Base *
              </label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="attendance_base"
                    value="Y"
                    checked={editConfigEmployee.attendance_base === "Y"}
                    onChange={handlerChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-600">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="attendance_base"
                    value="N"
                    checked={editConfigEmployee.attendance_base === "N"}
                    onChange={handlerChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-600">No</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <TextareaField
                labelName="Description *"
                name="description"
                handlerChange={handlerChange}
                inputVal={editConfigEmployee.description || ""}
                minLength={3} // Add this
                maxLength={250}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-6 bg-white">
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
