import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type ExpenseCategoryT = { id: number; categoryName: string };

type ExpenseT = {
  id: number;
  expenseName: string;
  expenseCategoryId: number;
  categoryName: string;
  addedBy: string;
  date: string;
  amount: number | string;
};

type EditExpenseProps = {
  setModal: () => void;
  editExpense: ExpenseT | null;
};

export const EditExpense = ({ setModal, editExpense }: EditExpenseProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [expense, setExpense] = useState<ExpenseT | null>(editExpense);
  const [categories, setCategories] = useState<ExpenseCategoryT[] | null>(null);

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setExpense((prev) => prev && { ...prev, [name]: value });
  };

  const getAllCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getExpenseCategory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!expense) return;

    try {
      await axios.put(
        `${BASE_URL}/api/admin/updateExpense/${expense.id}`,
        {
          expenseName: expense.expenseName,
          expenseCategoryId: expense.expenseCategoryId,
          amount: expense.amount,
          addedBy: expense.addedBy,
          date: expense.date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Expense updated successfully!");
      setModal();
    } catch (error) {
      console.error("Failed to update expense:", error);
      toast.error("Failed to update expense");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[90rem] bg-white mx-auto rounded-xl border border-indigo-900 overflow-auto">
        <form onSubmit={handleSubmit}>

           <div className="bg-indigo-900 rounded-t-xl px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                Edit Expense
              </Title>
            </div>
          <div className="mx-2 flex-wrap py-2 gap-3">
            <OptionField
              labelName="Expense Category*"
              name="expenseCategoryId"
              value={
                expense?.expenseCategoryId
                  ? String(expense.expenseCategoryId)
                  : ""
              }
              handlerChange={handlerChange}
              optionData={categories?.map((cat) => ({
                id: cat.id,
                label: cat.categoryName,
                value: cat.id,
              }))}
              inital="Please Select Category"
            />

            <InputField
              labelName="Expense Name*"
              name="expenseName"
              handlerChange={handlerChange}
              value={expense?.expenseName ?? ""}
            />

            <InputField
              labelName="Amount*"
              name="amount"
              type="number"
              handlerChange={handlerChange}
              value={expense?.amount ? String(expense.amount) : ""}
            />

            <InputField
              labelName="Added By*"
              name="addedBy"
              handlerChange={handlerChange}
              value={expense?.addedBy ?? ""}
            />

            <InputField
              labelName="Date*"
              name="date"
              type="date"
              handlerChange={handlerChange}
              value={expense?.date?.slice(0, 10) ?? ""}
            />
          </div>

           <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
              <CancelBtn setModal={setModal} />
              <AddButton label="Update" />
            </div>
        </form>
      </div>
    </div>
  );
};
