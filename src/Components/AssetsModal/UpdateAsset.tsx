import React, { useState, useEffect, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import { TextareaField } from "../InputFields/TextareaField";
import { Title } from "../Title";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type UpdateAssetProps = {
  setModal: () => void;
  assetData: {
    id: number;
    asset_name: string;
    category_id: string;
    description: string;
    date: string;
  };
  refreshAssets: () => void;
};

interface Category {
  id: number;
  category_name: string;
}

export const UpdateAsset = ({
  setModal,
  assetData,
  refreshAssets,
}: UpdateAssetProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [updateAsset, setUpdateAsset] = useState({
    asset_name: assetData.asset_name,
    category_id: assetData.category_id,
    description: assetData.description,
    date: assetData.date,
  });

  const [categories, setCategories] = useState<
    { id: number; label: string; value: string }[]
  >([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdateAsset((prev) => ({ ...prev, [name]: value }));
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/assetCategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let categoryArray: Category[] = [];

      if (Array.isArray(res.data)) categoryArray = res.data;
      else if (Array.isArray(res.data.categories))
        categoryArray = res.data.categories;
      else if (Array.isArray(res.data.data)) categoryArray = res.data.data;

      const options = categoryArray.map((cat: Category) => ({
        id: cat.id,
        label: cat.category_name,
        value: String(cat.id),
      }));

      setCategories(options);

      const exists = options.find(
        (opt) => opt.value === String(assetData.category_id)
      );
      if (!exists && options.length > 0) {
        setUpdateAsset((prev) => ({ ...prev, category_id: options[0].value }));
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Failed to load categories");
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, [token, assetData.category_id]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/updateasset/${assetData.id}`,
        updateAsset,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      refreshAssets();
      setModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update asset");
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
        <div className="w-[42rem] bg-white mx-auto rounded-xl border border-indigo-900">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded-t-xl px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                Edit Asset
              </Title>
            </div>
            <div className="mx-2 grid grid-cols-2 py-2 gap-3">
              {!loadingCategories && categories.length > 0 && (
                <OptionField
                  labelName="Asset Category"
                  name="category_id"
                  value={updateAsset.category_id}
                  handlerChange={handlerChange}
                  optionData={categories}
                  inital="Select Category"
                />
              )}

              <InputField
                labelName="Asset Name*"
                placeHolder="Enter the asset name"
                type="text"
                name="asset_name"
                value={updateAsset.asset_name}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Created Date*"
                placeHolder="Enter the created date"
                type="date"
                name="date"
                value={updateAsset.date}
                handlerChange={handlerChange}
              />

              <TextareaField
                labelName="Description*"
                placeHolder="Write the asset description"
                name="description"
                inputVal={updateAsset.description}
                handlerChange={handlerChange}
              />
            </div>

            <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
              <CancelBtn setModal={setModal} />
              <AddButton label="Update" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
