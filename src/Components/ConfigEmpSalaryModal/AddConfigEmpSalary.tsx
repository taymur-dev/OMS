import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect, SelectOption } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type AddSalaryProps = {
  setModal: () => void;
  onSuccess: () => void;
};

type ApiUser = {
  id: number;
  name: string;
  loginStatus: string;
  projectName: string;
  role: string;
};

type SalaryState = {
  employeeId: string;
  salary_amount: string;
  emp_of_mon_allowance: string;
  transport_allowance: string;
  medical_allowance: string;
  total_salary: string;
  config_date: string;
};

const initialState: SalaryState = {
  employeeId: "",
  salary_amount: "",
  emp_of_mon_allowance: "",
  transport_allowance: "",
  medical_allowance: "",
  total_salary: "",
  config_date: "",
};

export const AddConfigEmpSalary = ({ setModal, onSuccess }: AddSalaryProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addConfigEmployee, setAddConfigEmployee] =
    useState<SalaryState>(initialState);

  const [allUsers, setAllUsers] = useState<SelectOption[]>([]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddConfigEmployee((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const baseSalary = Number(addConfigEmployee.salary_amount) || 0;
    const monthAllowance = Number(addConfigEmployee.emp_of_mon_allowance) || 0;
    const transportAllowance =
      Number(addConfigEmployee.transport_allowance) || 0;
    const medicalAllowance = Number(addConfigEmployee.medical_allowance) || 0;

    const total =
      baseSalary + monthAllowance + transportAllowance + medicalAllowance;

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
        employee_id: addConfigEmployee.employeeId,
        salary_amount: Number(addConfigEmployee.salary_amount),
        emp_of_mon_allowance: Number(addConfigEmployee.emp_of_mon_allowance),
        transport_allowance: Number(addConfigEmployee.transport_allowance),
        medical_allowance: Number(addConfigEmployee.medical_allowance),
        total_salary: Number(addConfigEmployee.total_salary),
        config_date: addConfigEmployee.config_date,
      };

      await axios.post(`${BASE_URL}/api/admin/addsalaries`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });


      onSuccess();
      setModal();
    } catch (error) {
      console.error("Salary submit failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[39rem] bg-white mx-auto rounded-xl border border-indigo-500 overflow-auto">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={setModal}>Add Salary</Title>

          <div className="mx-2 flex flex-wrap gap-3">
            <UserSelect
              labelName="Employee Name*"
              name="employeeId"
              value={addConfigEmployee.employeeId}
              handlerChange={handlerChange}
              optionData={allUsers}
            />

            <InputField
              labelName="Salary Amount*"
              name="salary_amount"
              type="number"
              handlerChange={handlerChange}
              value={addConfigEmployee.salary_amount}
            />

            <InputField
              labelName="Employee Month Allowance*"
              name="emp_of_mon_allowance"
              type="number"
              handlerChange={handlerChange}
              value={addConfigEmployee.emp_of_mon_allowance}
            />

            <InputField
              labelName="Transport Allowance*"
              name="transport_allowance"
              type="number"
              handlerChange={handlerChange}
              value={addConfigEmployee.transport_allowance}
            />

            <InputField
              labelName="Medical Allowance*"
              name="medical_allowance"
              type="number"
              handlerChange={handlerChange}
              value={addConfigEmployee.medical_allowance}
            />

            <InputField
              labelName="Total Salary"
              name="total_salary"
              type="number"
              value={addConfigEmployee.total_salary}
              handlerChange={() => {}}
              disabled
            />

            <InputField
              labelName="Date*"
              name="config_date"
              type="date"
              handlerChange={handlerChange}
              value={addConfigEmployee.config_date}
            />
          </div>

          <div className="flex items-center justify-center m-2 gap-2 text-xs">
            <CancelBtn setModal={setModal} />
            <AddButton label={"Save Salary"} />
          </div>
        </form>
      </div>
    </div>
  );
};
