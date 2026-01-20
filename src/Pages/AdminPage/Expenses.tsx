import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
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
  addedBy: string;
  date: string;
  expenseStatus: string;
  amount: number | string;
};

export const Expenses = () => {
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
        }
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
    document.title = "(OMS) EXPENSE";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("EXPENSE")), 1000);
  }, [dispatch]);

  const filteredExpenses = useMemo(() => {
    return allExpenses
      .filter((expense) =>
        `${expense.expenseName} ${expense.categoryName} ${expense.addedBy}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
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

  // return (
  //   <div className="w-full mx-2">
  //     <TableTitle tileName="Expenses" activeFile="Expenses list" />

  //     <div
  //       className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white
  // overflow-hidden flex flex-col"
  //     >
  //       <div className="flex items-center justify-between mx-2 py-2">
  //         <span>
  //           Total number of Expense:{" "}
  //           <span className="text-2xl text-indigo-900 font-semibold">
  //             {totalRecords}
  //           </span>
  //         </span>

  //         <CustomButton
  //           label="Add Expense"
  //           handleToggle={() => handleToggleViewModal("ADD")}
  //         />
  //       </div>

  //       <div className="flex items-center justify-between mx-2 py-2">
  //         <div>
  //           Show{" "}
  //           <select
  //             className="mx-2 p-1 border rounded"
  //             value={limit}
  //             onChange={(e) => {
  //               setLimit(Number(e.target.value));
  //               setPageNo(1);
  //             }}
  //           >
  //             {pageSizes.map((num) => (
  //               <option key={num} value={num}>
  //                 {num}
  //               </option>
  //             ))}
  //           </select>
  //           entries
  //         </div>

  //         <TableInputField
  //           searchTerm={searchTerm}
  //           setSearchTerm={setSearchTerm}
  //         />
  //       </div>

  //       <div className="flex-1 mx-2">
  //         <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1.5fr] bg-indigo-900 text-white font-semibold p-2 sticky top-0">
  //           <span>Sr#</span>
  //           <span>Expense Name</span>
  //           <span>Category</span>
  //           <span>Amount</span>
  //           <span>Added By</span>
  //           <span className="text-center">Actions</span>
  //         </div>

  //         {filteredExpenses.map((expense, index) => (
  //           <div
  //             key={expense.id}
  //             className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1.5fr] border p-2 hover:bg-gray-100 text-sm"
  //           >
  //             <span>{(pageNo - 1) * limit + index + 1}</span>
  //             <span>{expense.expenseName}</span>
  //             <span>{expense.categoryName}</span>
  //             <span>{expense.amount}</span>
  //             <span>{expense.addedBy}</span>

  //             <span className="flex gap-1 justify-center">
  //               <EditButton
  //                 handleUpdate={() => {
  //                   setEditExpense(expense);
  //                   handleToggleViewModal("EDIT");
  //                 }}
  //               />
  //               <ViewButton
  //                 handleView={() => {
  //                   setViewExpense(expense);
  //                   handleToggleViewModal("VIEW");
  //                 }}
  //               />
  //               <DeleteButton
  //                 handleDelete={() => {
  //                   setViewExpense(expense);
  //                   handleToggleViewModal("DELETE");
  //                 }}
  //               />
  //             </span>
  //           </div>
  //         ))}

  //         {filteredExpenses.length > 0 && (
  //           <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1.5fr] border-t-2 bg-gray-100 font-semibold p-2 text-sm">
  //             <span></span>
  //             <span></span>
  //             <span className="text-right">Total Expense:</span>
  //             <span className="text-blue-500">
  //               {totalExpenseAmount.toLocaleString()}
  //             </span>
  //             <span></span>
  //             <span></span>
  //           </div>
  //         )}
  //       </div>
  //     </div>

  //     <div className="flex items-center justify-between mt-3">
  //       <ShowDataNumber
  //         start={(pageNo - 1) * limit + 1}
  //         end={Math.min(pageNo * limit, totalRecords)}
  //         total={totalRecords}
  //       />

  //       <Pagination
  //         pageNo={pageNo}
  //         handleIncrementPageButton={handleIncrementPageButton}
  //         handleDecrementPageButton={handleDecrementPageButton}
  //       />
  //     </div>

  //     {isOpenModal === "ADD" && (
  //       <AddExpense
  //         setModal={() => {
  //           handleToggleViewModal("");
  //           getAllExpenses();
  //         }}
  //       />
  //     )}

  //     {isOpenModal === "EDIT" && (
  //       <EditExpense
  //         setModal={() => setIsOpenModal("")}
  //         editExpense={editExpense}
  //       />
  //     )}

  //     {isOpenModal === "VIEW" && (
  //       <ViewExpense
  //         viewExpense={viewExpense}
  //         setIsOpenModal={() => handleToggleViewModal("")}
  //       />
  //     )}

  //     {isOpenModal === "DELETE" && (
  //       <ConfirmationModal
  //         isOpen={() => {}}
  //         onClose={() => handleToggleViewModal("")}
  //         onConfirm={async () => {
  //           if (!viewExpense) return;
  //           await axios.delete(
  //             `${BASE_URL}/api/admin/deleteExpense/${viewExpense.id}`,
  //             { headers: { Authorization: `Bearer ${token}` } }
  //           );
  //           handleToggleViewModal("");
  //           getAllExpenses();
  //         }}
  //       />
  //     )}
  //   </div>
  // );

   return (
  <div className="w-full px-2 sm:px-4">
    <TableTitle tileName="Expenses" activeFile="Expenses list" />

    <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
        <span className="text-sm sm:text-base">
          Total Number of Expenses:
          <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
            [{totalRecords}]
          </span>
        </span>

        <CustomButton
          handleToggle={() => handleToggleViewModal("ADD")}
          label="Add Expense"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 text-gray-800">
        <div className="text-sm">
          <span>Show</span>
          <span className="bg-gray-200 rounded mx-1 p-1">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPageNo(1);
              }}
              className="bg-transparent outline-none"
            >
              {pageSizes.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </span>
          <span>entries</span>
        </div>

        <TableInputField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Table Wrapper */}
      <div className="mx-2 mt-2 overflow-x-auto max-h-[28.4rem]">
        <div className="min-w-[900px]">
          {/* Table Header */}
          <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1.5fr] items-center bg-indigo-900 text-white font-semibold text-sm sticky top-0 z-10 p-2">
            <span>Sr#</span>
            <span>Expense Name</span>
            <span>Category</span>
            <span>Amount</span>
            <span>Added By</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Table Body */}
          {filteredExpenses.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-4">
              No records available at the moment!
            </div>
          ) : (
            filteredExpenses.map((expense, index) => (
              <div
                key={expense.id}
                className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1.5fr] border items-center border-gray-300 text-gray-800 text-sm p-2 hover:bg-gray-100 transition"
              >
                <span>{(pageNo - 1) * limit + index + 1}</span>
                <span className="truncate">{expense.expenseName}</span>
                <span className="truncate">{expense.categoryName}</span>
                <span>{expense.amount}</span>
                <span>{expense.addedBy}</span>

                {/* Actions */}
                <span className="flex flex-wrap items-center justify-center gap-1">
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
            ))
          )}

          {/* Total Row */}
          {filteredExpenses.length > 0 && (
            <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1.5fr] border-t-2 bg-gray-100 font-semibold p-2 text-sm">
              <span></span>
              <span></span>
              <span className="text-right">Total Expense:</span>
              <span className="text-blue-500">
                {totalExpenseAmount.toLocaleString()}
              </span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Pagination */}
    <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-3">
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

    {/* Modals */}
    {isOpenModal === "ADD" && (
      <AddExpense
        setModal={() => {
          handleToggleViewModal("");
          getAllExpenses();
        }}
      />
    )}

    {isOpenModal === "EDIT" && (
      <EditExpense setModal={() => setIsOpenModal("")} editExpense={editExpense} />
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
            { headers: { Authorization: `Bearer ${token}` } }
          );
          handleToggleViewModal("");
          getAllExpenses();
        }}
      />
    )}
  </div>
);

};
