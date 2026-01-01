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
  employee_name: string;
  salary_amount: number;
  emp_of_mon_allowance: number;
  transport_allowance: number;
  medical_allowance: number;
  total_salary: number;
  config_date: string;
};

type EditSalaryProps = {
  setModal: () => void;
  onSuccess: () => void;
  editData: Salary;
};

type ApiUser = {
  id: number;
  name: string;
  loginStatus: string;
  role: string;
};

type SalaryState = {
  employee_name: string;
  salary_amount: string;
  emp_of_mon_allowance: string;
  transport_allowance: string;
  medical_allowance: string;
  total_salary: string;
  config_date: string;
};

const initialState: SalaryState = {
  employee_name: "",
  salary_amount: "",
  emp_of_mon_allowance: "",
  transport_allowance: "",
  medical_allowance: "",
  total_salary: "",
  config_date: "",
};

export const EditConfigEmpSalary = ({
  setModal,
  onSuccess,
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
        employee_name: editData.employee_id?.toString() || "",
        salary_amount: editData.salary_amount?.toString() || "",
        emp_of_mon_allowance: editData.emp_of_mon_allowance?.toString() || "",
        transport_allowance: editData.transport_allowance?.toString() || "",
        medical_allowance: editData.medical_allowance?.toString() || "",
        total_salary: editData.total_salary?.toString() || "",
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

  // 🔹 Auto calculate total salary
  useEffect(() => {
    const baseSalary = Number(editConfigEmployee.salary_amount) || 0;
    const monthAllowance = Number(editConfigEmployee.emp_of_mon_allowance) || 0;
    const transportAllowance =
      Number(editConfigEmployee.transport_allowance) || 0;
    const medicalAllowance = Number(editConfigEmployee.medical_allowance) || 0;

    const total =
      baseSalary + monthAllowance + transportAllowance + medicalAllowance;

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
        employee_id: Number(editConfigEmployee.employee_name),
        salary_amount: Number(editConfigEmployee.salary_amount),
        emp_of_mon_allowance: Number(editConfigEmployee.emp_of_mon_allowance),
        transport_allowance: Number(editConfigEmployee.transport_allowance),
        medical_allowance: Number(editConfigEmployee.medical_allowance),
        total_salary: Number(editConfigEmployee.total_salary),
        config_date: editConfigEmployee.config_date,
      };

      await axios.put(
        `${BASE_URL}/api/admin/updatesalary/${editData.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onSuccess();
      setModal();
    } catch (error) {
      console.error("Salary update failed:", error);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[39rem] bg-white mx-auto rounded-xl border border-indigo-500">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={setModal}>Update Salary</Title>

            <div className="mx-2 flex flex-col gap-3">
              <UserSelect
                labelName="Employee Name*"
                name="employee_name"
                value={editConfigEmployee.employee_name}
                handlerChange={handlerChange}
                optionData={allUsers}
                disabled
              />

              <InputField
                labelName="Salary Amount*"
                name="salary_amount"
                type="number"
                handlerChange={handlerChange}
                value={editConfigEmployee.salary_amount}
              />

              <InputField
                labelName="Employee Month Allowance*"
                name="emp_of_mon_allowance"
                type="number"
                handlerChange={handlerChange}
                value={editConfigEmployee.emp_of_mon_allowance}
              />

              <InputField
                labelName="Transport Allowance*"
                name="transport_allowance"
                type="number"
                handlerChange={handlerChange}
                value={editConfigEmployee.transport_allowance}
              />

              <InputField
                labelName="Medical Allowance*"
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
                labelName="Date*"
                name="config_date"
                type="date"
                handlerChange={handlerChange}
                value={editConfigEmployee.config_date}
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs">
              <CancelBtn setModal={setModal} />
              <AddButton label="Update Salary" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
