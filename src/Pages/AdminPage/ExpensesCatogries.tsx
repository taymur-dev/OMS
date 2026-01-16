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
        (a: AllExpenseCategoryT, b: AllExpenseCategoryT) => a.id - b.id
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
        }
      );
      toast.info("Category has been deleted successfully");
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
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCategories = filteredCategories?.slice(
    (pageNo - 1) * itemsPerPage,
    pageNo * itemsPerPage
  );

  return (
    <div className="w-full mx-2">
      <TableTitle
        tileName="Expense Category List"
        activeFile="Expense Category list"
      />

      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white
       overflow-hidden flex flex-col "
      >
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Categories :{" "}
            <span className="text-2xl text-indigo-900 font-semibold font-sans">
              [{filteredCategories?.length || 0}]
            </span>
          </span>
          <CustomButton
            label="Add Expense Category"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPageNo(1);
                }}
              >
                {numbers.map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </span>
            <span>entries</span>
          </div>
          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={(value) => {
              setSearchTerm(value);
              setPageNo(1);
            }}
          />
        </div>

        <div className="max-h-[28.4rem] overflow-y-auto  mx-2">
          <div
            className="grid grid-cols-[0.5fr_1fr_1fr] bg-indigo-900 text-white font-semibold
           border border-gray-600 text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr#</span>
            <span>Category Name</span>
            <span className="text-center w-28">Actions</span>
          </div>

          {paginatedCategories?.map((category, index) => (
            <div
              key={category.id}
              className="grid grid-cols-[0.5fr_1fr_1fr] border border-gray-600 text-gray-800
               hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[7px]"
            >
              <span className="px-2">
                {(pageNo - 1) * itemsPerPage + index + 1}
              </span>
              <span>{category.categoryName}</span>
              <span className="flex items-center gap-1">
                <EditButton
                  handleUpdate={() => handleClickEditButton(category)}
                />
                <DeleteButton
                  handleDelete={() => handleClickDeleteButton(category.id)}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber
          start={(pageNo - 1) * itemsPerPage + 1}
          end={Math.min(pageNo * itemsPerPage, filteredCategories?.length || 0)}
          total={filteredCategories?.length || 0}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

      {isOpenModal === "ADD" && (
        <AddCategory
          setModal={() => handleToggleViewModal("")}
          refreshTable={handlegetExpenseCategory}
        />
      )}

      {isOpenModal === "EDIT" && selectCategory && (
        <EditCategory
          setModal={() => handleToggleViewModal("")}
          categoryId={selectCategory.id}
          categoryName={selectCategory.categoryName}
          refreshTable={handlegetExpenseCategory}
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
