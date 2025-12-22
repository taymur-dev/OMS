import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { InputField } from "../InputFields/InputField";

type EditCategoryProps = {
  setModal: () => void;
  categoryId: number;
  categoryName: string;
};

export const EditCategory = ({
  setModal,
  categoryId,
  categoryName,
}: EditCategoryProps) => {
  const [updateCategory, setUpdateCategory] = useState({
    expenseCategory: categoryName,
  });

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateCategory({ ...updateCategory, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/updateExpenseCategory/${categoryId}`,
        {
          expenseCategory: updateCategory.expenseCategory,
        }
      );

      if (res.status === 200) {
        setModal(); // close modal
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] bg-white rounded-xl border border-indigo-500">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={setModal}>Update Expense Category</Title>

          <div className="mx-2">
            <InputField
              labelName="Expense Category*"
              name="expenseCategory"
              inputVal={updateCategory.expenseCategory}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex items-center justify-center m-2 gap-2 text-xs">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update Category" />
          </div>
        </form>
      </div>
    </div>
  );
};
