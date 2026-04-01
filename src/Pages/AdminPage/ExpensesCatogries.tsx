import { useEffect, useState, useCallback } from "react";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { AddCategory } from "../../Components/ExpenseCategoryModal/AddCategory";
import { EditCategory } from "../../Components/ExpenseCategoryModal/EditCategory";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { RiInboxArchiveLine } from "react-icons/ri";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";

type EXPENSECATEGORYT = "ADD" | "EDIT" | "DELETE" | "";

type AllExpenseCategoryT = {
  id: number;
  categoryName: string;
};

interface ExpensesCatogriesProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const ExpensesCatogries = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: ExpensesCatogriesProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const [isOpenModal, setIsOpenModal] = useState<EXPENSECATEGORYT>("");
  const [catchId, setCatchId] = useState<number>();
  const [allExpenseCategory, setAllExpenseCategory] = useState<
    AllExpenseCategoryT[] | null
  >(null);
  const [selectCategory, setSelectCategory] =
    useState<AllExpenseCategoryT | null>(null);

  const [pageNo, setPageNo] = useState(1);

  const handleToggleViewModal = (active: EXPENSECATEGORYT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handlegetExpenseCategory = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getExpenseCategory`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedCategories = res.data.sort(
        (a: AllExpenseCategoryT, b: AllExpenseCategoryT) => a.id - b.id,
      );
      setAllExpenseCategory(sortedCategories);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    handlegetExpenseCategory();
    document.title = "(OMS) EXPENSE CATEGORY";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("EXPENSE CATEGORY")), 1000);
  }, [dispatch, handlegetExpenseCategory]);

  // Sync state with parent controls
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("ADD");
    }
  }, [triggerModal]);

  const handleDeleteCategory = async () => {
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteExpenseCategory/${catchId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Category has been deleted successfully");
      handlegetExpenseCategory();
      handleToggleViewModal("");
    } catch (error) {
      console.log(error);
    }
  };

  if (loader) return <Loader />;

  const filteredCategories = (allExpenseCategory ?? []).filter((category) =>
    category.categoryName.toLowerCase().includes(externalSearch.toLowerCase()),
  );

  const totalNum = filteredCategories.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[600px]">
          {/* 1. Header Row (Aligned with UsersDetails style) */}
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[60px_1fr_auto] bg-blue-400 text-white rounded-lg items-center font-bold
            text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span className="text-left">Sr#</span>
              <span className="text-left">Category Name</span>
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>

          {/* 2. Table Body (Icons removed from TD) */}
          <div className="px-0.5 sm:px-1 py-2">
            {paginatedCategories.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No records available!</p>
                <p className="text-sm">Try adjusting your search</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedCategories.map((category, index) => (
                  <div
                    key={category.id}
                    className="grid grid-cols-[60px_1fr_auto] items-center px-3 py-2 gap-3 text-sm bg-white 
                  border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Removed icon/avatar container to match plain text style */}
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-gray-800">
                        {category.categoryName}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-1 w-[140px]">
                      <EditButton
                        handleUpdate={() => {
                          setSelectCategory(category);
                          handleToggleViewModal("EDIT");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setCatchId(category.id);
                          handleToggleViewModal("DELETE");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Pagination Section */}
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

      {/* --- MODALS SECTION --- */}
      {isOpenModal === "ADD" && (
        <AddCategory
          setModal={() => handleToggleViewModal("")}
          refreshTable={handlegetExpenseCategory}
          existingCategories={
            allExpenseCategory?.map((c) => c.categoryName) || []
          }
        />
      )}

      {isOpenModal === "EDIT" && selectCategory && (
        <EditCategory
          setModal={() => handleToggleViewModal("")}
          categoryId={selectCategory.id}
          categoryName={selectCategory.categoryName}
          refreshTable={handlegetExpenseCategory}
          existingCategories={
            allExpenseCategory?.map((c) => c.categoryName) || []
          }
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("DELETE")}
          onClose={() => handleToggleViewModal("")}
          onConfirm={() => handleDeleteCategory()}
          message="Are you sure you want to delete this category?"
        />
      )}
    </div>
  );
};
