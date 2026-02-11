import React, { useState } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { InputField } from "../InputFields/InputField";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type AddCategoryProps = {
  setModal: () => void;
  refreshTable: () => void;
};

const initialState = {
  categoryName: "",
};

export const AddCategory = ({ setModal, refreshTable }: AddCategoryProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addCategory, setAddCategory] = useState(initialState);

    const [loading, setLoading] = useState(false);


  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "categoryName") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
    }

    setAddCategory({ ...addCategory, [name]: updatedValue });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!addCategory.categoryName.trim()) {
      return toast.error("Expense category name is required", {
        toastId: "required-category",
      });
    }

        setLoading(true);


    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/createExpenseCategory`,
        addCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Expense category added successfully", {
        toastId: "category-success",
      });

      refreshTable();
      console.log(res.data);
      setModal();
    } catch (error: unknown) {
      toast.error("Failed to add category", { toastId: "category-error" });
      console.error("Add Category Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50"
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded border border-indigo-900">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                ADD EXPENSE CATEGORY
              </Title>
            </div>
            <div className="mx-2 flex-wrap py-4 gap-3">
              <InputField
                labelName="Expense Category *"
                name="categoryName"
                value={addCategory.categoryName}
                handlerChange={handlerChange}
              />
            </div>
            <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
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
