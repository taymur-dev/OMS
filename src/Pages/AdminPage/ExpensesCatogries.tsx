import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { useEffect, useState, useCallback } from "react";
import { AddCategory } from "../../Components/ExpenseCategoryModal/AddCategory";
import { EditCategory } from "../../Components/ExpenseCategoryModal/EditCategory";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { Footer } from "../../Components/Footer";

const numbers = [10, 25, 50, 100];

type EXPENSECATEGORYT = "ADD" | "EDIT" | "DELETE" | "";

type AllExpenseCategoryT = {
  id: number;
  categoryName: string;
};

export const ExpensesCatogries = () => {
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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleViewModal = (active: EXPENSECATEGORYT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

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

  const handleClickEditButton = (data: AllExpenseCategoryT) => {
    setSelectCategory(data);
    handleToggleViewModal("EDIT");
  };

  const handleClickDeleteButton = (id: number) => {
    setCatchId(id);
    handleToggleViewModal("DELETE");
  };

  const handleDeleteCategory = async () => {
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteExpenseCategory/${catchId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.error("Category has been deleted successfully");
      handlegetExpenseCategory();
      handleToggleViewModal("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handlegetExpenseCategory();
    document.title = "(OMS) EXPENSE CATEGORY";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("EXPENSE CATEGORY")), 1000);
  }, [dispatch, handlegetExpenseCategory]);

  if (loader) return <Loader />;

  const filteredCategories = allExpenseCategory?.filter((category) =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedCategories = filteredCategories?.slice(
    (pageNo - 1) * itemsPerPage,
    pageNo * itemsPerPage,
  );

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Button */}
        <TableTitle
          tileName="Expense Category"
          rightElement={
            <CustomButton
              label="+ Add Category"
              handleToggle={() => handleToggleViewModal("ADD")}
            />
          }
        />

        <hr className="border border-b border-gray-200" />

        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            {/* Left Side: Show entries */}
            <div className="text-sm flex items-center">
              <span>Show</span>
              <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setPageNo(1);
                  }}
                  className="bg-transparent outline-none py-1 cursor-pointer"
                >
                  {numbers.map((num) => (
                    <option key={num} value={num}>
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
              setSearchTerm={(value) => setSearchTerm(value)}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto px-2">
          <div className="min-w-[600px]">
            {/* Sticky Table Header */}
            <div
              className="grid grid-cols-3 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Category Name</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {(paginatedCategories ?? []).length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              (paginatedCategories ?? []).map((category, index) => (
                <div
                  key={category.id}
                  className="grid grid-cols-3 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{(pageNo - 1) * itemsPerPage + index + 1}</span>
                  <span className="truncate">{category.categoryName}</span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    <EditButton
                      handleUpdate={() => handleClickEditButton(category)}
                    />
                    <DeleteButton
                      handleDelete={() => handleClickDeleteButton(category.id)}
                    />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row items-center justify-between p-2">
          <ShowDataNumber
            start={
              filteredCategories?.length === 0
                ? 0
                : (pageNo - 1) * itemsPerPage + 1
            }
            end={Math.min(
              pageNo * itemsPerPage,
              filteredCategories?.length || 0,
            )}
            total={filteredCategories?.length || 0}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={handleDecrementPageButton}
            handleIncrementPageButton={handleIncrementPageButton}
          />
        </div>
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

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
