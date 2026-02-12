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
  existingCategories: { category_name: string }[];
};

const initialState = {
  category_name: "",
};

export const AddAssetCategory = ({
  setModal,
  refreshCategories,
  existingCategories,
}: AddAssetCategoryProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addCategory, setAddCategory] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "category_name") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
    }

    setAddCategory({ ...addCategory, [name]: updatedValue });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nameTrimmed = addCategory.category_name?.trim();

    if (!token) {
      return toast.error("Unauthorized", {
        toastId: "asset-category-unauthorized",
      });
    }

    if (!addCategory.category_name?.trim()) {
      return toast.error("Category name is required", {
        toastId: "asset-category-required",
      });
    }

    const isDuplicate = existingCategories.some(
    (cat) => cat.category_name.toLowerCase() === nameTrimmed.toLowerCase()
  );

  if (isDuplicate) {
    return toast.error("This category name already exists", {
      toastId: "duplicate-category",
    });
  }

    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/createAssetCategory`,
        addCategory,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(res.data.message || "Category added successfully", {
        toastId: "asset-category-success",
      });

      refreshCategories();
      setAddCategory(initialState);
      setModal();
    } catch (error: unknown) {
      console.error("Add category failed:", error);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add category", {
          toastId: "asset-category-error",
        });
      } else {
        toast.error("Something went wrong", {
          toastId: "asset-category-error-unknown",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="fixed inset-0 bg-opacity-50 px-4  backdrop-blur-xs flex items-center justify-center z-50"
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <div className="w-[42rem] max-h-[28rem] bg-white mx-auto rounded border border-indigo-900">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded px-6">
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
                type="text"
                name="category_name"
                value={addCategory.category_name}
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
