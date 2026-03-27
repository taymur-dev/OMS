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

interface AccountReportProps {
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
    const printStyles = `
    @page { size: A4 landscape; margin: 10mm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; }
    .print-header { text-align: center; margin-bottom: 20px; }

    table { width: 100%; border-collapse: collapse; margin-top: 10px; }

    th, td {
      border: 1px solid #333;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }

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
        <title>Account Report</title>
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
