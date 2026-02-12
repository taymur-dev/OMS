import React, { useState, useEffect, useCallback } from "react";
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

  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState<selectCategory[]>([]);
  const [updateCategory, setUpdateCategory] = useState<selectCategory | null>(
    null,
  );

  // Fetch all categories for duplication validation
  const fetchAllCategories = useCallback(async () => {
    try {
      const token = currentUser?.token;
      const res = await axios.get(`${BASE_URL}/api/admin/getAllCategories`, {
        headers: {
          Authorization: token,
        },
      });
      setAllCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories for validation:", error);
    }
  }, [currentUser?.token]);

  useEffect(() => {
    if (selectCategory) {
      setUpdateCategory(selectCategory);
      fetchAllCategories();
    }
  }, [selectCategory, fetchAllCategories]);

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

  const isDuplicateCategory = (
    categoryName: string,
    currentId: number,
  ): boolean => {
    return allCategories.some(
      (category) =>
        category.categoryName.toLowerCase() === categoryName.toLowerCase() &&
        category.id !== currentId, // Exclude current category being edited
    );
  };

  const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!updateCategory?.categoryName?.trim()) {
      toast.error("Category name is required", {
        toastId: "category-required",
      });
      return;
    }

    const trimmedCategoryName = updateCategory.categoryName.trim();

    // Check for duplicate category name
    if (isDuplicateCategory(trimmedCategoryName, updateCategory.id)) {
      toast.error(
        "Category name already exists. Please use a different name.",
        {
          toastId: "category-duplicate",
        },
      );
      return;
    }

    // Check if the name hasn't changed
    if (trimmedCategoryName === selectCategory?.categoryName) {
      toast.info("No changes were made to the category name", {
        toastId: "no-changes",
      });
      setModal(); // Close modal if no changes
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/updateCategory/${updateCategory.id}`,
        { categoryName: trimmedCategoryName },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      toast.success(res.data.message, { toastId: "edit-success" });
      getAllCategories();
      setModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Handle duplicate error from backend as fallback
        if (
          error.response?.status === 400 &&
          error.response?.data?.message?.includes("already exists")
        ) {
          toast.error("Category name already exists", {
            toastId: "edit-duplicate",
          });
        } else {
          const message =
            error.response?.data?.message || "Failed to update category";
          toast.error(message, { toastId: "edit-failed" });
        }
      } else {
        console.error(error);
        toast.error("Unexpected error occurred", {
          toastId: "edit-failed",
        });
      }
    } finally {
      setLoading(false);
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

              {updateCategory?.categoryName &&
                updateCategory.categoryName.trim() !==
                  selectCategory?.categoryName &&
                isDuplicateCategory(
                  updateCategory.categoryName.trim(),
                  updateCategory.id,
                ) && (
                  <p className="text-red-500 text-sm mt-1 ml-1">
                    This category name already exists
                  </p>
                )}
            </div>

            <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
              <CancelBtn setModal={setModal} />
              <AddButton
                loading={loading}
                label={loading ? "Updating" : "Update"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
