import { useCallback, useEffect, useMemo, useState } from "react";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
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

type CustomerT = {
  id: number;
  customerName: string;
};

type SaleReportT = {
  id: number;
  customerName: string;
  projectName: string;
  saleDate: string;
};

export const SalesReports = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const token = currentUser?.token;

  const [selectedValue] = useState(10);
  const [getCustomers, setGetCustomers] = useState<CustomerT[] | null>(null);
  const [reportData, setReportData] = useState({
    startDate: new Date().toLocaleDateString("sv-SE"),
    endDate: new Date().toLocaleDateString("sv-SE"),
    customerName: "",
  });
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [salesReports, setSalesReports] = useState<SaleReportT[]>([]);
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: new Date().toLocaleDateString("sv-SE"),
    endDate: new Date().toLocaleDateString("sv-SE"),
    customerName: "",
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
      customerName: reportData.customerName,
    });
    setPageNo(1); // Filter change hone par pehle page par jana behtar hai
  };

  const handleIncrementPageButton = () => setPageNo((p) => p + 1);
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
        res.data.map(
          (sale: {
            id: number;
            customerName: string;
            projectName: string;
            saleDate: string;
          }) => ({
            id: sale.id,
            customerName: sale.customerName,
            projectName: sale.projectName,
            saleDate: new Date(sale.saleDate).toLocaleDateString("sv-SE"),
          }),
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(navigationSuccess("SALE REPORTS"));
    }
  }, [dispatch, token]);

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
          <h2>Sales Report</h2>
        </div>
        <div class="date-range">
          <strong>From: ${reportData.startDate}</strong>
          <strong>To: ${reportData.endDate}</strong>
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
    handleGetALLCustomers();
    handleGetSalesReports();
    document.title = "(OMS) SALE REPORTS";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("SALE REPORTS")), 1000);
  }, [dispatch, handleGetALLCustomers, handleGetSalesReports]);

  const filteredReports = useMemo(() => {
    return salesReports
      .filter(
        (report) =>
          report.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          report.projectName.toLowerCase().includes(searchTerm.toLowerCase()),
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
  }, [salesReports, searchTerm, appliedFilters, getCustomers]);

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow  bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col  bg-white">

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
                labelName="Customer"
                name="customerName"
                value={reportData.customerName}
                optionData={getCustomers?.map((customer) => ({
                  id: customer.id,
                  label: customer.customerName,
                  value: customer.id,
                }))}
                inital="Please Select Customer"
                handlerChange={handleChange}
              />
            </div>

            {/* Buttons Container: Jab space kam hogi (1300px approx), 
        to ye automatic neeche wrap ho jayega aur full width le lega */}
            <div className="flex gap-2 flex-grow lg:flex-grow-0 min-w-full lg:min-w-fit">
              <button
                onClick={handleSearch}
                className="bg-indigo-900 text-white px-6 py-3 rounded-xl shadow flex-1 flex
                 items-center justify-center whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faSearch} className="mr-2" />
                Search
              </button>

              <button
                onClick={printDiv}
                className="bg-blue-900 text-white px-6 py-3 rounded-xl shadow flex-1 flex items-center 
                justify-center whitespace-nowrap"
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
              From: <span className="text-black">{reportData.startDate}</span>{" "}
              To: <span className="text-black">{reportData.endDate}</span>
            </div>

            <TableInputField
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto ">
          <div id="myDiv" className="min-w-[800px]">
            {/* Sticky Table Header */}
            <div className="grid grid-cols-4 bg-indigo-900 text-white items-center font-semibold text-sm sticky top-0 z-10 p-2">
              <span>Sr#</span>
              <span>Customer</span>
              <span>Project</span>
              <span>Date</span>
            </div>

            {/* Table Body */}
            {filteredReports.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10 border-x border-b border-gray-200">
                No records available at the moment!
              </div>
            ) : (
              filteredReports
                .slice((pageNo - 1) * selectedValue, pageNo * selectedValue)
                .map((report, index) => (
                  <div
                    key={report.id}
                    className="grid grid-cols-4 border-b border-x border-gray-200 text-gray-800 items-center
                   text-sm p-2 hover:bg-gray-50 transition"
                  >
                    <span>{(pageNo - 1) * selectedValue + index + 1}</span>
                    <span className="truncate">{report.customerName}</span>
                    <span className="truncate">{report.projectName}</span>
                    <span>{report.saleDate}</span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* --- PAGINATION SECTION --- */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={
              filteredReports.length === 0
                ? 0
                : (pageNo - 1) * selectedValue + 1
            }
            end={Math.min(pageNo * selectedValue, filteredReports.length)}
            total={filteredReports.length}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={handleDecrementPageButton}
            handleIncrementPageButton={handleIncrementPageButton}
          />
        </div>
      </div>
    </div>
  );
};
