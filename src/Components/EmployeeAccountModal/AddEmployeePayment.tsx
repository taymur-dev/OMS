import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type AddAttendanceProps = {
  setModal: () => void;
};

type User = {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  salary?: number;
  loginStatus: string;
  role: string;
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
  withdrawAccount: "",
  paymentMethod: "",
  paymentDate: "",
  balance: "",
  paidBy: "",
};

export const AddEmployeePayment = ({ setModal }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addConfigEmployee, setAddConfigEmployee] = useState(initialState);
  const [allUsers, setAllUsers] = useState<
    {
      id: string;
      label: string;
      value: string;
      contact: string;
      email: string;
      salary: string;
    }[]
  >([]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setAddConfigEmployee((prev) => {
      const updated = { ...prev, [name]: value };

      const salary = parseFloat(updated.payableSalary) || 0;
      const withdraw = parseFloat(updated.withdrawAccount) || 0;

      if (name === "withdrawAccount" || name === "payableSalary") {
        updated.balance = (salary - withdraw).toString();
      }

      return updated;
    });
  };

  const handleUserSelect = (selectedUserId: string) => {
    const selectedUser = allUsers.find((user) => user.value === selectedUserId);

    if (selectedUser) {
      const salary = selectedUser.salary || "0";
      const withdraw = addConfigEmployee.withdrawAccount || "0";

      setAddConfigEmployee((prev) => ({
        ...prev,
        selectEmployee: selectedUserId,
        employeeName: selectedUser.label,
        employeeContact: selectedUser.contact,
        employeeEmail: selectedUser.email,
        payableSalary: salary,
        balance: (parseFloat(salary) - parseFloat(withdraw)).toString(),
      }));
    } else {
      setAddConfigEmployee((prev) => ({
        ...prev,
        selectEmployee: "",
        employeeName: "",
        employeeContact: "",
        employeeEmail: "",
        payableSalary: "",
        balance: "",
      }));
    }
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer: ${token}` },
      });

      const filteredUsers = res?.data?.users
        ?.filter(
          (user: User) => user.loginStatus === "Y" && user.role === "user"
        )
        .map((user: User) => ({
          id: user.id,
          label: user.name,
          value: user.id,
          contact: user.contact || "",
          email: user.email || "",
          salary: user.salary?.toString() || "0",
        }));

      setAllUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  }, [token]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      "selectEmployee",
      "employeeName",
      "employeeContact",
      "employeeEmail",
      "payableSalary",
      "withdrawAccount",
      "paymentMethod",
      "paymentDate",
      "balance",
      "paidBy",
    ];

    for (const field of requiredFields) {
      if (!addConfigEmployee[field as keyof typeof addConfigEmployee]) {
        toast.error(`Please fill the ${field}`);
        return;
      }
    }

    try {
      const payload = {
        employeeId: addConfigEmployee.selectEmployee,
        employeeName: addConfigEmployee.employeeName,
        employeeContact: addConfigEmployee.employeeContact,
        employeeEmail: addConfigEmployee.employeeEmail,
        payableSalary: parseFloat(addConfigEmployee.payableSalary),
        withdrawAccount: parseFloat(addConfigEmployee.withdrawAccount),
        paymentMethod: addConfigEmployee.paymentMethod,
        paymentDate: addConfigEmployee.paymentDate,
        balance: parseFloat(addConfigEmployee.balance),
        paidBy: addConfigEmployee.paidBy,
      };

      await axios.post(`${BASE_URL}/api/admin/addEmployeePayment`, payload, {
        headers: { Authorization: `Bearer: ${token}` },
      });

      toast.success("Payment Withdraw added successfully!");
      setModal();
      setAddConfigEmployee(initialState);
    } catch (error) {
      console.error("Error saving payment:", error);
      toast.error("Failed to save Payment Withdraw");
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[39rem] overflow-y-auto mt-6 bg-white mx-auto rounded-xl border border-indigo-500">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={setModal}>Add Payment Withdraw</Title>

            <div className="mx-2 flex-wrap gap-3">
              <UserSelect
                labelName="Select Employee*"
                name="selectEmployee"
                value={addConfigEmployee.selectEmployee}
                handlerChange={(e) => handleUserSelect(e.target.value)} 
                optionData={allUsers}
              />

              <InputField
                labelName="Employee Name*"
                name="employeeName"
                type="text"
                handlerChange={handlerChange}
                value={addConfigEmployee.employeeName}
                readOnly
              />

              <InputField
                labelName="Employee Contact*"
                name="employeeContact"
                type="number"
                handlerChange={handlerChange}
                value={addConfigEmployee.employeeContact}
                readOnly
              />

              <InputField
                labelName="Employee Email*"
                name="employeeEmail"
                type="email"
                handlerChange={handlerChange}
                value={addConfigEmployee.employeeEmail}
                readOnly
              />

              <InputField
                labelName="Payable Salary*"
                name="payableSalary"
                type="number"
                handlerChange={handlerChange}
                value={addConfigEmployee.payableSalary}
                readOnly
              />

              <InputField
                labelName="Withdraw Account*"
                name="withdrawAccount"
                type="number"
                handlerChange={handlerChange}
                value={addConfigEmployee.withdrawAccount}
              />

              <InputField
                labelName="Balance*"
                name="balance"
                type="number"
                handlerChange={handlerChange}
                value={addConfigEmployee.balance}
                readOnly
              />

              <OptionField
                labelName="Payment Method*"
                name="paymentMethod"
                value={addConfigEmployee.paymentMethod}
                handlerChange={handlerChange}
                optionData={paymentMethods.map((d) => ({
                  id: d.id,
                  label: d.label,
                  value: d.value,
                }))}
                inital="Please Select"
              />

              <InputField
                labelName="Payment Date*"
                name="paymentDate"
                type="text"
                handlerChange={handlerChange}
                value={addConfigEmployee.paymentDate}
              />

              <InputField
                labelName="Paid By*"
                name="paidBy"
                type="number"
                handlerChange={handlerChange}
                value={addConfigEmployee.paidBy}
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs">
              <CancelBtn setModal={setModal} />
              <AddButton label="Save Payment Withdraw" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
