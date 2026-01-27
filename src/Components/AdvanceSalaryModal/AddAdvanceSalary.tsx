import React, { useCallback, useEffect, useState } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type AddAdvanceSalaryProps = {
  setModal: () => void;
  handleRefresh?: () => void;
};

type User = {
  id: number | string;
  name?: string;
  employee_name?: string;
  role: string;
  loginStatus: "Y" | "N" | string;
};

type AdvanceSalaryFormType = {
  employee_id: string; 
  date: string;
  description: string;
  amount: string; 
};

const today = new Date();
const currentDate = today.toLocaleDateString('sv-SE');

const initialState: AdvanceSalaryFormType = {
  employee_id: "",
  date: currentDate,
  description: "",
  amount: "",
};

export const AddAdvanceSalary = ({ setModal, handleRefresh }: AddAdvanceSalaryProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [formData, setFormData] = useState<AdvanceSalaryFormType>(initialState);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const getAllUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get<{ users: User[] }>(
        `${BASE_URL}/api/admin/getUsers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllUsers(res.data.users ?? []);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users");
    }
  }, [token]);

  useEffect(() => {
    if (isAdmin) {
      getAllUsers();
    } else if (currentUser?.role === "user") {
      setFormData((prev) => ({
        ...prev,
        employee_id: String(currentUser.id),
      }));
    }
  }, [isAdmin, currentUser, getAllUsers]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.employee_id || !formData.date || !formData.description || !formData.amount) {
      toast.error("Please fill all required fields");
      return;
    }
    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/createAdvanceSalary`,
        {
          ...formData,
          employee_id: Number(formData.employee_id),
          amount: Number(formData.amount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Advance Salary added successfully");
      setModal();
      handleRefresh?.(); 
      setFormData(initialState);
    } catch (err) {
      console.error("Error adding advance salary:", err);
      toast.error("Failed to add advance salary");
    }
  };

  const userOptions = allUsers
    .filter((u) => u.role === "user" && u.loginStatus === "Y")
    .map((u) => ({
      value: String(u.id),
      label: u.employee_name || u.name || "User",
    }));

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur px-4  flex items-center justify-center z-50">
      <div className="w-[42rem] bg-white rounded-lg border border-indigo-900">
        <form onSubmit={handleSubmit}>

           <div className="bg-indigo-900 rounded-t-lg px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                Add Advance Salary
              </Title>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 mx-2 gap-2 py-2 space-y-2">
            {isAdmin && (
              <UserSelect
                labelName="Employees *"
                name="employee_id"
                value={formData.employee_id}
                handlerChange={handleChange}
                optionData={userOptions}
              />
            )}

            {!isAdmin && (
              <InputField
                labelName="Employee *"
                name="employee_id"
                value={currentUser?.name || ""}
                handlerChange={handleChange}
                disabled
              />
            )}

            <InputField
              labelName="Date *"
              type="date"
              name="date"
              value={formData.date}
              handlerChange={handleChange}
            />

            <InputField
              labelName="Amount *"
              type="number"
              name="amount"
              value={formData.amount}
              handlerChange={handleChange}
            />

            <TextareaField
              labelName="Description *"
              name="description"
              inputVal={formData.description}
              handlerChange={handleChange}
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
