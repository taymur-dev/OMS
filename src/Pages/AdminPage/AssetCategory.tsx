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

  // return (
  //   <div className="w-full mx-2">
  //     <TableTitle
  //       tileName="Assets Category"
  //       activeFile="Assets Category list"
  //     />

  //     <div
  //       className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white|
  //      overflow-hidden flex flex-col"
  //     >
  //       <div className="flex text-gray-800 items-center justify-between mx-2">
  //         <span>
  //           Total number of Assets Category:{" "}
  //           <span className="text-2xl text-indigo-900 font-semibold">
  //             [{categories.length}]
  //           </span>
  //         </span>
  //         <CustomButton
  //           label="Add Category"
  //           handleToggle={() => handleToggleViewModal("ADD")}
  //         />
  //       </div>

  //       <div className="flex items-center justify-between text-gray-800 mx-2">
  //         <div>
  //           <span>Show</span>
  //           <span className="bg-gray-200 rounded mx-1 p-1">
  //             <select value={selectedValue} onChange={handleChangeShowData}>
  //               {numbers.map((num) => (
  //                 <option key={num} value={num}>
  //                   {num}
  //                 </option>
  //               ))}
  //             </select>
  //           </span>
  //           <span>entries</span>
  //         </div>

  //         <TableInputField
  //           searchTerm={searchTerm}
  //           setSearchTerm={setSearchTerm}
  //         />
  //       </div>

  //       <div className="max-h-[28.4rem] overflow-y-auto mx-2">
  //         <div
  //           className="grid grid-cols-3 bg-indigo-900 text-white font-semibold border border-gray-600
  //          text-sm sticky top-0 z-10 p-[10px]"
  //         >
  //           <span>Sr#</span>
  //           <span>Category Name</span>
  //           <span className="text-center">Actions</span>
  //         </div>

  //         {paginatedCategories.map((cat, index) => (
  //           <div
  //             key={cat.id}
  //             className="grid grid-cols-3 border border-gray-600 text-sm items-center p-[7px] hover:bg-gray-100"
  //           >
  //             <span>{startIndex + index + 1}</span>
  //             <span>{cat.category_name}</span>
  //             <span className="flex gap-1 justify-center">
  //               <EditButton
  //                 handleUpdate={() => handleToggleViewModal("EDIT", cat.id)}
  //               />
  //               <DeleteButton
  //                 handleDelete={() => handleToggleViewModal("DELETE", cat.id)}
  //               />
  //             </span>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     <div className="flex items-center justify-between mt-2">
  //       <ShowDataNumber
  //         start={filteredCategories.length ? startIndex + 1 : 0}
  //         end={Math.min(endIndex, filteredCategories.length)}
  //         total={filteredCategories.length}
  //       />
  //       <Pagination
  //         pageNo={pageNo}
  //         handleIncrementPageButton={() =>
  //           setPageNo((p) => Math.min(p + 1, totalPages))
  //         }
  //         handleDecrementPageButton={() => setPageNo((p) => Math.max(1, p - 1))}
  //       />
  //     </div>

  //     {isOpenModal === "ADD" && (
  //       <AddAssetCategory
  //         setModal={() => handleToggleViewModal("")}
  //         refreshCategories={async () => {
  //           await fetchCategories();
  //           const lastPage = Math.ceil(categories.length / selectedValue);
  //           setPageNo(lastPage);
  //         }}
  //       />
  //     )}

  //     {isOpenModal === "EDIT" && selectedCategoryId !== null && (
  //       <UpdateAssetCategory
  //         categoryId={selectedCategoryId}
  //         setModal={() => handleToggleViewModal("")}
  //         refreshCategories={fetchCategories}
  //       />
  //     )}

  //     {isOpenModal === "DELETE" && selectedCategoryId !== null && (
  //       <ConfirmationModal
  //         isOpen={() => handleToggleViewModal("")}
  //         onClose={() => handleToggleViewModal("")}
  //         onConfirm={deleteCategory}
  //         message="Are you sure you want to delete this Category?"
  //       />
  //     )}
  //   </div>
  // );

  return (
    <div className="w-full px-2 sm:px-4">
      <TableTitle
        tileName="Assets Category"
        activeFile="Assets Category list"
      />

      <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
          <span className="text-sm sm:text-base">
            Total Number of Assets Category:{" "}
            <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
              [{categories.length}]
            </span>
          </span>

          <CustomButton
            handleToggle={() => handleToggleViewModal("ADD")}
            label="Add Category"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 text-gray-800">
          <div className="text-sm">
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select
                value={selectedValue}
                onChange={handleChangeShowData}
                className="bg-transparent outline-none"
              >
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

        {/* Table Wrapper */}
        <div className="mx-2 mt-2 overflow-x-auto max-h-[28.4rem]">
          <div className="min-w-[600px]">
            {/* Table Header */}
            <div className="grid grid-cols-[0.5fr_1.5fr_1fr] bg-indigo-900 items-center text-white font-semibold text-sm sticky top-0 z-10 p-2">
              <span>Sr#</span>
              <span>Category Name</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedCategories.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-4">
                No records available at the moment!
              </div>
            ) : (
              paginatedCategories.map((cat, index) => (
                <div
                  key={cat.id}
                  className="grid grid-cols-[0.5fr_1.5fr_1fr] border border-gray-300 items-center text-gray-800 text-sm p-2 hover:bg-gray-100 transition"
                >
                  <span>{startIndex + index + 1}</span>
                  <span className="truncate">{cat.category_name}</span>
                  <span className="flex flex-wrap items-center justify-center gap-1">
                    <EditButton
                      handleUpdate={() => handleToggleViewModal("EDIT", cat.id)}
                    />
                    <DeleteButton
                      handleDelete={() =>
                        handleToggleViewModal("DELETE", cat.id)
                      }
                    />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-3">
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

      {/* Modals */}
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
    </div>
  );
};
