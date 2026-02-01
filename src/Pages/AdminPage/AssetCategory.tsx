import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddAssetCategory } from "../../Components/AssestCategoryModal/AddAssetCategory";
import { UpdateAssetCategory } from "../../Components/AssestCategoryModal/UpdateAssetCategory";
import { Footer } from "../../Components/Footer";


import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { BASE_URL } from "../../Content/URL";

const numbers = [10, 25, 50, 100];

type AssetCategoryT = "ADD" | "EDIT" | "DELETE" | "";

interface AssetCategoryItem {
  id: number;
  category_name: string;
  category_status?: string;
}

export const AssetCategory = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<AssetCategoryT>("");
  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<AssetCategoryItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const token = currentUser?.token;

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedValue(Number(event.target.value));
    setPageNo(1);
  };

  const handleToggleViewModal = (
    modal: AssetCategoryT,
    categoryId: number | null = null,
  ) => {
    setSelectedCategoryId(categoryId);
    setIsOpenModal(modal);
  };

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/admin/assetCategories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data: AssetCategoryItem[] = Array.isArray(response.data)
        ? response.data
        : response.data.categories || [];

      const sortedData = data.sort((a, b) => a.id - b.id);

      setCategories(sortedData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [token]);

  const deleteCategory = async () => {
    if (!selectedCategoryId) return;

    try {
      await axios.delete(
        `${BASE_URL}/api/admin/deleteAssetCategory/${selectedCategoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      await fetchCategories();
      handleToggleViewModal("");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  useEffect(() => {
    document.title = "(OMS) CONFIG TIME";
    dispatch(navigationStart());

    setTimeout(() => {
      dispatch(navigationSuccess("CONFIG TIME"));
    }, 500);

    fetchCategories();
  }, [dispatch, fetchCategories]);

  useEffect(() => {
    setPageNo(1);
  }, [searchTerm]);

  if (loader) return <Loader />;

  const filteredCategories = categories.filter(
    (cat) =>
      cat.category_name &&
      cat.category_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCategories.length / selectedValue);
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = startIndex + selectedValue;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  

  return (
  <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
    <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
      <TableTitle
        tileName="Assets Category"
        rightElement={
          <CustomButton
            handleToggle={() => handleToggleViewModal("ADD")}
            label="+ Add Category"
          />
        }
      />

      <hr className="border border-b border-gray-200" />

      <div className="p-2">
        <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
          <div className="text-sm flex items-center">
            <span>Show</span>
            <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
              <select
                value={selectedValue}
                onChange={handleChangeShowData}
                className="bg-transparent outline-none py-1 cursor-pointer"
              >
                {numbers.map((num, index) => (
                  <option key={index} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </span>
            <span className="hidden xs:inline">entries</span>
          </div>

          {/* Right Side: Search Input */}
          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </div>

      {/* --- MIDDLE SECTION (Scrollable Table) --- */}
      <div className="overflow-auto px-2">
        <div className="min-w-[600px]">
          {/* Sticky Table Header - Grid cols adjusted for Category */}
          <div
            className="grid grid-cols-3 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
          >
            <span>Sr#</span>
            <span>Category Name</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Table Body */}
          {paginatedCategories.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-10">
              No records available at the moment!
            </div>
          ) : (
            paginatedCategories.map((cat, index) => (
              <div
                key={cat.id}
                className="grid grid-cols-3 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
              >
                <span>{startIndex + index + 1}</span>
                <span className="truncate">{cat.category_name}</span>
                <span className="flex flex-nowrap justify-center gap-1">
                  <EditButton
                    handleUpdate={() => handleToggleViewModal("EDIT", cat.id)}
                  />
                  <DeleteButton
                    handleDelete={() => handleToggleViewModal("DELETE", cat.id)}
                  />
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4) Pagination placed under the table */}
      <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
        <ShowDataNumber
          start={filteredCategories.length ? startIndex + 1 : 0}
          end={Math.min(endIndex, filteredCategories.length)}
          total={filteredCategories.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(1, p - 1))}
          handleIncrementPageButton={() =>
            setPageNo((p) => Math.min(p + 1, totalPages))
          }
        />
      </div>
    </div>

    {/* --- MODALS SECTION --- */}
    {isOpenModal === "ADD" && (
      <AddAssetCategory
        setModal={() => handleToggleViewModal("")}
        refreshCategories={async () => {
          await fetchCategories();
          const lastPage = Math.ceil(categories.length / selectedValue);
          setPageNo(lastPage);
        }}
      />
    )}

    {isOpenModal === "EDIT" && selectedCategoryId !== null && (
      <UpdateAssetCategory
        categoryId={selectedCategoryId}
        setModal={() => handleToggleViewModal("")}
        refreshCategories={fetchCategories}
      />
    )}

    {isOpenModal === "DELETE" && selectedCategoryId !== null && (
      <ConfirmationModal
        isOpen={() => handleToggleViewModal("")}
        onClose={() => handleToggleViewModal("")}
        onConfirm={deleteCategory}
        message="Are you sure you want to delete this Category?"
      />
    )}

    {/* --- FOOTER SECTION --- */}
    <div className="border border-t-5 border-gray-200">
      <Footer />
    </div>
  </div>
);
};
