import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type AddAttendanceProps = {
  setModal: () => void;
};

type UserOption = {
  id: string;
  label: string;
  value: string;
  contact: string;
  email: string;
};

type ApiUser = {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  loginStatus: "Y" | "N";
  role: "user" | "admin";
};

type SalaryConfig = {
  employee_id: number;
  total_salary: number;
};

const paymentMethods = [
  { id: 1, label: "EasyPaisy", value: "easyPaisy" },
  { id: 2, label: "Bank Transfer", value: "bankTransfer" },
  { id: 3, label: "Cash", value: "cash" },
];

const initialState = {
  selectEmployee: "",
  employeeName: "",
  employeeContact: "",
  employeeEmail: "",
  payableSalary: "",
  withdrawAmount: "",
  paymentMethod: "",
  paymentDate: "",
  balance: "",
};

export const AddEmployeePayment = ({ setModal }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [form, setForm] = useState(initialState);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [salaries, setSalaries] = useState<SalaryConfig[]>([]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      const salary = Number(updated.payableSalary) || 0;
      const withdraw = Number(updated.withdrawAmount) || 0;

      updated.balance = (salary - withdraw).toString();
      return updated;
    });
  };

  const handleUserSelect = (userId: string) => {
    const user = users.find((u) => u.value === userId);
    const salaryConfig = salaries.find((s) => s.employee_id === Number(userId));

    const salary = salaryConfig?.total_salary || 0;
    const withdraw = Number(form.withdrawAmount) || 0;

    if (!user) return;

    setForm((prev) => ({
      ...prev,
      selectEmployee: userId,
      employeeName: user.label,
      employeeContact: user.contact,
      employeeEmail: user.email,
      payableSalary: salary.toString(),
      balance: (salary - withdraw).toString(),
    }));
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mappedUsers = res.data.users
        .filter((u: ApiUser) => u.loginStatus === "Y" && u.role === "user")
        .map((u: ApiUser) => ({
          id: u.id,
          label: u.name,
          value: u.id,
          contact: u.contact || "",
          email: u.email || "",
        }));

      setUsers(mappedUsers);
    } catch {
      toast.error("Failed to fetch users");
    }
  }, [token]);

  const getSalaries = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getsalaries`);
      setSalaries(res.data.salaries);
    } catch {
      toast.error("Failed to fetch salaries");
    }
  }, []);

  useEffect(() => {
    getAllUsers();
    getSalaries();
  }, [getAllUsers, getSalaries]);

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        `${BASE_URL}/api/admin/addEmployeePayment`,
        {
          employeeId: form.selectEmployee,
          employeeName: form.employeeName,
          employeeContact: form.employeeContact,
          employeeEmail: form.employeeEmail,
          payableSalary: Number(form.payableSalary),
          withdrawAmount: Number(form.withdrawAmount),
          paymentMethod: form.paymentMethod,
          paymentDate: form.paymentDate,
          balance: Number(form.balance),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Payment Withdraw added successfully");
      setForm(initialState);
      setModal();
    } catch {
      toast.error("Failed to save payment");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] bg-white rounded-xl border border-indigo-500">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={setModal}>Add Payment Withdraw</Title>

          <div className="mx-2 flex-wrap gap-3">
            <UserSelect
              labelName="Select Employee*"
              name="selectEmployee"
              value={form.selectEmployee}
              handlerChange={(e) => handleUserSelect(e.target.value)}
              optionData={users}
            />

            <InputField
              labelName="Employee Name*"
              value={form.employeeName}
              readOnly
            />
            <InputField
              labelName="Employee Contact*"
              value={form.employeeContact}
              readOnly
            />
            <InputField
              labelName="Employee Email*"
              value={form.employeeEmail}
              readOnly
            />
            <InputField
              labelName="Payable Salary*"
              value={form.payableSalary}
              readOnly
            />

            <InputField
              labelName="Withdraw Amount*"
              name="withdrawAmount"
              type="number"
              value={form.withdrawAmount}
              handlerChange={handlerChange}
            />

            <InputField labelName="Balance*" value={form.balance} readOnly />

            <OptionField
              labelName="Payment Method*"
              name="paymentMethod"
              value={form.paymentMethod}
              handlerChange={handlerChange}
              optionData={paymentMethods}
              inital="Please Select"
            />

            <InputField
              labelName="Payment Date*"
              name="paymentDate"
              type="date"
              value={form.paymentDate}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex justify-center gap-2 m-2">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save Payment Withdraw" />
          </div>
        </form>
      </div>
    </div>
  );
};
