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

const payment_type = [
  { id: 1, label: "Debit", value: "debit" },
  { id: 2, label: "Credit", value: "credit" },
];

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
  payment_type: "",
  amount: "",
  payment_method: "",
  payment_date: currentDate,
};

export const AddEmployeeAccount = ({ setModal, refreshData }: Props) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [form, setForm] = useState(initialState);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    let updatedValue = value;

    if (type === "number") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
    }

    setForm((prev) => {
      const updated = { ...prev, [name]: updatedValue };

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
          (u: User) => u.loginStatus === "Y" && u.role === "user",
        ),
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

    const {
      selectEmployee,
      employee_name,
      employeeContact,
      employeeEmail,
      payment_type,
      amount,
    } = form;

    // Validation
    if (
      !selectEmployee ||
      !payment_type ||
      Number(amount) <= 0 ||
      !employee_name?.trim() ||
      !employeeContact?.trim() ||
      !employeeEmail?.trim()
    ) {
      return toast.error("Please Fill in all fields", {
        toastId: "employee-account-validation-employee",
      });
    }

    setLoading(true);

    try {
      await axios.post(
        `${BASE_URL}/api/admin/addEmployeeAccount`,
        {
          employee_id: Number(form.selectEmployee),
          employee_name: form.employee_name,
          employeeContact: form.employeeContact,
          employeeEmail: form.employeeEmail,
          payment_type: form.payment_type,
          amount: Number(form.amount),
          payment_method: form.payment_method,
          payment_date: form.payment_date,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Employee account entry added!", {
        toastId: "employee-account-success",
      });

      setForm(initialState);
      setModal();
      refreshData?.();
    } catch (error: unknown) {
      console.error("Error occuring while adding amount:", error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to add payment in employee acoount";

        toast.error(message, { toastId: "error" });
      } else {
        toast.error("Something went wrong", { toastId: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 px-4  backdrop-blur-xs flex items-center justify-center z-50"
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      <div className="w-[42rem] bg-white rounded border border-indigo-900">
        <form onSubmit={handleSubmit}>
          <div className="bg-indigo-900 rounded px-6">
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

            <OptionField
              labelName="Payment Type *"
              name="payment_type"
              value={form.payment_type}
              handlerChange={handlerChange}
              optionData={payment_type}
              inital="Please Select"
            />

            <InputField
              labelName="Amount *"
              name="amount"
              type="number"
              value={form.amount}
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

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton loading={loading} label={loading ? "Saving" : "Save"} />
          </div>
        </form>
      </div>
    </div>
  );
};
