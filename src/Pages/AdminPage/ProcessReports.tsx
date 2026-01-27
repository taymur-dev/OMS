import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";

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
import { BASE_URL } from "../../Content/URL";

export type PROCESST = {
  id: number;
  employee_id: number;
  employeeName: string;
  task: string;
  startDate: string;
  endDate: string;
  deadline: string;
};

export const ProcessReports = () => {
  const dispatch = useAppDispatch();
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  
  const token = currentUser?.token;
  const userId = currentUser?.userId;
  const itemsPerPage = 10; // Fixed as per SalesReports style

  const currentDate = new Date().toLocaleDateString("sv-SE");

  // State for form inputs
  const [reportData, setReportData] = useState({
    startDate: currentDate,
    endDate: currentDate,
    employeeId: "",
  });

  // State for filters actually applied to the table
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: currentDate,
    endDate: currentDate,
    employeeId: "",
  });

  const [allTasks, setAllTasks] = useState<PROCESST[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const getProcessReports = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
      dispatch(navigationStart());
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getTodos`
          : `${BASE_URL}/api/user/getTodo/${userId}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllTasks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to load process report", error);
      setAllTasks([]);
    } finally {
      dispatch(navigationSuccess("PROCESS REPORTS"));
    }
  }, [token, currentUser, userId, dispatch]);

  const handleSearch = () => {
    setAppliedFilters({
      startDate: reportData.startDate,
      endDate: reportData.endDate,
      employeeId: reportData.employeeId,
    });
    setPageNo(1);
  };

  const filteredTasks = useMemo(() => {
    return allTasks
      .filter((item) => {
        const start = item.startDate.slice(0, 10);
        const inDateRange =
          start >= appliedFilters.startDate && start <= appliedFilters.endDate;

        const matchesEmployee =
          !appliedFilters.employeeId ||
          item.employee_id === Number(appliedFilters.employeeId);

        return inDateRange && matchesEmployee;
      })
      .filter((item) => {
        return (
          item.task?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
  }, [allTasks, appliedFilters, searchTerm]);

  const totalItems = filteredTasks.length;
  const paginatedData = useMemo(() => {
    return filteredTasks.slice((pageNo - 1) * itemsPerPage, pageNo * itemsPerPage);
  }, [filteredTasks, pageNo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const employeeOptions = useMemo(() => {
    const map = new Map<number, string>();
    allTasks.forEach((t) => map.set(t.employee_id, t.employeeName));
    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      label: name,
      value: id,
    }));
  }, [allTasks]);

  const printDiv = () => {
    const printStyles = `
      @page { size: A4 portrait; }
      body { font-family: Arial, sans-serif; font-size: 11pt; color: #000; }
      .print-container { width: 100%; padding: 0; }
      .print-header { text-align: center; }
      .print-header h1 { font-size: 25pt; font-weight: bold; }
      .print-header h2 { font-size: 20pt; font-weight: normal; }
      .date-range { text-align: left; font-size: 14pt; display: flex; justify-content: space-between; margin-bottom: 10px; }
      table { width: 100%; border-collapse: collapse; border: 2px solid #000; }
      thead { background-color: #ccc; color: #000; }
      thead th, tbody td { border: 2px solid #000; font-size: 10pt; text-align: left; padding: 5px; }
      tbody tr:nth-child(even) { background-color: #f9f9f9; }
      @media print { .no-print { display: none; } }
    `;
    const content = document.getElementById("myDiv")?.outerHTML || "";
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Task Report</title>
            <style>${printStyles}</style>
          </head>
          <body>
            <div class="print-container">
              <div class="print-header">
                <h1>Office Management System</h1>
                <h2>Task Report</h2>
              </div>
              <div class="date-range">
                <strong>From: ${appliedFilters.startDate}</strong>
                <strong>To: ${appliedFilters.endDate}</strong>
              </div>
              ${content}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  useEffect(() => {
    document.title = "(OMS) PROCESS REPORTS";
    getProcessReports();
  }, [getProcessReports]);

  if (loader) return <Loader />;

  return (
  <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray-100 overflow-hidden">
    <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
      <TableTitle tileName="Task Report" />

      <hr className="border border-b border-gray-200" />

      {/* --- FILTER SECTION (Updated to match Sales Report dimensions) --- */}
      <div className="p-2 bg-white">
        <div className="flex flex-wrap items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow min-w-[300px]">
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
            {currentUser?.role === "admin" ? (
              <OptionField
                labelName="Employee"
                name="employeeId"
                value={reportData.employeeId}
                optionData={employeeOptions}
                inital="Select Employee"
                handlerChange={handleChange}
              />
            ) : (
              <div className="hidden sm:block"></div>
            )}
          </div>

          {/* Buttons Container: Wraps and goes full width on smaller screens */}
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
            From: <span className="text-black">{appliedFilters.startDate}</span>{" "}
            To: <span className="text-black">{appliedFilters.endDate}</span>
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
          {/* Sticky Table Header */}
          <div className="grid grid-cols-6 bg-indigo-900 text-white items-center font-semibold text-sm sticky top-0 z-10 p-2">
            <span>Sr#</span>
            <span>Employee</span>
            <span>Task</span>
            <span>Start</span>
            <span>End</span>
            <span>Deadline</span>
          </div>

          {/* Table Body */}
          {paginatedData.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-10 border-x border-b border-gray-200">
              No records available at the moment!
            </div>
          ) : (
            paginatedData.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-6 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
              >
                <span>{(pageNo - 1) * itemsPerPage + index + 1}</span>
                <span className="truncate">{item.employeeName}</span>
                <span className="truncate">{item.task}</span>
                <span>{item.startDate.slice(0, 10)}</span>
                <span>{item.endDate.slice(0, 10)}</span>
                <span>{item.deadline?.slice(0, 10)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- PAGINATION SECTION --- */}
      <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
        <ShowDataNumber
          start={totalItems === 0 ? 0 : (pageNo - 1) * itemsPerPage + 1}
          end={Math.min(pageNo * itemsPerPage, totalItems)}
          total={totalItems}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() =>
            pageNo * itemsPerPage < totalItems && setPageNo((p) => p + 1)
          }
        />
      </div>
    </div>

    <div className="border border-t-5 border-gray-200">
      <Footer />
    </div>
  </div>
);
};