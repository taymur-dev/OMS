import React, { useEffect, useState, useCallback } from "react";

import { AddButton } from "../CustomButtons/AddButton";

import { CancelBtn } from "../CustomButtons/CancelBtn";

import { Title } from "../Title";

import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";

import { useAppSelector } from "../../redux/Hooks";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import { toast } from "react-toastify";

type AddAttendanceProps = {
  setModal: () => void;
};

const currentDate = new Date().toLocaleDateString("sv-SE");

type CategoryT = { id: number; categoryName: string };

const initialState = {
  expenseName: "",
  expenseCategoryId: "",
  amount: "",
  addedBy: "",
  date: currentDate,
};
export const AddExpense = ({ setModal }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [loading, setLoading] = useState(false);

  const [addExpense, setAddExpense] = useState(initialState);

  const [allExpenseCategory, setAllExpenseCategory] = useState<
    CategoryT[] | null
  >(null);

  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    e.preventDefault();

    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "expenseName") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "");
    }

    if (name === "amount") {
      updatedValue = value.replace(/\D/g, "");
    }

    if (name === "addedBy") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "");
    }

    setAddExpense({ ...addExpense, [name]: updatedValue });
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getExpenseCategory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllExpenseCategory(res?.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (addExpense.amount.length < 3) {
      return toast.error("Amount must be minimum 3 characters long");
    }

     if (addExpense.expenseName.length < 3) {
      return toast.error("Amount must be minimum 3 characters long");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/addExpense`,
        addExpense,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res.data);
      setModal();
      toast.success("Expense added successfully");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      if (error.response && error.response.status === 409) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update expense");
      }
      console.error("Failed to update expense:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);
  return (
    <div>
      <div
        className="fixed inset-0  bg-opacity-50 backdrop-blur-xs px-4   flex items-center justify-center z-50"
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <div className="w-[42rem] max-h-[28rem]  overflow-y-auto bg-white mx-auto rounded-xl shadow-xl ">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-white rounded-xl border-t-5 border-blue-400">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                Add Expense
              </Title>
            </div>
            <div className="mx-4 grid grid-cols-1  sm:grid-cols-2 md:grid-cols-2 py-6 gap-3  ">
              <OptionField
                labelName="Expense Category *"
                name="expenseCategoryId"
                value={addExpense.expenseCategoryId}
                handlerChange={handlerChange}
                optionData={allExpenseCategory?.map((category) => ({
                  id: category.id,
                  label: category.categoryName,
                  value: category.id,
                }))}
                inital="Please Select Category"
              />

              <InputField
                labelName="Expense Name *"
                name="expenseName"
                handlerChange={handlerChange}
                value={addExpense.expenseName}
                minLength={3}
                maxLength={50}
              />

              <InputField
                labelName="Amount *"
                name="amount"
                type="number"
                handlerChange={handlerChange}
                value={addExpense.amount}
                minLength={3}
                maxLength={12}
              />

              <InputField
                labelName="Added By *"
                name="addedBy"
                handlerChange={handlerChange}
                value={addExpense.addedBy}
                minLength={3}
                maxLength={50}
              />

              <div className="md:col-span-2">
                <InputField
                  labelName="Date*"
                  name="date"
                  type="date"
                  handlerChange={handlerChange}
                  value={addExpense.date}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-4 rounded py-6 bg-white">
              <CancelBtn setModal={setModal} />
              <AddButton
                loading={loading}
                label={loading ? "Saving" : "Save"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
