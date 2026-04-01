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
import { toast } from "react-toastify";

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
  address: string;
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
    if (filteredExpenses.length === 0) {
      toast.error("Report is empty. Nothing to print!", {
        toastId: "empty-report-print",
      });
      return;
    }

    const printStyles = `
    @page { size: A4 portrait; margin: 10mm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; color: #333; }
    .print-header { text-align: center; margin-bottom: 10px; }
    
    /* Line height and icon alignment */
    .business-info { line-height: 1.2; margin-bottom: 10px; color: #555; font-size: 9pt; }
    .info-item { display: inline-flex; align-items: center; margin: 0 10px; }
    .info-icon { width: 12px; height: 12px; margin-right: 5px; fill: #666; }
    
    .report-meta { text-align: left; margin-bottom: 5px; font-size: 9pt; }
    table { width: 100%; border-collapse: collapse; margin-top: 5px; }
    th, td { border: 1px solid #333; padding: 4px 8px; text-align: left; }
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

    // SVG Icons
    const addressIcon = `
    <svg class="info-icon" viewBox="0 0 24 24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
    </svg>`;
    const phoneIcon = `
    <svg class="info-icon" viewBox="0 0 24 24">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>`;

    printWindow?.document.write(`
    <html>
      <head>
        <title>Expense Report</title>
        <style>${printStyles}</style>
      </head>
      <body>
        <div class="print-header" style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
          <div class="header-details" style="text-align: center;">
            <h2 style="margin: 0; font-size: 30px; font-weight: bold;">
              ${businessVar?.name ?? "Office Management System"}
            </h2>
            
            <div class="business-info" style="margin-top: 5px; font-size: 14px;">
              <span class="info-item" style="display: block; margin-bottom: 3px;">
                ${phoneIcon} ${businessVar?.contact ?? "N/A"}
              </span>
              <span class="info-item" style="display: block;">
                ${addressIcon} ${businessVar?.address ?? "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div style="text-align: center; padding-top: 10px;">
          <h3 style="margin: 0;">Expense Report</h3>
        </div>

        <div class="report-meta" style="margin-top: 10px; font-size: 13px;">
          <strong>From:</strong> ${appliedFilters.startDate} &nbsp;&nbsp;
          <strong>To:</strong> ${appliedFilters.endDate}
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50px;">Sr#</th>
              <th>Category</th>
              <th>Expense Name</th>
              <th>Amount</th>
              <th style="width: 100px;">Date</th>
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
                    className="grid grid-cols-[60px_1fr_1fr_1fr_auto] items-center px-4 py-2 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
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
          totalNum={filteredExpenses.length}
          pageSize={externalPageSize}
          handlePageClick={(targetPage) => setPageNo(targetPage)}
        />
      </div>
    </div>
  );
};
