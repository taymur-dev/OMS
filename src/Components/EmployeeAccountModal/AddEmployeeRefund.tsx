import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type AddEmployeeRefundProps = {
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
  paymentMethod: "",
  paymentAmount: "",
  refundAmount: "",
  balance: "",
  date: "",
};

export const AddEmployeeRefund = ({ setModal }: AddEmployeeRefundProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addConfigEmployee, setAddConfigEmployee] = useState(initialState);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setAddConfigEmployee((prev) => ({ ...prev, [name]: value }));

    if (name === "selectEmployee") {
      const selectedUser = allUsers.find((u) => u.id === Number(value));
      if (selectedUser) {
        setAddConfigEmployee((prev) => ({
          ...prev,
          employeeName: selectedUser.name,
          employeeContact: selectedUser.contact,
          employeeEmail: selectedUser.email,
        }));
      }
    }
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API response users:", res.data); 
      setAllUsers(res?.data?.users || []);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const userOptions = allUsers
    .filter(
      (user) =>
        user.loginStatus?.toUpperCase() === "Y" &&
        user.role?.toLowerCase() === "user"
    )
    .map((user) => ({ value: user.id.toString(), label: user.name }));

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        employeeId: addConfigEmployee.selectEmployee,
        employeeName: addConfigEmployee.employeeName,
        employeeContact: addConfigEmployee.employeeContact,
        employeeEmail: addConfigEmployee.employeeEmail,
        paymentMethod: addConfigEmployee.paymentMethod,
        paymentAmount: addConfigEmployee.paymentAmount,
        refundAmount: addConfigEmployee.refundAmount,
        balance: addConfigEmployee.balance,
        date: addConfigEmployee.date,
      };

      await axios.post(`${BASE_URL}/api/admin/addEmployeeRefund`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Refund added successfully!");
      setModal();
      setAddConfigEmployee(initialState);
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Failed to add refund.";
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[39rem] overflow-y-auto mt-6 bg-white mx-auto rounded-xl border border-indigo-500">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={setModal}>Add Payment Refund</Title>

          <div className="mx-2 flex-wrap gap-3">
            <UserSelect
              labelName="Select Employee*"
              name="selectEmployee"
              value={addConfigEmployee.selectEmployee}
              handlerChange={handlerChange}
              optionData={userOptions}
            />

            <InputField
              labelName="Employee Name*"
              name="employeeName"
              type="text"
              handlerChange={handlerChange}
              value={addConfigEmployee.employeeName}
            />

            <InputField
              labelName="Employee Contact*"
              name="employeeContact"
              type="number"
              handlerChange={handlerChange}
              value={addConfigEmployee.employeeContact}
            />

            <InputField
              labelName="Employee Email*"
              name="employeeEmail"
              type="email"
              handlerChange={handlerChange}
              value={addConfigEmployee.employeeEmail}
            />

            <InputField
              labelName="Payment Amount*"
              name="paymentAmount"
              type="text"
              handlerChange={handlerChange}
              value={addConfigEmployee.paymentAmount}
            />

            <InputField
              labelName="Refund Amount*"
              name="refundAmount"
              type="text"
              handlerChange={handlerChange}
              value={addConfigEmployee.refundAmount}
            />

            <InputField
              labelName="Balance*"
              name="balance"
              type="number"
              handlerChange={handlerChange}
              value={addConfigEmployee.balance}
            />

            <OptionField
              labelName="Payment Method*"
              name="paymentMethod"
              value={addConfigEmployee.paymentMethod}
              handlerChange={handlerChange}
              optionData={paymentMethods}
              inital="Please Select"
            />

            <InputField
              labelName="Date*"
              name="date"
              type="date"
              handlerChange={handlerChange}
              value={addConfigEmployee.date}
            />
          </div>

          <div className="flex items-center justify-center m-2 gap-2 text-xs">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save Payment Refund" />
          </div>
        </form>
      </div>
    </div>
  );
};
