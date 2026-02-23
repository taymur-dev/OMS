import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";

import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { useEffect, useState, useCallback, useMemo } from "react";
import { AddExpense } from "../../Components/ManageExpense/AddExpense";
import { EditExpense } from "../../Components/ManageExpense/EditExpense";
import { ViewExpense } from "../../Components/ManageExpense/ViewExpense";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";

type EXPENSET = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";

const pageSizes = [10, 25, 50, 100];

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

export const Expenses = ({ triggerModal }: { triggerModal: number }) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<EXPENSET>("");
  const [allExpenses, setAllExpenses] = useState<allExpenseT[]>([]);
  const [editExpense, setEditExpense] = useState<allExpenseT | null>(null);
  const [viewExpense, setViewExpense] = useState<allExpenseT | null>(null);

  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const token = currentUser?.token;

  const handleToggleViewModal = (active: EXPENSET) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const getAllExpenses = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/getExpense?page=${pageNo}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setAllExpenses(res.data.data);
      setTotalRecords(res.data.total);
    } catch (error) {
      console.log(error);
    }
  }, [token, pageNo, limit]);

  useEffect(() => {
    getAllExpenses();
  }, [getAllExpenses]);

  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("ADD");
    }
  }, [triggerModal]);

  useEffect(() => {
    document.title = "(OMS) EXPENSE";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("EXPENSE")), 1000);
  }, [dispatch]);

  const filteredExpenses = useMemo(() => {
    return allExpenses
      .filter((expense) =>
        `${expense.expenseName} ${expense.categoryName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => a.id - b.id);
  }, [allExpenses, searchTerm]);

  const totalExpenseAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => {
      const amount = Number(expense.amount) || 0;
      return sum + amount;
    }, 0);
  }, [filteredExpenses]);

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col  bg-white">

        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            {/* Left Side: Show entries */}
            <div className="text-sm flex items-center">
              <span>Show</span>
              <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPageNo(1);
                  }}
                  className="bg-transparent outline-none py-1 cursor-pointer"
                >
                  {pageSizes.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </span>
              <span className="hidden xs:inline">entries</span>
            </div>

            <TableInputField
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto">
          <div className="min-w-[900px]">
            {/* Sticky Table Header */}
            <div
              className="grid grid-cols-5 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Expense Name</span>
              <span>Category</span>
              <span>Amount</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {filteredExpenses.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              <>
                {filteredExpenses.map((expense, index) => (
                  <div
                    key={expense.id}
                    className="grid grid-cols-5 border-b border-x border-gray-200 text-gray-800 items-center
                   text-sm p-2 hover:bg-gray-50 transition"
                  >
                    <span>{(pageNo - 1) * limit + index + 1}</span>
                    <span className="truncate">{expense.expenseName}</span>
                    <span className="truncate">{expense.categoryName}</span>
                    <span className="font-medium">
                      {expense.amount.toLocaleString()}
                    </span>
                    <span className="flex flex-nowrap justify-center gap-1">
                      <EditButton
                        handleUpdate={() => {
                          setEditExpense(expense);
                          handleToggleViewModal("EDIT");
                        }}
                      />
                      <ViewButton
                        handleView={() => {
                          setViewExpense(expense);
                          handleToggleViewModal("VIEW");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setViewExpense(expense);
                          handleToggleViewModal("DELETE");
                        }}
                      />
                    </span>
                  </div>
                ))}

                {/* Total Row aligned to grid */}
                <div className="grid grid-cols-7 border-b border-x border-gray-200 bg-indigo-50 font-bold text-indigo-900 items-center text-sm p-2">
                  <span></span>
                  <span></span>
                  <span className="text-right pr-2">Total:</span>
                  <span>{totalExpenseAmount.toLocaleString()}</span>
                  <span className="col-span-3"></span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="p-2 flex flex-row items-center justify-between">
          <ShowDataNumber
            start={totalRecords === 0 ? 0 : (pageNo - 1) * limit + 1}
            end={Math.min(pageNo * limit, totalRecords)}
            total={totalRecords}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={handleDecrementPageButton}
            handleIncrementPageButton={handleIncrementPageButton}
          />
        </div>
      </div>

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
