import React, { useState } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type AddAttendanceProps = {
  setModal: () => void;
  getAllCategories: () => void;
};

const initialState = {
  categoryName: "",
};
export const AddProjectCategory = ({
  setModal,
  getAllCategories,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [addCategory, setAddCategory] = useState(initialState);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAddCategory({ ...addCategory, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/createCategory`,
        addCategory,
        { headers: { Authorization: token } }
      );
      console.log(res.data);
      getAllCategories();
      toast.success(res.data.message);
      setModal();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[28rem]  bg-white mx-auto rounded-xl border  border-indigo-500 ">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={() => setModal()}>Add Category</Title>
            <div className="mx-2   flex-wrap gap-3  ">
              <InputField
                labelName="Category Name*"
                placeHolder="Enter the Project Category"
                type="text"
                name="categoryName"
                value={addCategory.categoryName}
                handlerChange={handlerChange}
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Save Category"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
