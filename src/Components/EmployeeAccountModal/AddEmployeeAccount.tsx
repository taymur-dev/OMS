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

type Props = {
  setModal: () => void;
  refreshData?: () => void;
};

type User = {
  id: number;
  name: string;
  contact: string;
  email: string;
  role: string;
  loginStatus: string;
};

const payment_method = [
  { id: 1, label: "EasyPaisa", value: "easyPaisa" },
  { id: 2, label: "Bank Transfer", value: "bankTransfer" },
  { id: 3, label: "Cash", value: "cash" },
];

const currentDate = new Date().toLocaleDateString("en-CA");


const initialState = {
  selectEmployee: "",
  employee_name: "",
  employeeContact: "",
  employeeEmail: "",
  debit: "",
  credit: "",
  payment_method: "",
  payment_date: currentDate,
};

export const AddEmployeeAccount = ({ setModal, refreshData }: Props) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [form, setForm] = useState(initialState);
  const [users, setUsers] = useState<User[]>([]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "selectEmployee") {
        const emp = users.find((u) => u.id === Number(value));
        if (emp) {
          updated.employee_name = emp.name;
          updated.employeeContact = emp.contact;
          updated.employeeEmail = emp.email;
        }
      }
      return updated;
    });
  };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(
        res.data.users.filter(
          (u: User) => u.loginStatus === "Y" && u.role === "user"
        )
      );
    } catch {
      toast.error("Failed to fetch employees");
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const employeeOptions = users.map((u) => ({
    value: u.id.toString(),
    label: u.name,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.selectEmployee) {
      toast.error("Please select employee");
      return;
    }

    if (!form.debit && !form.credit) {
      toast.error("Enter debit or credit amount");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/admin/addEmployeeAccount`,
        {
          employee_id: Number(form.selectEmployee),
          employee_name: form.employee_name,
          employeeContact: form.employeeContact,
          employeeEmail: form.employeeEmail,
          debit: Number(form.debit || 0),
          credit: Number(form.credit || 0),
          payment_method: form.payment_method,
          payment_date: form.payment_date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Employee account entry added!");
      setForm(initialState);
      setModal();
      refreshData?.();
    } catch {
      toast.error("Failed to save employee account");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 px-4  backdrop-blur-xs flex items-center justify-center z-50">
      <div className="w-[42rem] bg-white rounded-lg border border-indigo-900">
        <form onSubmit={handleSubmit}>
          <div className="bg-indigo-900 rounded-t-lg px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              ADD EMPLOYEE ACCOUNT
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            <UserSelect
              labelName="Select Employee *"
              name="selectEmployee"
              value={form.selectEmployee}
              handlerChange={handlerChange}
              optionData={employeeOptions}
            />

            <InputField
              labelName="Employee Name *"
              value={form.employee_name}
              readOnly
            />
            <InputField
              labelName="Employee Contact *"
              value={form.employeeContact}
              readOnly
            />
            <InputField
              labelName="Employee Email *"
              value={form.employeeEmail}
              readOnly
            />

            <InputField
              labelName="Debit *"
              name="debit"
              type="number"
              value={form.debit}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Credit *"
              name="credit"
              type="number"
              value={form.credit}
              handlerChange={handlerChange}
            />

            <OptionField
              labelName="Payment Method *"
              name="payment_method"
              value={form.payment_method}
              handlerChange={handlerChange}
              optionData={payment_method}
              inital="Please Select"
            />

            <InputField
              labelName="Payment Date *"
              name="payment_date"
              type="date"
              value={form.payment_date}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save" />
          </div>
        </form>
      </div>
    </div>
  );
};
