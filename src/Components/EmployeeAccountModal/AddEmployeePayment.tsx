import React, { useCallback, useEffect, useState } from "react";
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

type AddEmployeePaymentProps = {
  setModal: () => void;
};

type User = {
  id: number;
  name: string;
  contact: string;
  email: string;
  role: string;
  loginStatus: string;
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
  withdrawAmount: "",
  balance: "",
  paymentMethod: "",
  paymentDate: "",
};

export const AddEmployeePayment = ({ setModal }: AddEmployeePaymentProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [form, setForm] = useState(initialState);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "selectEmployee") {
        const selectedUser = allUsers.find((u) => u.id === Number(value));

        if (selectedUser) {
          updated.employeeName = selectedUser.name;
          updated.employeeContact = selectedUser.contact;
          updated.employeeEmail = selectedUser.email;
        }
      }

    

      if (name === "withdrawAmount") {
        updated.balance = value;
      }

      return updated;
    });
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res.data.users || []);
    } catch {
      toast.error("Failed to fetch users");
    }
  }, [token]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const userOptions = allUsers
    .filter((u) => u.loginStatus === "Y" && u.role === "user")
    .map((u) => ({ value: u.id.toString(), label: u.name }));

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
          withdrawAmount: Number(form.withdrawAmount),
          balance: Number(form.balance),
          paymentMethod: form.paymentMethod,
          paymentDate: form.paymentDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Payment Withdraw added successfully!");
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
              handlerChange={handlerChange}
              optionData={userOptions}
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
