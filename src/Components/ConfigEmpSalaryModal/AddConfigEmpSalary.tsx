import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect, SelectOption } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type AddSalaryProps = {
  setModal: () => void;
  refreshSalaries: () => void;
};

type ApiUser = {
  id: number;
  name: string;
  loginStatus: string;
  projectName: string;
  role: string;
};

const currentDate = new Date().toLocaleDateString("en-CA");

type SalaryState = {
  employee_id: string;
  employee_name: string;
  salary_amount: string;
  emp_of_mon_allowance: string;
  transport_allowance: string;
  medical_allowance: string;
  total_salary: string;
  config_date: string;
  effective_from: string;
};

const initialState: SalaryState = {
  employee_id: "",
  employee_name: "",
  salary_amount: "",
  emp_of_mon_allowance: "",
  transport_allowance: "",
  medical_allowance: "",
  total_salary: "0",
  config_date: currentDate,
  effective_from: currentDate,
};

export const AddConfigEmpSalary = ({
  setModal,
  refreshSalaries,
}: AddSalaryProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addConfigEmployee, setAddConfigEmployee] =
    useState<SalaryState>(initialState);
  const [allUsers, setAllUsers] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    let updatedValue = value;

    if (type === "number") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
    }

    setAddConfigEmployee((prev) => ({ ...prev, [name]: updatedValue }));
  };

  useEffect(() => {
    const total =
      Number(addConfigEmployee.salary_amount || 0) +
      Number(addConfigEmployee.emp_of_mon_allowance || 0) +
      Number(addConfigEmployee.transport_allowance || 0) +
      Number(addConfigEmployee.medical_allowance || 0);

    setAddConfigEmployee((prev) => ({
      ...prev,
      total_salary: total.toString(),
    }));
  }, [
    addConfigEmployee.salary_amount,
    addConfigEmployee.emp_of_mon_allowance,
    addConfigEmployee.transport_allowance,
    addConfigEmployee.medical_allowance,
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
        .map((user) => ({ value: user.id.toString(), label: user.name }));

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
      return toast.error("Unauthorized", { toastId: "salary-unauthorized" });
    }

    if (
      !addConfigEmployee.employee_id ||
      !addConfigEmployee.salary_amount ||
      !addConfigEmployee.config_date
    ) {
      return toast.error("Employee, Salary, and Config Date are required", {
        toastId: "salary-required-fields",
      });
    }

    setLoading(true);

    try {
      const payload = {
        employee_id: Number(addConfigEmployee.employee_id),
        salary_amount: Number(addConfigEmployee.salary_amount),
        emp_of_mon_allowance: Number(addConfigEmployee.emp_of_mon_allowance),
        transport_allowance: Number(addConfigEmployee.transport_allowance),
        medical_allowance: Number(addConfigEmployee.medical_allowance),
        total_salary: Number(addConfigEmployee.total_salary),
        config_date: addConfigEmployee.config_date,
        effective_from: addConfigEmployee.effective_from,
      };

      await axios.post(`${BASE_URL}/api/admin/addsalaries`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Salary configuration added successfully", {
        toastId: "salary-success",
      });

      refreshSalaries();
      setModal();
    } catch (error: unknown) {
      console.error("Salary submit failed:", error);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add salary", {
          toastId: "salary-error",
        });
      } else {
        toast.error("Something went wrong", {
          toastId: "salary-error-unknown",
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
      <div className="w-[42rem] max-h-[39rem] bg-white mx-auto rounded border border-indigo-900 overflow-y-auto">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              CONFIGURE EMPLOYEE SALARY
            </Title>
          </div>

          <div className="mx-2 grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            <UserSelect
              labelName="Employee Name *"
              name="employee_id"
              value={addConfigEmployee.employee_id}
              handlerChange={handlerChange}
              optionData={allUsers}
            />

            <InputField
              labelName="Salary Amount *"
              name="salary_amount"
              type="number"
              handlerChange={handlerChange}
              value={addConfigEmployee.salary_amount}
            />

            <InputField
              labelName="House Rent *"
              name="emp_of_mon_allowance"
              type="number"
              handlerChange={handlerChange}
              value={addConfigEmployee.emp_of_mon_allowance}
            />

            <InputField
              labelName="Transport Allowance *"
              name="transport_allowance"
              type="number"
              handlerChange={handlerChange}
              value={addConfigEmployee.transport_allowance}
            />

            <InputField
              labelName="Medical Allowance *"
              name="medical_allowance"
              type="number"
              handlerChange={handlerChange}
              value={addConfigEmployee.medical_allowance}
            />

            <InputField
              labelName="Total Salary *"
              name="total_salary"
              type="number"
              value={addConfigEmployee.total_salary}
              handlerChange={() => {}}
              disabled
            />

            <InputField
              labelName="Date *"
              name="config_date"
              type="date"
              handlerChange={handlerChange}
              value={addConfigEmployee.config_date}
            />

            <InputField
              labelName="With Effect from Date *"
              name="effective_from"
              type="date"
              handlerChange={handlerChange}
              value={addConfigEmployee.effective_from}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton loading={loading} label={loading ? "Saving" : "Save"} />
          </div>
        </form>
      </div>
    </div>
  );
};
