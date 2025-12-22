import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { useEffect, useState } from "react";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddAssetCategory } from "../../Components/AssestCategoryModal/AddAssetCategory";
import { UpdateAssetCategory } from "../../Components/AssestCategoryModal/UpdateAssetCategory";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";

const numbers = [10, 25, 50, 100];

type AssetCategoryT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

interface AssetCategoryItem {
  id: number;
  categoryName: string;
  categoryStatus: string;
}

export const AssetCategory = () => {
  const { loader } = useAppSelector((state) => state.NavigateSate);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<AssetCategoryT>("");
  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<AssetCategoryItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedValue(Number(event.target.value));
  };

  const handleIncrementPageButton = () => {
    setPageNo((prev) => prev + 1);
  };
  const handleDecrementPageButton = () => {
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));
  };
  const handleToggleViewModal = (
    active: AssetCategoryT,
    categoryId?: number
  ) => {
    setSelectedCategoryId(categoryId ?? null);
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/assetCategories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/assetCategories/${id}`);
      fetchCategories();
      handleToggleViewModal("");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  useEffect(() => {
    document.title = "(OMS) CONFIG TIME";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("JCONFIG TIME"));
    }, 1000);

    fetchCategories();
  }, [dispatch]);

  if (loader) return <Loader />;

  const filteredCategories = categories.filter((cat) =>
    cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = startIndex + selectedValue;

  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  

  return (
    <div className="w-full mx-2">
      <TableTitle
        tileName="Assets Category"
        activeFile="Assets Category list"
      />
      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white
       overflow-hidden flex flex-col"
      >
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Assets Category :{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [{categories.length}]
            </span>
          </span>
          <CustomButton
            label="Add Category"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select value={selectedValue} onChange={handleChangeShowData}>
                {numbers.map((num, index) => (
                  <option key={index} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </span>
            <span>entries</span>
          </div>
          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
          <div
            className="grid grid-cols-3 bg-gray-200 text-gray-900 font-semibold border border-gray-600
           text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr#</span>
            <span>Category Name</span>
            <span className="text-center w-40">Actions</span>
          </div>

          {paginatedCategories.map((cat, index) => (
            <div
              key={cat.id}
              className="grid grid-cols-3 border border-gray-600 text-gray-800 hover:bg-gray-100 transition
               duration-200 text-sm items-center justify-center p-[7px]"
            >
              <span className="px-2">{startIndex + index + 1}</span>
              <span>{cat.categoryName}</span>
              <span className="flex items-center gap-1">
                <EditButton
                  handleUpdate={() => handleToggleViewModal("EDIT", cat.id)}
                />
                <DeleteButton
                  handleDelete={() => handleToggleViewModal("DELETE", cat.id)}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber
          start={filteredCategories.length === 0 ? 0 : startIndex + 1}
          total={filteredCategories.length}
          end={Math.min(endIndex, filteredCategories.length)}
        />

        <Pagination
          handleIncrementPageButton={handleIncrementPageButton}
          handleDecrementPageButton={handleDecrementPageButton}
          pageNo={pageNo}
        />
      </div>

      {isOpenModal === "ADD" && (
        <AddAssetCategory setModal={() => handleToggleViewModal("")} />
      )}
      {isOpenModal === "EDIT" && selectedCategoryId && (
        <UpdateAssetCategory
          // categoryId={selectedCategoryId}
          setModal={() => handleToggleViewModal("")}
        />
      )}

      {isOpenModal === "DELETE" && selectedCategoryId && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("")}
          onClose={() => handleToggleViewModal("DELETE")}
          onConfirm={() =>
            selectedCategoryId && deleteCategory(selectedCategoryId)
          }
          message="Are you sure you want to delete this Category?"
        />
      )}
    </div>
  );
};
