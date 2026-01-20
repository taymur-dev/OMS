import React, { useState, useEffect, useCallback } from "react";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import { OptionField } from "../InputFields/OptionField";
import { TextareaField } from "../InputFields/TextareaField";

type AddAssetProps = {
  setModal: () => void;
  refreshAssets: () => void;
};

interface Category {
  id: number;
  category_name: string;
}

const initialState = {
  asset_name: "",
  category_id: "",
  description: "",
  date: "",
};

export const AddAsset = ({ setModal, refreshAssets }: AddAssetProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addAsset, setAddAsset] = useState(initialState);
  const [categories, setCategories] = useState<
    { id: number; label: string; value: string }[]
  >([]);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAddAsset({ ...addAsset, [name]: value });
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/assetCategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Categories API response:", res.data);

      let categoryArray: Category[] = [];

      if (Array.isArray(res.data)) {
        categoryArray = res.data;
      } else if (Array.isArray(res.data.categories)) {
        categoryArray = res.data.categories;
      } else if (Array.isArray(res.data.data)) {
        categoryArray = res.data.data;
      }

      if (categoryArray.length === 0) {
        toast.warn("No categories found");
        setCategories([]);
        return;
      }

      const options = categoryArray.map((cat: Category) => ({
        id: cat.id,
        label: cat.category_name,
        value: String(cat.id),
      }));

      setCategories(options);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Failed to load categories");
      setCategories([]);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/createassets`,
        addAsset,
        {
          headers: { Authorization: token },
        }
      );
      console.log(res.data);
      toast.success(res.data.message);
      refreshAssets();
      setModal();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add asset");
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-10">
        <div className="w-[42rem] bg-white mx-auto rounded-xl border border-indigo-900">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded-t-xl px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                Add Asset
              </Title>
            </div>
            <div className="mx-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
              <OptionField
                labelName="Asset Category"
                name="category_id"
                value={addAsset.category_id}
                handlerChange={handlerChange}
                optionData={categories}
                inital="Select Category"
              />

              <InputField
                labelName="Asset Name*"
                placeHolder="Enter the asset name"
                type="text"
                name="asset_name"
                value={addAsset.asset_name}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Created Date*"
                placeHolder="Enter the created date"
                type="date"
                name="date"
                value={addAsset.date}
                handlerChange={handlerChange}
              />

              <TextareaField
                labelName="Description*"
                placeHolder="Write the asset description"
                name="description"
                inputVal={addAsset.description}
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
