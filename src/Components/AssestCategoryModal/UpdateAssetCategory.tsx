import React, { useState, useEffect } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type UpdateAssetCategoryProps = {
  categoryId: number;
  setModal: () => void;
  refreshCategories: () => void;
};

const initialState = {
  category_name: "",
};

export const UpdateAssetCategory = ({
  setModal,
  categoryId,
  refreshCategories,
}: UpdateAssetCategoryProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [updateCategory, setUpdateCategory] = useState(initialState);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/admin/assetCategories/${categoryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUpdateCategory({ category_name: res.data.category_name });
      } catch (error) {
        console.log(error);
        toast.error("Failed to load category data.");
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, token]);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateCategory({ ...updateCategory, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/updateAssetCategory/${categoryId}`,
        updateCategory,
        { headers: { Authorization: token } }
      );
      refreshCategories();
      toast.success(res.data.message);
      setModal();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update category.");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[28rem] bg-white mx-auto rounded-xl border border-indigo-500">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={setModal}>Update Asset Category</Title>
          <div className="mx-2 flex-wrap gap-3">
            <InputField
              labelName="Category Name*"
              placeHolder="Enter the Project Category"
              type="text"
              name="category_name"
              value={updateCategory.category_name}
              handlerChange={handlerChange}
            />
          </div>
          <div className="flex items-center justify-center m-2 gap-2 text-xs">
            <CancelBtn setModal={setModal} />
            <AddButton label={"Update Category"} />
          </div>
        </form>
      </div>
    </div>
  );
};
