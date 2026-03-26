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
import {
  faSearch,
  faPrint,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { RiInboxArchiveLine } from "react-icons/ri";
import { toast } from "react-toastify";

type CustomerT = {
  id: number;
  customerName: string;
  email: string;
};

type SaleReportT = {
  id: number;
  customerName: string;
  projectName: string;
  saleDate: string;
};

interface SalesReportsProps {
  externalSearch: string;
  externalPageSize: number;
}

export interface BusinessVarType {
  id: number;
  name: string;
  email: string;
  contact: string;
  logo?: string; // URL or base64 string
}

export const SalesReports = ({
  externalSearch,
  externalPageSize,
}: SalesReportsProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const token = currentUser?.token;

  const [getCustomers, setGetCustomers] = useState<CustomerT[] | null>(null);
  const [reportData, setReportData] = useState({
    startDate: new Date().toLocaleDateString("sv-SE"),
    endDate: new Date().toLocaleDateString("sv-SE"),
    customerName: "",
  });
  const [pageNo, setPageNo] = useState(1);
  const [salesReports, setSalesReports] = useState<SaleReportT[]>([]);
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: new Date().toLocaleDateString("sv-SE"),
    endDate: new Date().toLocaleDateString("sv-SE"),
    customerName: "",
  });
  const [businessVar, setBusinessVar] = useState<BusinessVarType | null>(null);

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
      customerName: reportData.customerName,
    });
    setPageNo(1);
  };

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(filteredReports.length / externalPageSize);
    if (pageNo < totalPages) setPageNo((p) => p + 1);
  };
  const handleDecrementPageButton = () => setPageNo((p) => Math.max(p - 1, 1));

  const handleGetALLCustomers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getAllCustomers`, {
        headers: { Authorization: token },
      });
      setGetCustomers(res.data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const handleGetSalesReports = useCallback(async () => {
    try {
      dispatch(navigationStart());
      const res = await axios.get(`${BASE_URL}/api/admin/getSales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalesReports(
        res.data.map((sale: SaleReportT) => ({
          id: sale.id,
          customerName: sale.customerName,
          projectName: sale.projectName,
          saleDate: new Date(sale.saleDate).toLocaleDateString("sv-SE"),
        })),
      );
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(navigationSuccess("SALE REPORTS"));
    }
  }, [dispatch, token]);

  const fetchBusinessVariable = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/business-variables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.length > 0) setBusinessVar(res.data[0]); // Assuming first is active/default
    } catch (err) {
      console.error("Failed to fetch business variable:", err);
    }
  }, [token]);

  useEffect(() => {
    handleGetALLCustomers();
    handleGetSalesReports();
    fetchBusinessVariable();
    document.title = "(OMS) SALE REPORTS";
  }, [handleGetALLCustomers, handleGetSalesReports, fetchBusinessVariable]);

  // Reset page on search/size change
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  const filteredReports = useMemo(() => {
    return salesReports
      .filter(
        (report) =>
          report.customerName
            .toLowerCase()
            .includes(externalSearch.toLowerCase()) ||
          report.projectName
            .toLowerCase()
            .includes(externalSearch.toLowerCase()),
      )
      .filter((report) =>
        appliedFilters.customerName
          ? report.customerName ===
            getCustomers?.find(
              (c) => c.id.toString() === appliedFilters.customerName,
            )?.customerName
          : true,
      )
      .filter(
        (report) =>
          report.saleDate >= appliedFilters.startDate &&
          report.saleDate <= appliedFilters.endDate,
      );
  }, [salesReports, externalSearch, appliedFilters, getCustomers]);

  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + externalPageSize,
  );

  const printDiv = () => {
    const printStyles = `
    @page { size: A4 portrait; margin: 10mm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; }
    .print-header { text-align: center; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #333; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; font-weight: bold; }
  `;

    const tableRows = filteredReports
      .map(
        (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.customerName}</td>
        <td>${item.projectName}</td>
        <td>${item.saleDate}</td>
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
      ? `<img src="${logoUrl}" style="max-height:120px; margin-bottom:15px;" />`
      : "";

    printWindow?.document.write(`
    <html>
      <head>
        <title>Sale Report</title>
        <style>${printStyles}</style>
      </head>
      <body>
        <div class="print-header">
          ${logoHtml}
          <h2>${businessVar?.name ?? "Office Management System"}</h2>
          <p>${businessVar?.email ?? ""} | ${businessVar?.contact ?? ""}</p>

          <h3>Sales Report</h3>

          <p>
            <strong>From:</strong> ${appliedFilters.startDate}
            <strong>To:</strong> ${appliedFilters.endDate}
          </p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Sr#</th>
              <th>Customer Name</th>
              <th>Project Title</th>
              <th>Sale Date</th>
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
      {/* 1. Filters Section */}
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
              labelName="Customer"
              name="customerName"
              value={reportData.customerName}
              optionData={getCustomers?.map((c) => ({
                id: c.id,
                label: c.customerName,
                value: c.id,
              }))}
              inital="Please Select Customer"
              handlerChange={handleChange}
            />
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <button
              onClick={handleSearch}
              className="bg-slate-700 text-white px-6 py-3 rounded-lg shadow-sm flex-1 flex items-center justify-center font-bold text-sm transition-hover "
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" /> Search
            </button>

            <button
              onClick={printDiv}
              className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-sm flex-1 flex items-center justify-center font-bold text-sm transition-hover "
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2" /> Print
            </button>

            {/* ✅ NEW: Email Report Button */}

            <button
              onClick={async () => {
                try {
                  const selectedCustomer = getCustomers?.find(
                    (c) => c.id.toString() === reportData.customerName,
                  );

                  const targetEmail = selectedCustomer?.email;

                  console.log("Sending email to:", targetEmail);

                  await axios.post(
                    `${BASE_URL}/api/admin/send-report`,
                    {
                      email: targetEmail,
                      reportData: filteredReports,
                      business: businessVar,
                    },
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    },
                  );

                  toast.success("Report emailed successfully", {
                    toastId: "email-report-success",
                  });
                } catch (err) {
                  console.error(err);

                  toast.error("Failed to send report. Please try again.", {
                    toastId: "email-report-error",
                  });
                }
              }}
              disabled={filteredReports.length === 0}
              className={`bg-blue-800 text-white px-6  py-3 whitespace-nowrap rounded-lg shadow-sm flex-1 flex items-center justify-center 
    font-bold text-sm transition-hover
    `}
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Email Report
            </button>
          </div>
        </div>
      </div>

      {/* 2. Table Section */}
      <div className="overflow-auto px-3 sm:px-0 mt-4">
        <div className="min-w-[1000px]">
          {/* Header Row - Aligned with UsersDetails grid logic */}
          <div className="px-0.5 pt-0.5">
            <div className="grid grid-cols-[60px_1.5fr_1.5fr_1fr] bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm">
              <span className="text-left">Sr#</span>
              <span className="text-left">Customer Name</span>
              <span className="text-left">Project Title</span>
              <span className="text-right pr-8">Sale Date</span>
            </div>
          </div>

          {/* Body Rows */}
          <div id="saleDiv" className="px-0.5 sm:px-1 py-2">
            {paginatedReports.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No sales records found!</p>
                <p className="text-sm">
                  Try adjusting your date range or search terms.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedReports.map((report, index) => (
                  <div
                    key={report.id}
                    className="grid grid-cols-[60px_1.5fr_1.5fr_1fr] items-center px-3 py-2 gap-3 text-sm bg-white border 
                    border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Customer Name - Removed Icon/Avatar container to match clean text style */}
                    <div className="truncate text-gray-800">
                      {report.customerName}
                    </div>

                    {/* Project Title - Removed Icon */}
                    <div className="text-gray-600 truncate">
                      {report.projectName}
                    </div>

                    {/* Sale Date - Removed Icon, Kept Right Aligned */}
                    <div className="text-gray-600 text-right pr-4">
                      {report.saleDate}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Pagination Section */}
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
