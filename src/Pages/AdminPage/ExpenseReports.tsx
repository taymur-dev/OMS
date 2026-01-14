import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";

import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { InputField } from "../../Components/InputFields/InputField";
import { OptionField } from "../../Components/InputFields/OptionField";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

type ExpenseT = {
  id: number;
  expenseName: string;
  categoryName: string;
  expenseCategoryId: number;
  amount: number;
  date: string;
};

type CategoryT = {
  id: number;
  categoryName: string;
};

const pageSizes = [10, 25, 50, 100];

export const ExpenseReports = () => {
  const { currentUser } = useAppSelector((s) => s.officeState);
  const { loader } = useAppSelector((s) => s.NavigateState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const today = new Date().toLocaleDateString("sv-SE");

  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [expenses, setExpenses] = useState<ExpenseT[]>([]);
  const [categories, setCategories] = useState<CategoryT[]>([]);

  const [filters, setFilters] = useState({
    startDate: today,
    endDate: today,
    expenseCategoryId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPageNo(1);
  };

  const handleChangeShowData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(Number(e.target.value));
    setPageNo(1);
  };

  const getExpenses = useCallback(async () => {
    try {
      dispatch(navigationStart());
      const res = await axios.get(`${BASE_URL}/api/admin/getExpense`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedExpenses = res.data.data.map((expense: ExpenseT) => ({
        ...expense,
        date: new Date(expense.date).toLocaleDateString("sv-SE"),
      }));

      setExpenses(formattedExpenses);
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(navigationSuccess("EXPENSE REPORTS"));
    }
  }, [dispatch, token]);

  const getExpenseCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getExpenseCategory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const printDiv = () => {
    const printStyles = `
      @page { size: A4 portrait; }
      body { font-family: Arial, sans-serif; font-size: 11pt; color: #000; }
      .print-container { width: 100%; padding: 0; }
      .print-header { text-align: center; }
      .print-header h1 { font-size: 25pt; font-weight: bold; }
      .print-header h2 { font-size: 20pt; font-weight: normal; }
      .date-range { text-align: left; font-size: 14pt; display: flex; justify-content: space-between; }
      table { width: 100%; border-collapse: collapse; border: 2px solid #000; }
      thead { background-color: #ccc; color: #000; }
      thead th, tbody td { border: 2px solid #000; font-size: 10pt; text-align: left; }
      tbody tr:nth-child(even) { background-color: #f9f9f9; }
      .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10pt; padding: 10px 0;
       border-top: 1px solid #ccc; }
      @media print { .no-print { display: none; } }
    `;
    const content = document.getElementById("myDiv")?.outerHTML || "";
    document.body.innerHTML = `
      <div class="print-container">
        <div class="print-header">
          <h1>Office Management System</h1>
          <h2>Expense Report</h2>
        </div>
        <div class="date-range">
          <strong>From: ${filters.startDate}</strong>
          <strong>To: ${filters.endDate}</strong>
        </div>
        ${content}
        <div class="footer"></div>
      </div>
    `;
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(printStyles));
    document.head.appendChild(style);
    window.print();
    location.reload();
  };

  useEffect(() => {
    document.title = "(OMS) EXPENSE REPORTS";
    getExpenses();
    getExpenseCategories();
  }, [getExpenses, getExpenseCategories]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.date >= filters.startDate && e.date <= filters.endDate)
      .filter((e) =>
        filters.expenseCategoryId
          ? e.expenseCategoryId.toString() === filters.expenseCategoryId
          : true
      )
      .filter((e) =>
        `${e.expenseName} ${e.categoryName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
  }, [expenses, filters, searchTerm]);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Expense Report" activeFile="Expense Report" />

      <div className="flex items-center justify-between text-gray-800 py-2 mx-2">
        <div>
          Show
          <span className="bg-gray-200 rounded mx-1 p-1">
            <select value={selectedValue} onChange={handleChangeShowData}>
              {pageSizes.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </span>
          entries
        </div>
        <TableInputField
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <div
        className="max-h-[58vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white
       overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div className="flex flex-1 py-1 gap-1 items-center justify-center">
            <InputField
              labelName="From"
              type="date"
              value={filters.startDate}
              handlerChange={handleChange}
              name="startDate"
            />
            <InputField
              labelName="To"
              type="date"
              value={filters.endDate}
              handlerChange={handleChange}
              name="endDate"
            />
            <OptionField
              labelName="Category"
              name="expenseCategoryId"
              value={filters.expenseCategoryId}
              optionData={categories.map((c) => ({
                id: c.id,
                label: c.categoryName,
                value: c.id,
              }))}
              inital="All Categories"
              handlerChange={handleChange}
            />

            <div className="w-full flex justify-end mt-4">
              <div className="text-gray-800 flex items-center py-2 font-semibold">
                <span className="mr-1">From</span>
                <span className="text-red-500 mr-1">{filters.startDate}</span>
                <span className="mr-1">To</span>
                <span className="text-red-500">{filters.endDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          id="myDiv"
          className="max-h-[28.4rem] overflow-y-auto mx-2"
        >
          <div
            className="grid grid-cols-5 bg-indigo-500 text-white font-semibold border border-gray-600 text-sm
           sticky top-0 z-10 p-[7px]"
          >
            <span>Sr#</span>
            <span>Category</span>
            <span>Expense</span>
            <span>Amount</span>
            <span>Date</span>
          </div>

          {filteredExpenses
            .slice((pageNo - 1) * selectedValue, pageNo * selectedValue)
            .map((e, index) => (
              <div
                key={e.id}
                className="grid grid-cols-5 border border-gray-600 text-gray-800 hover:bg-gray-100 transition 
                duration-200 text-sm items-center justify-center p-[5px]"
              >
                <span>{(pageNo - 1) * selectedValue + index + 1}</span>
                <span>{e.categoryName}</span>
                <span>{e.expenseName}</span>
                <span>{e.amount}</span>
                <span>{e.date}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber
          start={(pageNo - 1) * selectedValue + 1}
          end={Math.min(pageNo * selectedValue, filteredExpenses.length)}
          total={filteredExpenses.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() => setPageNo((p) => p + 1)}
        />
      </div>

      <div className="flex items-center justify-center mt-4">
        <button
          onClick={printDiv}
          className="bg-green-500 text-white py-2 px-4 rounded font-semibold hover:cursor-pointer"
        >
          Download
        </button>
      </div>
    </div>
  );
};
