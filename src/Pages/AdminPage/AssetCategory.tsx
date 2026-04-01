import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";

import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddAssetCategory } from "../../Components/AssestCategoryModal/AddAssetCategory";
import { UpdateAssetCategory } from "../../Components/AssestCategoryModal/UpdateAssetCategory";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { BASE_URL } from "../../Content/URL";
import { RiInboxArchiveLine } from "react-icons/ri";

interface AssetCategoryItem {
  id: number;
  category_name: string;
  category_status?: string;
}

interface AssetCategoryProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const AssetCategory = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: AssetCategoryProps) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<
    "ADD" | "EDIT" | "DELETE" | ""
  >("");
  const [pageNo, setPageNo] = useState(1);
  const [categories, setCategories] = useState<AssetCategoryItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const token = currentUser?.token;

  const handleToggleViewModal = (
    modal: "ADD" | "EDIT" | "DELETE" | "",
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
      toast.success("Category deleted successfully");
      await fetchCategories();
      handleToggleViewModal("");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    document.title = "(OMS) ASSET CATEGORY";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("ASSET CATEGORY"));
    }, 500);
    fetchCategories();
  }, [dispatch, fetchCategories]);

  // Reset page number when search or page size changes
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("ADD");
    }
  }, [triggerModal]);

  if (loader) return <Loader />;

  const filteredCategories = categories.filter(
    (cat) =>
      cat.category_name &&
      cat.category_name.toLowerCase().includes(externalSearch.toLowerCase()),
  );

  const totalNum = filteredCategories.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        {/* min-w matched to UsersDetails style for consistency, 
            though Categories need less space, keeping 600px or higher ensures layout doesn't break */}
        <div className="min-w-[600px]">
          {/* 1. Header Row */}
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[60px_1fr_auto] 
              bg-blue-400 text-white rounded-lg items-center font-bold
              text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span className="text-left">Sr#</span>
              <span className="text-left">Category Name</span>
              {/* Added explicit width and padding to match UsersDetails alignment */}
              <span className="text-right w-[100px] pr-4">Actions</span>
            </div>
          </div>

          {/* 2. Table Body */}
          <div className="px-0.5 sm:px-1 py-2">
            {paginatedCategories.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedCategories.map((cat, index) => (
                  <div
                    key={cat.id}
                    className="grid grid-cols-[60px_1fr_auto] 
                    items-center px-3 py-2 gap-3 text-sm bg-white 
                    border border-gray-100 rounded-lg 
                    hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Removed the Icon and Icon-Container Circle */}
                    <div className="flex items-center overflow-hidden">
                      <span className="truncate text-gray-800">
                        {cat.category_name}
                      </span>
                    </div>

                    {/* Aligned Actions container width with the header */}
                    <div className="flex items-center justify-end gap-1 w-[100px]">
                      <EditButton
                        handleUpdate={() =>
                          handleToggleViewModal("EDIT", cat.id)
                        }
                      />
                      <DeleteButton
                        handleDelete={() =>
                          handleToggleViewModal("DELETE", cat.id)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Section (Pagination) */}
      <div className="flex flex-row items-center justify-between p-1">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          totalNum={totalNum}
          pageSize={externalPageSize}
          handlePageClick={(targetPage) => setPageNo(targetPage)}
        />
      </div>

      {/* --- MODALS --- */}
      {isOpenModal === "ADD" && (
        <AddAssetCategory
          setModal={() => handleToggleViewModal("")}
          existingCategories={categories}
          refreshCategories={async () => {
            await fetchCategories();
            setPageNo(1);
          }}
        />
      )}

      {isOpenModal === "EDIT" && selectedCategoryId !== null && (
        <UpdateAssetCategory
          categoryId={selectedCategoryId}
          existingCategories={categories}
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
