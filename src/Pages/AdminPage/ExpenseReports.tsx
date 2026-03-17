import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";

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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";
import { RiInboxArchiveLine } from "react-icons/ri";

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

interface ExpenseReportsProps {
  externalSearch: string;
  externalPageSize: number;
}

export interface BusinessVarType {
  id: number;
  name: string;
  email: string;
  contact: string;
  logo?: string;
}

export interface BusinessVarType {
  id: number;
  name: string;
  email: string;
  contact: string;
  logo?: string;
}

export const ExpenseReports = ({
  externalSearch,
  externalPageSize,
}: ExpenseReportsProps) => {
  const { currentUser } = useAppSelector((s) => s.officeState);
  const { loader } = useAppSelector((s) => s.NavigateState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const today = new Date().toLocaleDateString("sv-SE");

  // State
  const [pageNo, setPageNo] = useState(1);
  const [expenses, setExpenses] = useState<ExpenseT[]>([]);
  const [categories, setCategories] = useState<CategoryT[]>([]);
  const [businessVar, setBusinessVar] = useState<BusinessVarType | null>(null);

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

  const fetchBusinessVariable = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/admin/business-variables`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.length > 0) {
        setBusinessVar(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch business variable:", err);
    }
  }, [token]);

  const printDiv = () => {
    const printStyles = `
    @page { size: A4 landscape; margin: 10mm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; }
    .print-header { text-align: center; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #333; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; font-weight: bold; }
  `;

    const tableRows = filteredExpenses
      .map(
        (e, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${e.categoryName}</td>
        <td>${e.expenseName}</td>
        <td>${e.amount.toLocaleString()}</td>
        <td>${e.date}</td>
      </tr>
    `,
      )
      .join("");

    const printWindow = window.open("", "_blank");

    const logoUrl = businessVar?.logo
      ? businessVar.logo.startsWith("http")
        ? businessVar.logo
        : `${BASE_URL}/${businessVar.logo}`
      : "";

    const logoHtml = logoUrl
      ? `<img src="${logoUrl}" style="max-height:120px; margin-bottom:10px;" />`
      : "";

    printWindow?.document.write(`
    <html>
      <head>
        <title>Expense Report</title>
        <style>${printStyles}</style>
      </head>
      <body>
        
      <div class="print-header">
  ${logoHtml}
  <h2>${businessVar?.name || "Office Management System"}</h2>
  <p>${businessVar?.email || ""}</p>
  <p>${businessVar?.contact || ""}</p>

  <h3>Attendance Report</h3>
  <p>
    <strong>From:</strong> ${appliedFilters.startDate}
    <strong>To:</strong> ${appliedFilters.endDate}
  </p>
</div>

        <table>
          <thead>
            <tr>
              <th>Sr#</th>
              <th>Category</th>
              <th>Expense Name</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `);

    printWindow?.document.close();

    setTimeout(() => {
      printWindow?.focus();
      printWindow?.print();
      printWindow?.close();
    }, 500);
  };

  useEffect(() => {
    document.title = "(OMS) EXPENSE REPORTS";
    getExpenses();
    getExpenseCategories();
    fetchBusinessVariable();
  }, [getExpenses, getExpenseCategories, fetchBusinessVariable]);

  // Reset page on search
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

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
          .includes(externalSearch.toLowerCase()),
      );
  }, [expenses, appliedFilters, externalSearch]);

  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedExpenses = filteredExpenses.slice(
    startIndex,
    startIndex + externalPageSize,
  );

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      {/* --- FILTER SECTION --- */}
      <div className="p-3 bg-white border-b border-gray-100">
        <div className="flex flex-wrap items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow">
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

          <div className="flex gap-2 w-full lg:w-auto">
            <button
              onClick={handleSearch}
              className="bg-slate-700 text-white px-6 py-3 rounded-lg shadow-sm flex-1 lg:flex-none 
            flex items-center justify-center transition-colors"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Search
            </button>
            <button
              onClick={printDiv}
              className="bg-blue-400 text-white px-6 py-3 rounded-lg shadow-sm flex-1 lg:flex-none 
            flex items-center justify-center transition-colors"
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* --- TABLE CONTENT AREA --- */}
      <div className="overflow-auto px-3">
        <div className="min-w-[1000px]">
          {/* Header Row - Aligned with UsersDetails */}
          <div className="pt-3">
            <div className="grid grid-cols-[60px_1fr_1fr_1fr_auto] bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-4 py-3 shadow-sm">
              <span className="text-left">Sr#</span>
              <span className="text-left">Category</span>
              <span className="text-left">Expense Name</span>
              <span className="text-left">Amount</span>
              <span className="text-left pr-10">Date</span>
            </div>
          </div>

          {/* Body Rows */}
          <div className="py-2">
            {paginatedExpenses.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
                <p className="text-sm">
                  Try adjusting your filters or date range.
                </p>
              </div>
            ) : (
              <div id="myDiv" className="flex flex-col gap-2">
                {paginatedExpenses.map((e, index) => (
                  <div
                    key={e.id}
                    className="grid grid-cols-[60px_1fr_1fr_1fr_auto] items-center px-4 py-3 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Category - Icons Removed */}
                    <div className="text-gray-700 truncate">
                      {e.categoryName}
                    </div>

                    {/* Expense Name - Icons Removed */}
                    <div className="text-gray-800  truncate">
                      {e.expenseName}
                    </div>

                    {/* Amount - Icons Removed */}
                    <div className="text-gray-700 truncate">
                      {e.amount.toLocaleString()}
                    </div>

                    {/* Date - Icons Removed */}
                    <div className="text-gray-600 truncate">{e.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- PAGINATION SECTION --- */}
      <div className="mt-auto flex flex-row items-center justify-between p-3 border-t border-gray-100 bg-white">
        <ShowDataNumber
          start={filteredExpenses.length === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + externalPageSize, filteredExpenses.length)}
          total={filteredExpenses.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() => {
            if (
              pageNo < Math.ceil(filteredExpenses.length / externalPageSize)
            ) {
              setPageNo((p) => p + 1);
            }
          }}
        />
      </div>
    </div>
  );
};
