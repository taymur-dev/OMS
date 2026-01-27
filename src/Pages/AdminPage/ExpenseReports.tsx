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
import { Footer } from "../../Components/Footer";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";

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

export const ExpenseReports = () => {
  const { currentUser } = useAppSelector((s) => s.officeState);
  const { loader } = useAppSelector((s) => s.NavigateState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const today = new Date().toLocaleDateString("sv-SE");

  // State
  const [selectedValue] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [expenses, setExpenses] = useState<ExpenseT[]>([]);
  const [categories, setCategories] = useState<CategoryT[]>([]);

  // Input states (Form values)
  const [reportData, setReportData] = useState({
    startDate: today,
    endDate: today,
    expenseCategoryId: "",
  });

  // Filter states (Actual applied values)
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: today,
    endDate: today,
    expenseCategoryId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters({
      startDate: reportData.startDate,
      endDate: reportData.endDate,
      expenseCategoryId: reportData.expenseCategoryId,
    });
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
          <strong>From: ${appliedFilters.startDate}</strong>
          <strong>To: ${appliedFilters.endDate}</strong>
        </div>
        ${content}
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
      .filter(
        (e) =>
          e.date >= appliedFilters.startDate &&
          e.date <= appliedFilters.endDate,
      )
      .filter((e) =>
        appliedFilters.expenseCategoryId
          ? e.expenseCategoryId.toString() === appliedFilters.expenseCategoryId
          : true,
      )
      .filter((e) =>
        `${e.expenseName} ${e.categoryName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
  }, [expenses, appliedFilters, searchTerm]);

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        <TableTitle tileName="Expense Report" />

        <hr className="border border-b border-gray-200" />

        {/* --- FILTER SECTION (Matched to Sales Report Dimensions) --- */}
        <div className="p-2 bg-white">
          <div className="flex flex-wrap items-end gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow min-w-[300px]">
              <InputField
                labelName="From"
                type="date"
                value={reportData.startDate}
                handlerChange={handleChange}
                name="startDate"
              />
              <InputField
                labelName="To"
                type="date"
                value={reportData.endDate}
                handlerChange={handleChange}
                name="endDate"
              />

              <OptionField
                labelName="Category"
                name="expenseCategoryId"
                value={reportData.expenseCategoryId}
                optionData={categories.map((c) => ({
                  id: c.id,
                  label: c.categoryName,
                  value: c.id,
                }))}
                inital="All Categories"
                handlerChange={handleChange}
              />
            </div>

            {/* Buttons Container: Wraps and goes full-width on smaller screens */}
            <div className="flex gap-2 flex-grow lg:flex-grow-0 min-w-full lg:min-w-fit">
              <button
                onClick={handleSearch}
                className="bg-indigo-900 text-white px-6 py-3 rounded-xl shadow flex-1 flex items-center justify-center whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faSearch} className="mr-2" />
                Search
              </button>

              <button
                onClick={printDiv}
                className="bg-blue-900 text-white px-6 py-3 rounded-xl shadow flex-1 flex items-center justify-center whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faPrint} className="mr-2" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* --- SUB-HEADER SECTION (Search & Info) --- */}
        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            <div className="text-sm font-bold text-gray-600">
              From:{" "}
              <span className="text-black">{appliedFilters.startDate}</span> To:{" "}
              <span className="text-black">{appliedFilters.endDate}</span>
            </div>

            <TableInputField
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto px-2">
          <div id="myDiv" className="min-w-[800px]">
            {/* Sticky Table Header - Using grid-cols-5 for Expense Fields */}
            <div className="grid grid-cols-5 bg-indigo-900 text-white items-center font-semibold text-sm sticky top-0 z-10 p-2">
              <span>Sr#</span>
              <span>Category</span>
              <span>Expense</span>
              <span>Amount</span>
              <span>Date</span>
            </div>

            {/* Table Body */}
            {filteredExpenses.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10 border-x border-b border-gray-200">
                No records available at the moment!
              </div>
            ) : (
              filteredExpenses
                .slice((pageNo - 1) * selectedValue, pageNo * selectedValue)
                .map((e, index) => (
                  <div
                    key={e.id}
                    className="grid grid-cols-5 border-b border-x border-gray-200 text-gray-800 items-center text-sm p-2 hover:bg-gray-50 transition"
                  >
                    <span>{(pageNo - 1) * selectedValue + index + 1}</span>
                    <span className="truncate">{e.categoryName}</span>
                    <span className="truncate">{e.expenseName}</span>
                    <span>{e.amount}</span>
                    <span>{e.date}</span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* --- PAGINATION SECTION --- */}
        <div className="flex flex-row items-center justify-between p-2">
          <ShowDataNumber
            start={
              filteredExpenses.length === 0
                ? 0
                : (pageNo - 1) * selectedValue + 1
            }
            end={Math.min(pageNo * selectedValue, filteredExpenses.length)}
            total={filteredExpenses.length}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={() =>
              setPageNo((p) => Math.max(p - 1, 1))
            }
            handleIncrementPageButton={() => setPageNo((p) => p + 1)}
          />
        </div>
      </div>

      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
