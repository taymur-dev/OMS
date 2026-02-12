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
  existingAssets: Asset[];
};

interface Category {
  id: number;
  category_name: string;
}

interface Asset {
  id: number;
  asset_name: string;
  category_name: string;
}

const currentDate = new Date().toLocaleDateString("en-CA");

const initialState = {
  asset_name: "",
  category_id: "",
  description: "",
  date: currentDate,
};

export const AddAsset = ({ setModal, refreshAssets, existingAssets }: AddAssetProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addAsset, setAddAsset] = useState(initialState);
  const [categories, setCategories] = useState<
    { id: number; label: string; value: string }[]
  >([]);

  const [loading, setLoading] = useState(false);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    e.preventDefault();
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "asset_name") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
    }

    if (name === "description") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 250);
    }

    setAddAsset({ ...addAsset, [name]: updatedValue });
  };

 const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/assetCategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

      const options = categoryArray
        .filter((cat: Category) => cat.category_name && cat.category_name.trim() !== "")
        .map((cat: Category) => ({
          id: cat.id,
          label: cat.category_name.trim(),
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

    if (
      !addAsset.category_id ||
      !addAsset.asset_name ||
      !addAsset.description ||
      !addAsset.date
    ) {
      return toast.error("Please fill in all required fields", {
        toastId: "add-asset-validation",
      });
    }

    if (!token) {
      return toast.error("Unauthorized", { toastId: "add-asset-unauthorized" });
    }

    const isDuplicate = existingAssets.some(
    (asset) => asset.asset_name.toLowerCase() === addAsset.asset_name.trim().toLowerCase()
  );

  if (isDuplicate) {
    return toast.error("An asset with this name already exists.");
  }

    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/createassets`,
        addAsset,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log(res.data);
      toast.success(res.data.message || "Asset added successfully", {
        toastId: "add-asset-success",
      });
      refreshAssets();
      setModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add asset", {
          toastId: "add-asset-error",
        });
      } else {
        toast.error("Something went wrong", {
          toastId: "add-asset-error-unknown",
        });
      }
      console.error("Add asset failed:", error);
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
        <div className="w-[42rem] bg-white mx-auto rounded border border-indigo-900">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                ADD ASSET
              </Title>
            </div>
            <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
              <OptionField
                labelName="Asset Category *"
                name="category_id"
                value={addAsset.category_id}
                handlerChange={handlerChange}
                optionData={categories}
                inital="Select Category"
              />

              <InputField
                labelName="Asset Name *"
                type="text"
                name="asset_name"
                value={addAsset.asset_name}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Created Date *"
                type="date"
                name="date"
                value={addAsset.date}
                handlerChange={handlerChange}
              />

              <TextareaField
                labelName="Description *"
                name="description"
                inputVal={addAsset.description}
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
