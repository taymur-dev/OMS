import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";

// UI Components
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { AddExpense } from "../../Components/ManageExpense/AddExpense";
import { EditExpense } from "../../Components/ManageExpense/EditExpense";
import { ViewExpense } from "../../Components/ManageExpense/ViewExpense";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";

// Icons
import { RiInboxArchiveLine } from "react-icons/ri";

type EXPENSET = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";

type allExpenseT = {
  id: number;
  expenseName: string;
  expenseCategoryId: number;
  categoryName: string;
  date: string;
  expenseStatus: string;
  amount: number | string;
  addedBy: string;
};

interface ExpensesProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const Expenses = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: ExpensesProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<EXPENSET>("");
  const [allExpenses, setAllExpenses] = useState<allExpenseT[]>([]);
  const [editExpense, setEditExpense] = useState<allExpenseT | null>(null);
  const [viewExpense, setViewExpense] = useState<allExpenseT | null>(null);
  const [pageNo, setPageNo] = useState(1);

  const token = currentUser?.token;

  const handleToggleViewModal = (active: EXPENSET) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const getAllExpenses = useCallback(async () => {
    try {
      // Note: We fetch all for local filtering/pagination logic consistent with UsersDetails
      const res = await axios.get(`${BASE_URL}/api/admin/getExpense`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllExpenses(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    getAllExpenses();
  }, [getAllExpenses]);

  useEffect(() => {
    if (triggerModal > 0) setIsOpenModal("ADD");
  }, [triggerModal]);

  useEffect(() => {
    document.title = "(OMS) EXPENSE";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("EXPENSE")), 1000);
  }, [dispatch]);

  // Sync pagination with external filters
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  const filteredExpenses = useMemo(() => {
    return allExpenses.filter((expense) =>
      `${expense.expenseName} ${expense.categoryName}`
        .toLowerCase()
        .includes(externalSearch.toLowerCase()),
    );
  }, [allExpenses, externalSearch]);

  const totalRecords = filteredExpenses.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedExpenses = filteredExpenses.slice(
    startIndex,
    startIndex + externalPageSize,
  );

  const totalExpenseAmount = useMemo(() => {
    return filteredExpenses.reduce(
      (sum, exp) => sum + (Number(exp.amount) || 0),
      0,
    );
  }, [filteredExpenses]);

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(totalRecords / externalPageSize);
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          {/* 1. Header Row */}
          <div className="px-0.5 pt-0.5">
            <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_auto] bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm">
              <span className="text-left">Sr#</span>
              <span className="text-left">Expense Details</span>
              <span className="text-left">Category</span>
              <span className="text-left">Amount</span>
              <span className="text-left">Date</span>
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>

          {/* 2. Data Rows */}
          <div className="px-0.5 sm:px-1 py-2">
            {paginatedExpenses.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No expenses found!</p>
                <p className="text-sm">Try adjusting your search filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedExpenses.map((expense, index) => (
                  <div
                    key={expense.id}
                    className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_auto] items-center px-3 py-2 gap-3 text-sm bg-white
                     border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    <div className="flex items-center min-w-0">
                      <span className="truncate  text-gray-800">
                        {expense.expenseName}
                      </span>
                    </div>

                    <div className="text-gray-600 truncate">
                      {expense.categoryName}
                    </div>

                    <div className=" text-gray-600 truncate">
                      {Number(expense.amount).toLocaleString()}
                    </div>

                    <div className="text-gray-600 truncate">
                      {formatDate(expense.date)}
                    </div>

                    <div className="flex items-center justify-end gap-1 w-[140px]">
                      <ViewButton
                        handleView={() => {
                          setViewExpense(expense);
                          handleToggleViewModal("VIEW");
                        }}
                      />
                      <EditButton
                        handleUpdate={() => {
                          setEditExpense(expense);
                          handleToggleViewModal("EDIT");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setViewExpense(expense);
                          handleToggleViewModal("DELETE");
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Total Row aligned to the new grid */}
                <div
                  className="mt-1 p-1 bg-blue-50 rounded-lg border border-blue-100 grid
               grid-cols-[60px_1fr_1fr_1fr_1fr_auto] gap-3 items-center shadow-sm"
                >
                  <div className="col-span-3 text-right pr-4">
                    <span className="text-blue-800 font-bold text-xs tracking-widest">
                      Total Expenditure:
                    </span>
                  </div>
                  <div className="font-black text-lg text-blue-900">
                  {totalExpenseAmount.toLocaleString()}
                  </div>
                  <div className="col-span-2"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Pagination */}
      <div className="flex flex-row items-center justify-between p-1 mt-auto">
        <ShowDataNumber
          start={totalRecords === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + externalPageSize, totalRecords)}
          total={totalRecords}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

      {/* Modals remain unchanged */}
      {isOpenModal === "ADD" && (
        <AddExpense
          setModal={() => {
            handleToggleViewModal("");
            getAllExpenses();
          }}
        />
      )}

      {isOpenModal === "EDIT" && (
        <EditExpense
          setModal={() => handleToggleViewModal("")}
          editExpense={editExpense}
          handleRefresh={getAllExpenses}
        />
      )}

      {isOpenModal === "VIEW" && (
        <ViewExpense
          viewExpense={viewExpense}
          setIsOpenModal={() => handleToggleViewModal("")}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => {}}
          onClose={() => handleToggleViewModal("")}
          onConfirm={async () => {
            if (!viewExpense) return;
            await axios.delete(
              `${BASE_URL}/api/admin/deleteExpense/${viewExpense.id}`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            handleToggleViewModal("");
            getAllExpenses();
          }}
        />
      )}
    </div>
  );
};
