import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { InputField } from "../../Components/InputFields/InputField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

type Sale = {
  id: number;
  saleDate: string;
  QTY: number;
  UnitPrice: number;
};

type allExpenseT = {
  id: number;
  date: string;
  amount: number | string;
};

type AccountEntry = {
  id: number;
  debit: number;
  credit: number;
  payment_date: string;
};

type CustomerAccountEntry = {
  id: number;
  invoiceNo?: string;
  refNo: string;
  debit: number;
  credit: number;
  paymentMethod: string;
  paymentDate: string;
};

type SupplierAccountEntry = {
  id: number;
  invoiceNo?: string;
  refNo: string;
  debit: number;
  credit: number;
  paymentMethod: string;
  paymentDate: string;
};

type BusinessVarType = {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
  logo?: string;
};

export const ProfitLossReport = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const today = new Date().toLocaleDateString("sv-SE");

  // --- STATE ---
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<allExpenseT[]>([]);
  const [empAccounts, setEmpAccounts] = useState<AccountEntry[]>([]);
  const [customerAccounts, setCustomerAccounts] = useState<
    CustomerAccountEntry[]
  >([]);
  const [supplierAccounts, setSupplierAccounts] = useState<
    SupplierAccountEntry[]
  >([]);
  const [businessVar, setBusinessVar] = useState<BusinessVarType | null>(null);

  const [reportData, setReportData] = useState({
    startDate: today,
    endDate: today,
  });
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: today,
    endDate: today,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters({
      startDate: reportData.startDate,
      endDate: reportData.endDate,
    });
  };

  // --- API CALLS ---
  const getSales = useCallback(async () => {
    const res = await axios.get(`${BASE_URL}/api/admin/getSales`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSales(res.data);
  }, [token]);

  const getExpenses = useCallback(async () => {
    const res = await axios.get(`${BASE_URL}/api/admin/getExpense`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setExpenses(res.data.data);
  }, [token]);

  const getEmployeeData = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/getAllEmployeeAccounts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setEmpAccounts(res.data.accounts || []);
    } catch (error) {
      console.error("Emp Accounts fetch error", error);
    }
  }, [token]);

  const getCustomerData = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/getAllCustomerAccounts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCustomerAccounts(res.data || []);
    } catch (error) {
      console.error("Customer Accounts fetch error", error);
    }
  }, [token]);

  const getSupplierData = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/getAllSupplierAccounts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSupplierAccounts(res.data || []);
    } catch (error) {
      console.error("Supplier Accounts fetch error", error);
    }
  }, [token]);

  const fetchBusinessVariable = useCallback(async () => {
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

  useEffect(() => {
    document.title = "(OMS) PROFIT LOSS REPORT";
    getSales();
    getExpenses();
    getEmployeeData();
    getCustomerData();
    getSupplierData();
    fetchBusinessVariable();
  }, [
    getSales,
    getExpenses,
    getEmployeeData,
    getCustomerData,
    getSupplierData,
    fetchBusinessVariable,
  ]);

  // --- CALCULATIONS ---

  // 1. Income: Sales + Employee Receivables (Debit)
  const incomeData = useMemo(() => {
    const filteredSales = sales.filter((s) => {
      const sDate = new Date(s.saleDate).toLocaleDateString("sv-SE");
      return (
        sDate >= appliedFilters.startDate && sDate <= appliedFilters.endDate
      );
    });

    const filteredEmpReceivables = empAccounts.filter((acc) => {
      const accDate = new Date(acc.payment_date).toLocaleDateString("sv-SE");
      return (
        accDate >= appliedFilters.startDate && accDate <= appliedFilters.endDate
      );
    });

    const filteredCustReceivables = customerAccounts.filter((acc) => {
      const accDate = new Date(acc.paymentDate).toLocaleDateString("sv-SE");
      return (
        accDate >= appliedFilters.startDate && accDate <= appliedFilters.endDate
      );
    });

    const filteredSuppReceivables = supplierAccounts.filter((acc) => {
      const accDate = new Date(acc.paymentDate).toLocaleDateString("sv-SE");
      return (
        accDate >= appliedFilters.startDate && accDate <= appliedFilters.endDate
      );
    });

    const sTotal = filteredSales.reduce(
      (sum, sale) => sum + sale.QTY * sale.UnitPrice,
      0,
    );
    const rTotal = filteredEmpReceivables.reduce(
      (sum, acc) => sum + Number(acc.debit || 0),
      0,
    );

    const cTotal = filteredCustReceivables.reduce(
      (sum, acc) => sum + Number(acc.debit || 0),
      0,
    );

    const suppRecTotal = filteredSuppReceivables.reduce(
      (sum, acc) => sum + Number(acc.debit || 0),
      0,
    );

    return {
      sTotal,
      rTotal,
      cTotal, // Customer Total
      suppRecTotal,
      grandTotal: sTotal + rTotal + cTotal + suppRecTotal,
    };
  }, [sales, empAccounts, customerAccounts, appliedFilters, supplierAccounts]);

  // 2. Expenses: General Expenses + Employee Payables (Credit)
  const expenseData = useMemo(() => {
    const filteredExp = expenses.filter((e) => {
      const eDate = new Date(e.date).toLocaleDateString("sv-SE");
      return (
        eDate >= appliedFilters.startDate && eDate <= appliedFilters.endDate
      );
    });

    const filteredEmpPayables = empAccounts.filter((acc) => {
      const accDate = new Date(acc.payment_date).toLocaleDateString("sv-SE");
      return (
        accDate >= appliedFilters.startDate && accDate <= appliedFilters.endDate
      );
    });

    const filteredCustPayables = customerAccounts.filter((acc) => {
      const accDate = new Date(acc.paymentDate).toLocaleDateString("sv-SE");
      return (
        accDate >= appliedFilters.startDate && accDate <= appliedFilters.endDate
      );
    });

    const filteredSuppPayables = supplierAccounts.filter((acc) => {
      const accDate = new Date(acc.paymentDate).toLocaleDateString("sv-SE");
      return (
        accDate >= appliedFilters.startDate && accDate <= appliedFilters.endDate
      );
    });

    const eTotal = filteredExp.reduce(
      (sum, exp) => sum + Number(exp.amount || 0),
      0,
    );
    const pTotal = filteredEmpPayables.reduce(
      (sum, acc) => sum + Number(acc.credit || 0),
      0,
    );
    const cpTotal = filteredCustPayables.reduce(
      (sum, acc) => sum + Number(acc.credit || 0),
      0,
    );

    const suppPayTotal = filteredSuppPayables.reduce(
      (sum, acc) => sum + Number(acc.credit || 0),
      0,
    );

    return {
      eTotal,
      pTotal,
      cpTotal, // Customer Total
      suppPayTotal,
      grandTotal: eTotal + pTotal + cpTotal + suppPayTotal,
    };
  }, [
    expenses,
    empAccounts,
    customerAccounts,
    supplierAccounts,
    appliedFilters,
  ]);

  const netProfitLoss = incomeData.grandTotal - expenseData.grandTotal;

  const printDiv = () => {
    if (incomeData.grandTotal === 0 && expenseData.grandTotal === 0) {
      toast.error("Report is empty. Nothing to print!", {
        toastId: "empty-profit-loss",
      });
      return;
    }

    const printStyles = `
    @page { size: A4 portrait; margin: 10mm; }
    body { font-family: Arial, sans-serif; font-size: 12pt; color: #333; background-color: white !important; }
    
    /* Ensure header has no background and is centered */
    .print-header { 
      text-align: center; 
      margin-bottom: 20px; 
      display: flex; 
      flex-direction: column; 
      align-items: center;
      background-color: transparent !important; /* Removes any inherited gray */
    }
    
    .report-section { margin-bottom: 20px; border-radius: 8px; padding: 15px; }
    .section-title { font-weight: bold; padding: 5px 10px; border-radius: 6px; margin-bottom: 10px; }
    .row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dashed #ddd; }
    .row:last-child { border-bottom: none; }
    .total { font-weight: bold; margin-top: 10px; border-top: 2px solid #000; padding-top: 5px; }
    .green { color: green; }
    .red { color: red; }
  `;

    const styleEl = document.createElement("style");
    styleEl.innerHTML = printStyles;
    document.head.appendChild(styleEl);

    const reportElement = document.getElementById("printableReport");
    if (reportElement) {
      const originalContent = document.body.innerHTML;

      // Added "background-color: white" to the inline style for extra safety
      const headerHTML = `
      <div class="print-header" style="text-align: center; padding-bottom: 10px; margin-bottom: 15px; background-color: white;">
        <h2 style="margin: 0; font-size: 26px; font-weight: bold; color: black;">
          ${businessVar?.name || "Business Name"}
        </h2>
        <div class="business-info" style="margin-top: 5px; font-size: 11pt; color: #555;">
          <p style="margin: 2px 0;"> ${businessVar?.contact || "N/A"}</p>
          <p style="margin: 2px 0;">${businessVar?.address || "N/A"}</p>
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 10px; background-color: white;">
        <h3 style="margin: 0; font-weight: bold;">Profit & Loss Report</h3>
      </div>

      <div class="report-meta" style="text-align: left; margin-bottom: 10px; font-size: 10pt; padding-bottom: 5px; background-color: white;">
        <strong>From:</strong> ${appliedFilters.startDate} &nbsp;&nbsp;&nbsp;
        <strong>To:</strong> ${appliedFilters.endDate}
      </div>
    `;

      document.body.innerHTML = headerHTML + reportElement.outerHTML;
      window.print();

      document.body.innerHTML = originalContent;
      document.head.removeChild(styleEl);
      window.location.reload(); // Recommended to restore JS listeners after overwriting innerHTML
    }
  };
  return (
    <div className="flex flex-col gap-6 p-4 bg-gray-50 min-h-screen">
      {/* FILTER SECTION */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
            <InputField
              labelName="From"
              type="date"
              name="startDate"
              value={reportData.startDate}
              handlerChange={handleChange}
            />
            <InputField
              labelName="To"
              type="date"
              name="endDate"
              value={reportData.endDate}
              handlerChange={handleChange}
            />
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <button
              onClick={handleSearch}
              className="bg-slate-700 text-white px-6 py-2.5 rounded-lg flex items-center hover:bg-slate-800"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" /> Search
            </button>
            <button
              onClick={printDiv}
              className="bg-blue-500 text-white px-6 py-2.5 rounded-lg flex items-center hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2" /> Print
            </button>
          </div>
        </div>
      </div>

      {/* REPORT CONTENT */}
      <div id="printableReport" className="flex flex-col gap-3">
        {" "}
        {/* Reduced gap from 8 to 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          {/* Reduced gap from 8 to 4 */}
          {/* INCOME CARD */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-green-500 transition-all hover:shadow-lg">
            {/* Reduced vertical padding from py-4 to py-2 */}
            <div className="bg-green-50 px-4 py-2 flex justify-between items-center">
              <h3 className="font-bold text-green-800 flex items-center gap-2 text-sm">
                <span className="bg-green-200 p-1.5 rounded-lg text-green-700">
                  💰
                </span>
                INCOME STREAMS
              </h3>
            </div>

            {/* Reduced padding from p-6 to p-3 and space-y from 4 to 2 */}
            <div className="p-3 space-y-2">
              <div className="flex justify-between items-center group">
                <span className="text-xs text-gray-500 group-hover:text-gray-800 transition-colors">
                  Sales Revenue
                </span>
                <span className="font-bold text-sm text-gray-800 bg-gray-50 px-2 py-0.5 rounded">
                  {incomeData.sTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-xs text-gray-500 group-hover:text-gray-800 transition-colors">
                  Employee Receivables
                </span>
                <span className="font-bold text-sm text-gray-800 bg-gray-50 px-2 py-0.5 rounded">
                  {incomeData.rTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-xs text-gray-500 group-hover:text-gray-800 transition-colors">
                  Customer Receivables
                </span>
                <span className="font-bold text-sm text-gray-800 bg-gray-50 px-2 py-0.5 rounded">
                  {incomeData.cTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center group border-b pb-2">
                <span className="text-xs text-gray-500 group-hover:text-gray-800 transition-colors">
                  Supplier Receivables
                </span>
                <span className="font-bold text-sm text-gray-800 bg-gray-50 px-2 py-0.5 rounded">
                  {incomeData.suppRecTotal.toLocaleString()}
                </span>
              </div>

              <div className="pt-1 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                  Total Income
                </span>
                <span className="text-xl font-black text-green-600">
                  {incomeData.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          {/* EXPENSE CARD */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-red-500 transition-all hover:shadow-lg">
            {/* Reduced vertical padding from py-4 to py-2 */}
            <div className="bg-red-50 px-4 py-2 flex justify-between items-center">
              <h3 className="font-bold text-red-800 flex items-center gap-2 text-sm">
                <span className="bg-red-200 p-1.5 rounded-lg text-red-700">
                  💸
                </span>
                EXPENSE BREAKDOWN
              </h3>
            </div>

            {/* Reduced padding from p-6 to p-3 and space-y from 4 to 2 */}
            <div className="p-3 space-y-2">
              <div className="flex justify-between items-center group">
                <span className="text-xs text-gray-500 group-hover:text-gray-800 transition-colors">
                  General Expenses
                </span>
                <span className="font-bold text-sm text-gray-800 bg-gray-50 px-2 py-0.5 rounded">
                  {expenseData.eTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-xs text-gray-500 group-hover:text-gray-800 transition-colors">
                  Employee Payables
                </span>
                <span className="font-bold text-sm text-gray-800 bg-gray-50 px-2 py-0.5 rounded">
                  {expenseData.pTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-xs text-gray-500 group-hover:text-gray-800 transition-colors">
                  Customer Payables
                </span>
                <span className="font-bold text-sm text-gray-800 bg-gray-50 px-2 py-0.5 rounded">
                  {expenseData.cpTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center group border-b pb-2">
                <span className="text-xs text-gray-500 group-hover:text-gray-800 transition-colors">
                  Supplier Payables
                </span>
                <span className="font-bold text-sm text-gray-800 bg-gray-50 px-2 py-0.5 rounded">
                  {expenseData.suppPayTotal.toLocaleString()}
                </span>
              </div>

              <div className="pt-1 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                  Total Expenses
                </span>
                <span className="text-xl font-black text-red-600">
                  {expenseData.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* SUMMARY CARD */}
        {/* Reduced py-3 to py-2 and text sizes */}
        <div
          className={`rounded-xl border-2 px-6 py-2 flex flex-col sm:flex-row justify-between items-center transition-all shadow-lg ${
            netProfitLoss >= 0 ? "border-gray-200" : "border-gray-200"
          }`}
        >
          <div className="text-black">
            <p className="text-[10px] uppercase tracking-widest opacity-80">
              Net Result
            </p>
            <h2
              className={`font-black leading-tight ${
                netProfitLoss >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {netProfitLoss >= 0 ? "Net Profit" : "Net Loss"}
            </h2>
          </div>
          <div
            className={`font-black mt-2 sm:mt-0 bg-white/20 px-4 py-1 rounded-lg backdrop-blur-sm ${
              netProfitLoss >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {netProfitLoss > 0 ? "+" : ""}
            {netProfitLoss.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
