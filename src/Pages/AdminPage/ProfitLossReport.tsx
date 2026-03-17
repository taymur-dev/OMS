import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { InputField } from "../../Components/InputFields/InputField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";

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
    const printStyles = `
    @page { size: A4 portrait; margin: 10mm; }
    body { font-family: Arial, sans-serif; font-size: 12pt; color: #333; }
    
    /* Updated centering styles */
    .print-header { 
      text-align: center; 
      margin-bottom: 20px; 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
    }
    
    .logo-container {
      width: 100%;
      text-align: center;
      margin-bottom: 10px;
    }

    .report-section { margin-bottom: 20px; border: 1px solid #ccc; border-radius: 8px; padding: 15px; }
    .section-title { font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 6px; margin-bottom: 10px; }
    .row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dashed #ddd; }
    .row:last-child { border-bottom: none; }
    .total { font-weight: bold; margin-top: 10px; border-top: 2px solid #000; padding-top: 5px; }
    .green { color: green; }
    .red { color: red; }
  `;

    // Add print styles
    const styleEl = document.createElement("style");
    styleEl.innerHTML = printStyles;
    document.head.appendChild(styleEl);

    // Print only the report container
    const reportElement = document.getElementById("printableReport");
    if (reportElement) {
      const originalContent = document.body.innerHTML;

      const logoUrl = businessVar?.logo
        ? businessVar.logo.startsWith("http")
          ? businessVar.logo
          : `${BASE_URL}/${businessVar.logo}`
        : "";

      const logoHtml = logoUrl
      ? `<div class="logo-container"><img src="${logoUrl}" style="max-height:100px; display: inline-block;" /></div>`
      : "";

    const headerHTML = `
      <div class="print-header">
        ${logoHtml}
        <h2 style="margin: 5px 0;">${businessVar?.name || "Business Name"}</h2>
        <p style="margin: 2px 0;">${businessVar?.email || ""} | ${businessVar?.contact || ""}</p>
        <h1 style="margin: 10px 0 5px 0;">Profit & Loss Report</h1>
        <p style="margin: 0;">
          <strong>From:</strong> ${appliedFilters.startDate} 
          <strong>To:</strong> ${appliedFilters.endDate}
        </p>
      </div>
    `;

      document.body.innerHTML = headerHTML + reportElement.outerHTML;
      window.print();

      // Restore original content
      document.body.innerHTML = originalContent;
      document.head.removeChild(styleEl);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-gray-50 min-h-screen">
      {/* FILTER SECTION */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
            <InputField
              labelName="From Date"
              type="date"
              name="startDate"
              value={reportData.startDate}
              handlerChange={handleChange}
            />
            <InputField
              labelName="To Date"
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
      <div id="printableReport" className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* INCOME CARD */}
          <div className="bg-white rounded-lg shadow border">
            <div className="bg-gray-100 px-4 py-3 font-semibold">💰 INCOME</div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sales Amount</span>
                <span className="font-semibold text-gray-600">
                  {incomeData.sTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Employee Receivables</span>
                <span className="font-semibold text-gray-600">
                  {incomeData.rTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Customer Receivables</span>
                <span className="font-semibold text-gray-600">
                  {incomeData.cTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Supplier Receivables</span>
                <span className="font-semibold text-gray-600">
                  {incomeData.suppRecTotal.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="border-t px-4 py-3 flex justify-between font-bold">
              <span>Total Income</span>
              <span className="text-green-600">
                {incomeData.grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* EXPENSE CARD */}
          <div className="bg-white rounded-lg shadow border">
            <div className="bg-gray-100 px-4 py-3 font-semibold">
              💸 EXPENSES
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>General Expenses</span>
                <span className="font-semibold text-gray-600">
                  {expenseData.eTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Employee Payables</span>
                <span className="font-semibold text-gray-600">
                  {expenseData.pTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Customer Payables</span>
                <span className="font-semibold text-gray-600">
                  {expenseData.cpTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Supplier Payables</span>
                <span className="font-semibold text-gray-600">
                  {expenseData.suppPayTotal.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="border-t px-4 py-3 flex justify-between font-bold">
              <span>Total Expenses</span>
              <span className="text-red-600">
                {expenseData.grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-white border rounded-lg shadow px-6 py-4 flex justify-between text-lg font-bold">
          <span>Net {netProfitLoss >= 0 ? "Profit" : "Loss"}</span>
          <span
            className={netProfitLoss >= 0 ? "text-green-600" : "text-red-600"}
          >
            {netProfitLoss > 0
              ? `+${netProfitLoss.toLocaleString()}`
              : netProfitLoss.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
