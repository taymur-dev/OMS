import React, { useState, useEffect } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";

import { Title } from "../Title";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type selectCategory = {
  id: number;
  categoryName: string;
};

type AddAttendanceProps = {
  setModal: () => void;
  selectCategory: selectCategory | null;
  getAllCategories: () => void;
};

export const EditCategory = ({
  setModal,
  selectCategory,
  getAllCategories,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [updateCategory, setUpdateCategory] = useState<selectCategory | null>(
    null,
  );

  useEffect(() => {
    if (selectCategory) {
      setUpdateCategory(selectCategory);
    }
  }, [selectCategory]);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;

    const updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);

    setUpdateCategory({
      ...updateCategory,
      [name]: updatedValue,
    } as selectCategory);
  };

  const token = currentUser?.token;

  const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/updateCategory/${updateCategory?.id}`,
        updateCategory,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      console.log(res.data.message);
      getAllCategories();
      setModal();
      toast.success(res.data.message, { toastId: "edit-success" });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs px-4   flex items-center justify-center z-50">
        <div className="w-[42rem] max-h-[28rem]  bg-white mx-auto rounded border  border-indigo-900 ">
          <form
            onSubmit={handleUpdateCategory}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          >
            <div className="bg-indigo-900 rounded px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                EDIT PROJECT CATEGORY
              </Title>
            </div>
            <div className="mx-2   flex-wrap gap-3 py-5  ">
              <InputField
                labelName="Category Name *"
                type="text"
                name="categoryName"
                value={updateCategory?.categoryName}
                handlerChange={handlerChange}
              />
            </div>

            <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
              <CancelBtn setModal={setModal} />
              <AddButton label="Update" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
