import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect, SelectOption } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type Salary = {
  id: number;
  employee_id: number;
  salary_amount: number;
  emp_of_mon_allowance: number;
  transport_allowance: number;
  medical_allowance: number;
  total_salary: number;
  config_date: string;
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
};

const initialState: SalaryState = {
  employee_id: "",
  salary_amount: "",
  emp_of_mon_allowance: "",
  transport_allowance: "",
  medical_allowance: "",
  total_salary: "0",
  config_date: "",
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

  useEffect(() => {
    if (editData) {
      setEditConfigEmployee({
        employee_id: editData.employee_id.toString(),
        salary_amount: editData.salary_amount?.toString() || "0",
        emp_of_mon_allowance: editData.emp_of_mon_allowance?.toString() || "0",
        transport_allowance: editData.transport_allowance?.toString() || "0",
        medical_allowance: editData.medical_allowance?.toString() || "0",
        total_salary: editData.total_salary?.toString() || "0",
        config_date: editData.config_date?.split("T")[0] || "",
      });
    }
  }, [editData]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditConfigEmployee((prev) => ({ ...prev, [name]: value }));
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
        }
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

    try {
      const payload = {
        employee_id: Number(editConfigEmployee.employee_id),
        salary_amount: Number(editConfigEmployee.salary_amount),
        emp_of_mon_allowance: Number(editConfigEmployee.emp_of_mon_allowance),
        transport_allowance: Number(editConfigEmployee.transport_allowance),
        medical_allowance: Number(editConfigEmployee.medical_allowance),
        total_salary: Number(editConfigEmployee.total_salary),
        config_date: editConfigEmployee.config_date,
      };

      await axios.put(
        `${BASE_URL}/api/admin/updatesalaries/${editData.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      refreshSalaries();
      setModal();
    } catch (error) {
      console.error("Salary update failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[39rem] bg-white mx-auto rounded border border-indigo-900 overflow-y-auto">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              EDIT EMPLOYEE SALARY
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2  gap-3">
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
            />

            <InputField
              labelName="House Rent *"
              name="emp_of_mon_allowance"
              type="number"
              handlerChange={handlerChange}
              value={editConfigEmployee.emp_of_mon_allowance}
            />

            <InputField
              labelName="Transport Allowance *"
              name="transport_allowance"
              type="number"
              handlerChange={handlerChange}
              value={editConfigEmployee.transport_allowance}
            />

            <InputField
              labelName="Medical Allowance *"
              name="medical_allowance"
              type="number"
              handlerChange={handlerChange}
              value={editConfigEmployee.medical_allowance}
            />

            <InputField
              labelName="Total Salary"
              name="total_salary"
              type="number"
              value={editConfigEmployee.total_salary}
              handlerChange={() => {}}
              disabled
            />

            <InputField
              labelName="Date *"
              name="config_date"
              type="date"
              handlerChange={handlerChange}
              value={editConfigEmployee.config_date}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update" />
          </div>
        </form>
      </div>
    </div>
  );
};
