import React, { useState } from "react";
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

  const [updateCategory, setUpdateCategory] = useState(selectCategory);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUpdateCategory({ ...updateCategory, [name]: value } as selectCategory);
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
        }
      );
      console.log(res.data.message);
      getAllCategories();
      setModal();
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[28rem]  bg-white mx-auto rounded-xl border  border-indigo-500 ">
          <form onSubmit={handleUpdateCategory}>
            <Title setModal={() => setModal()}>Update Category</Title>
            <div className="mx-2   flex-wrap gap-3  ">
              <InputField
                labelName="Category Name*"
                placeHolder="Enter the Project Category"
                type="text"
                name="categoryName"
                inputVal={updateCategory?.categoryName}
                handlerChange={handlerChange}
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Update Category"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
