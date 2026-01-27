import React, { useState } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type AddAssetCategoryProps = {
  setModal: () => void;
  refreshCategories: () => void;
};

const initialState = {
  category_name: "",
};

export const AddAssetCategory = ({
  setModal,
  refreshCategories,
}: AddAssetCategoryProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addCategory, setAddCategory] = useState(initialState);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddCategory({ ...addCategory, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/createAssetCategory`,
        addCategory,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);

      refreshCategories();
      setAddCategory(initialState);
      setModal();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add category");
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-opacity-50 px-4  backdrop-blur-xs flex items-center justify-center z-50">
        <div className="w-[42rem] max-h-[28rem] bg-white mx-auto rounded-lg border border-indigo-900">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded-t-lg px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                ADD ASSET CATEGORY
              </Title>
            </div>
            <div className="mx-2 flex-wrap py-2 gap-3">
              <InputField
                labelName="Category Name *"
                placeHolder="Enter the Project Category"
                type="text"
                name="category_name"
                value={addCategory.category_name}
                handlerChange={handlerChange}
              />
            </div>

            <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
              <CancelBtn setModal={setModal} />
              <AddButton label="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
