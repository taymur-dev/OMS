import { useCallback, useEffect, useMemo, useState } from "react";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { InputField } from "../../Components/InputFields/InputField";
import { OptionField } from "../../Components/InputFields/OptionField";
import { Loader } from "../../Components/LoaderComponent/Loader";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";
import { RiInboxArchiveLine } from "react-icons/ri";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

type AccountReportT = {
  id: number;
  account_type: string;
  name: string;
  refNo: string;
  invoiceNo: string;
  debit: number;
  credit: number;
  paymentMethod: string;
  paymentDate: string;
};

type UserType = {
  id: number;
  name: string;
  email: string;
  contact: string;
  cnic: string;
  address: string;
  date: string;
  password: string;
  confirmPassword: string;
  role: string;
  loginStatus: string;
  image?: string; // Add image field
};

type AllcustomerT = {
  id: number;
  customerStatus: string;
  customerName: string;
  customerAddress: string;
  customerContact: string;
  email: string;
  companyName: string;
  companyAddress: string;
};

interface Supplier {
  supplierId: number;
  supplierName: string;
  supplierEmail: string;
  supplierContact: string;
  supplierAddress: string;
}

interface AccountReportProps {
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

export const AccountReport = ({
  externalSearch,
  externalPageSize,
}: AccountReportProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const token = currentUser?.token;

  const [reportData, setReportData] = useState({
    startDate: new Date().toLocaleDateString("sv-SE"),
    endDate: new Date().toLocaleDateString("sv-SE"),
    accountType: "",
    selectedName: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: new Date().toLocaleDateString("sv-SE"),
    endDate: new Date().toLocaleDateString("sv-SE"),
    accountType: "",
    selectedName: "",
  });

  const [businessVar, setBusinessVar] = useState<BusinessVarType | null>(null);

  const [accounts, setAccounts] = useState<AccountReportT[]>([]);
  const [pageNo, setPageNo] = useState(1);

  const dynamicNames = useMemo(() => {
    if (!reportData.accountType) return [];

    const filtered = accounts.filter(
      (acc) => acc.account_type === reportData.accountType,
    );

    const uniqueNames = Array.from(
      new Set(filtered.map((acc) => acc.name).filter(Boolean)),
    );

    return uniqueNames.map((name, index) => ({
      id: index,
      label: name,
      value: name,
    }));
  }, [accounts, reportData.accountType]);

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
      accountType: reportData.accountType,
      selectedName: reportData.selectedName,
    });
    setPageNo(1);
  };

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(filteredReports.length / externalPageSize);
    if (pageNo < totalPages) setPageNo((p) => p + 1);
  };

  const handleDecrementPageButton = () => setPageNo((p) => Math.max(p - 1, 1));

  const handleGetAccounts = useCallback(async () => {
    try {
      dispatch(navigationStart());

      const res = await axios.get(`${BASE_URL}/api/admin/getAccountReport`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAccounts(
        res.data.report.map((acc: AccountReportT) => ({
          ...acc,
          name: acc.name ?? "",
          invoiceNo: acc.invoiceNo ?? "",
          paymentDate: new Date(acc.paymentDate).toLocaleDateString("sv-SE"),
        })),
      );
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(navigationSuccess("ACCOUNT REPORT"));
    }
  }, [dispatch, token]);

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

  useEffect(() => {
    handleGetAccounts();
    document.title = "(OMS) ACCOUNT REPORT";
    fetchBusinessVariable();
  }, [handleGetAccounts, fetchBusinessVariable]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  const filteredReports = useMemo(() => {
    return (
      accounts
        .filter(
          (acc) =>
            (acc.name ?? "")
              .toLowerCase()
              .includes(externalSearch.toLowerCase()) ||
            (acc.refNo ?? "")
              .toLowerCase()
              .includes(externalSearch.toLowerCase()) ||
            (acc.invoiceNo ?? "")
              .toLowerCase()
              .includes(externalSearch.toLowerCase()),
        )
        .filter((acc) =>
          appliedFilters.accountType
            ? acc.account_type === appliedFilters.accountType
            : true,
        )
        // Naya filter: Agar name select hai to sirf uska data dikhao
        .filter((acc) =>
          appliedFilters.selectedName
            ? acc.name === appliedFilters.selectedName
            : true,
        )
        .filter(
          (acc) =>
            acc.paymentDate >= appliedFilters.startDate &&
            acc.paymentDate <= appliedFilters.endDate,
        )
    );
  }, [accounts, externalSearch, appliedFilters]);

  const startIndex = (pageNo - 1) * externalPageSize;

  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + externalPageSize,
  );

  const printDiv = () => {

    if (filteredReports.length === 0) {
    toast.error("Report is empty. Nothing to print!", {
      toastId: "empty-report-print",
    });
    return;
  }

    const printStyles = `
    @page { size: A4 portrait; margin: 10mm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; color: #333; }
    .print-header { text-align: center; margin-bottom: 10px; }
    
    .business-info { line-height: 1.2; margin-bottom: 10px; color: #555; font-size: 9pt; }
    .info-item { display: inline-flex; align-items: center; margin: 0 10px; }
    .info-icon { width: 12px; height: 12px; margin-right: 5px; fill: #666; vertical-align: middle; }
    
    .report-meta { text-align: left; margin-bottom: 5px; font-size: 9pt; }
    table { width: 100%; border-collapse: collapse; margin-top: 5px; }
    th, td { border: 1px solid #333; padding: 4px 8px; text-align: left; }
    th { background-color: #f2f2f2; font-weight: bold; }
    
    .debit { color: green; font-weight: bold; }
    .credit { color: red; font-weight: bold; }
  `;

    const tableRows = filteredReports
      .map(
        (acc, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${acc.account_type}</td>
      <td>${acc.name}</td>
      <td>${acc.invoiceNo}</td>
      <td>${acc.refNo}</td>
      <td class="debit">${acc.debit}</td>
      <td class="credit">${acc.credit}</td>
      <td>${acc.paymentMethod}</td>
      <td>${acc.paymentDate}</td>
    </tr>
  `,
      )
      .join("");

    const printWindow = window.open("", "_blank");

    // SVG Icons from Sales Report
    const addressIcon = `<svg class="info-icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>`;
    const phoneIcon = `<svg class="info-icon" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`;

    printWindow?.document.write(`
    <html>
      <head>
        <title>Account Report</title>
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
          <h3 style="margin: 0;">Account Report</h3>
        </div>

        <div class="report-meta" style="margin-top: 10px; font-size: 13px;">
          <strong>From:</strong> ${appliedFilters.startDate} &nbsp;&nbsp;
          <strong>To:</strong> ${appliedFilters.endDate}
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px;">Sr#</th>
              <th>Type</th>
              <th>Name</th>
              <th>Invoice</th>
              <th>RefNo</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Method</th>
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
  const handleEmailReport = async () => {
    try {
      if (!filteredReports.length) {
        toast.error("No data available to send");
        return;
      }

      if (!appliedFilters.accountType) {
        toast.error("Please select account type");
        return;
      }

      if (!appliedFilters.selectedName) {
        toast.error(`Please select ${appliedFilters.accountType}`);
        return;
      }

      // ✅ Get Email based on Account Type
      let emailToSend = "";

      if (appliedFilters.accountType === "Employee") {
        const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
          headers: { Authorization: token },
        });

        const user = res.data.users.find(
          (u: UserType) => u.name === appliedFilters.selectedName,
        );

        emailToSend = user?.email || "";
      }

      if (appliedFilters.accountType === "Customer") {
        const res = await axios.get(`${BASE_URL}/api/admin/getAllCustomers`, {
          headers: { Authorization: token },
        });

        const customer = res.data.find(
          (c: AllcustomerT) => c.customerName === appliedFilters.selectedName,
        );

        emailToSend = customer?.email || "";
      }

      if (appliedFilters.accountType === "Supplier") {
        const res = await axios.get(`${BASE_URL}/api/admin/getSuppliers`, {
          headers: { Authorization: token },
        });

        const supplier = res.data.data.find(
          (s: Supplier) => s.supplierName === appliedFilters.selectedName,
        );

        emailToSend = supplier?.supplierEmail || "";
      }

      if (!emailToSend) {
        toast.error("No email found for selected account");
        return;
      }

      // ✅ Columns for PDF
      const columns = [
        { label: "Sr#", key: "__index" },
        { label: "Type", key: "account_type" },
        { label: "Name", key: "name" },
        { label: "Invoice", key: "invoiceNo" },
        { label: "RefNo", key: "refNo" },
        { label: "Debit", key: "debit" },
        { label: "Credit", key: "credit" },
        { label: "Method", key: "paymentMethod" },
        { label: "Date", key: "paymentDate" },
      ];

      await axios.post(
        `${BASE_URL}/api/admin/send-report`,
        {
          email: emailToSend,
          reportData: filteredReports,
          business: businessVar,
          columns,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(`${appliedFilters.accountType} report sent successfully`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send report");
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      {/* Filters */}
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
              labelName="Account Type"
              name="accountType"
              value={reportData.accountType}
              optionData={[
                { id: 1, label: "Employee", value: "Employee" },
                { id: 2, label: "Customer", value: "Customer" },
                { id: 3, label: "Supplier", value: "Supplier" },
              ]}
              inital="All Accounts"
              handlerChange={(e) => {
                handleChange(e);
                // Reset selected name when account type changes
                setReportData((prev) => ({ ...prev, selectedName: "" }));
              }}
            />

            {reportData.accountType && (
              <OptionField
                labelName={`Select ${reportData.accountType}`}
                name="selectedName"
                value={reportData.selectedName}
                optionData={dynamicNames}
                inital={`All ${reportData.accountType}s`}
                handlerChange={handleChange}
              />
            )}
          </div>

          <div className="flex gap-2 w-full lg:w-auto">
            <button
              onClick={handleSearch}
              className="bg-[#334155] text-white px-6 py-3 rounded-lg shadow-sm flex-1 flex items-center 
              justify-center font-bold text-sm"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Search
            </button>

            <button
              onClick={printDiv}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-sm flex-1 flex items-center 
              justify-center font-bold text-sm"
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2" />
              Print
            </button>

            <button
              onClick={handleEmailReport}
              disabled={filteredReports.length === 0}
              className="bg-blue-800 text-white px-6 py-3 rounded-lg shadow-sm flex-1 flex items-center 
  justify-center font-bold text-sm"
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Email
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto px-3 sm:px-0 mt-4">
        <div className="min-w-[1200px]">
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[60px_1fr_1.5fr_1fr_1fr__1fr_1fr_1fr_1fr] bg-blue-400 text-white rounded-lg 
            items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span>Sr#</span>
              <span>Type</span>
              <span>Name</span>
              <span>Invoice</span>
              <span>RefNo</span>
              <span>Debit</span>
              <span>Credit</span>
              <span>Method</span>
              <span className="text-right pr-6">Date</span>
            </div>
          </div>

          <div id="myDiv" className="px-0.5 sm:px-1 py-2">
            {paginatedReports.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No account records found!</p>
                <p className="text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedReports.map((acc, index) => (
                  <div
                    key={acc.id}
                    className="grid grid-cols-[60px_1fr_1.5fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center px-3 py-2 gap-3 
                    text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 shadow-sm"
                  >
                    <span className="text-gray-500">
                      {startIndex + index + 1}
                    </span>

                    <span className="font-medium text-gray-700">
                      {acc.account_type}
                    </span>

                    <span className="text-gray-800">{acc.name}</span>

                    <span className="text-gray-800">{acc.invoiceNo}</span>

                    <span className="text-gray-800">{acc.refNo}</span>

                    <span className="text-green-600 font-medium">
                      {acc.debit}
                    </span>

                    <span className="text-red-600 font-medium">
                      {acc.credit}
                    </span>

                    <span className="text-gray-600">{acc.paymentMethod}</span>

                    <span className="text-right pr-4 text-gray-600">
                      {acc.paymentDate}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-auto flex flex-row items-center justify-between p-3 border-t border-gray-100">
        <ShowDataNumber
          start={filteredReports.length === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + externalPageSize, filteredReports.length)}
          total={filteredReports.length}
        />

        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>
    </div>
  );
};
