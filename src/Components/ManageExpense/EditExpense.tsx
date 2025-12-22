import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type allExpenseT = {
  id: number;
  expenseName: string;
  expenseCategoryId: number;
  categoryName: string;
  addedBy: string;
  date: string;
  expenseStatus: string;
  amount: number | string;
};

type AddAttendanceProps = {
  setModal: () => void;
  editExpense: allExpenseT | null;
};

export const EditExpense = ({ setModal, editExpense }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const [addExpense, setAddExpense] = useState<allExpenseT | null>(editExpense);
  const [allUsers, setAllUsers] = useState([]);
  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setAddExpense((prev) => ({ ...prev, [name]: value } as allExpenseT));
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: token },
      });
      setAllUsers(res?.data?.users);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!addExpense) return;

    try {
      await axios.put(
        `${BASE_URL}/api/admin/updateExpense/${addExpense.id}`,
        {
          expenseName: addExpense.expenseName,
          expenseCategoryId: addExpense.expenseCategoryId,
          amount: addExpense.amount,
          date: addExpense.date,
        },
        { headers: { Authorization: token } }
      );

      setModal(); // close modal after success
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <div>
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[28rem] bg-white mx-auto rounded-xl border border-indigo-500">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={() => setModal()}>Update Expense</Title>
            <div className="mx-2 flex-wrap gap-3">
              <UserSelect
                labelName="Employees*"
                name="employeeName"
                value={addExpense?.expenseName ?? ""}
                handlerChange={handlerChange}
                optionData={allUsers}
              />

              <InputField
                labelName="Expense Category*"
                name="categoryName"
                handlerChange={handlerChange}
                inputVal={addExpense?.categoryName ?? ""}
              />

              <InputField
                labelName="Amount*"
                name="amount"
                handlerChange={handlerChange}
                inputVal={addExpense?.amount ? String(addExpense.amount) : ""}
              />

              <InputField
                labelName="Add By*"
                name="addedBy"
                handlerChange={handlerChange}
                inputVal={addExpense?.addedBy ?? ""}
              />

              <InputField
                labelName="Date*"
                name="date"
                handlerChange={handlerChange}
                inputVal={addExpense?.date?.slice(0, 10) ?? ""}
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Update Expense"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
