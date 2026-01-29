import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { InputField } from "../../Components/InputFields/InputField";
import { OptionField } from "../../Components/InputFields/OptionField";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { Footer } from "../../Components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { BASE_URL } from "../../Content/URL";

export type ALLPROGRESST = {
  id: number;
  employee_id: number;
  employeeName: string;
  projectId: number;
  projectName: string;
  date: string;
  note: string;
};

export const ProgressReports = () => {
  const dispatch = useAppDispatch();
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const currentDate = new Date().toLocaleDateString("sv-SE");

  // Input states
  const [reportData, setReportData] = useState({
    startDate: currentDate,
    endDate: currentDate,
    employeeId: "",
  });

  // Filter states (applied only on Search click)
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: currentDate,
    endDate: currentDate,
    employeeId: "",
  });

  const [allProgress, setAllProgress] = useState<ALLPROGRESST[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const getProgressReport = useCallback(async () => {
    if (!token || !currentUser) return;
    try {
      dispatch(navigationStart());
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getProgress`
          : `${BASE_URL}/api/user/getMyProgress`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllProgress(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to load progress report", error);
    } finally {
      dispatch(navigationSuccess("PROGRESS REPORTS"));
    }
  }, [token, currentUser, dispatch]);

  useEffect(() => {
    document.title = "(OMS) PROGRESS REPORTS";
    getProgressReport();
  }, [getProgressReport]);

  const employeeOptions = useMemo(() => {
    const map = new Map<number, string>();
    allProgress.forEach((p) => map.set(p.employee_id, p.employeeName));
    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      label: name,
      value: id,
    }));
  }, [allProgress]);

  const handleSearch = () => {
    setAppliedFilters({
      startDate: reportData.startDate,
      endDate: reportData.endDate,
      employeeId: reportData.employeeId,
    });
    setPageNo(1);
  };

  const filteredProgress = useMemo(() => {
    return allProgress.filter((item) => {
      const itemDate = item.date.slice(0, 10);
      const inDateRange =
        itemDate >= appliedFilters.startDate &&
        itemDate <= appliedFilters.endDate;

      const matchesEmployee = appliedFilters.employeeId
        ? item.employee_id === Number(appliedFilters.employeeId)
        : true;

      const matchesSearch =
        item.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.note?.toLowerCase().includes(searchTerm.toLowerCase());

      return inDateRange && matchesEmployee && matchesSearch;
    });
  }, [allProgress, appliedFilters, searchTerm]);

  const totalItems = filteredProgress.length;
  const startIndex = (pageNo - 1) * itemsPerPage;
  const paginatedData = filteredProgress.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

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
    document.body.innerHTML = `
      <div class="print-container">
        <div class="print-header">
          <h1>Office Management System</h1>
          <h2>Progress Report</h2>
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

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        <TableTitle tileName="Progress Report" />

        <hr className="border border-b border-gray-200" />

        {/* --- FILTER SECTION (Aligned with Sales Report) --- */}
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

            {/* Buttons Container: Wraps automatically like Sales Report */}
            <div className="flex gap-2 flex-grow lg:flex-grow-0 min-w-full lg:min-w-fit">
              <button
                onClick={handleSearch}
                className="bg-indigo-900 text-white px-6 py-3 rounded-xl shadow flex-1 flex items-center justify-center whitespace-nowrap hover:bg-indigo-800 transition"
              >
                <FontAwesomeIcon icon={faSearch} className="mr-2" />
                Search
              </button>

              <button
                onClick={printDiv}
                className="bg-blue-900 text-white px-6 py-3 rounded-xl shadow flex-1 flex items-center justify-center whitespace-nowrap hover:bg-blue-800 transition"
              >
                <FontAwesomeIcon icon={faPrint} className="mr-2" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* --- SUB-HEADER SECTION --- */}
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
            {/* Sticky Table Header */}
            <div className="grid grid-cols-4 bg-indigo-900 text-white items-center font-semibold text-sm sticky top-0 z-10 p-2">
              <span>Sr#</span>
              {currentUser?.role === "admin" && <span>Employee</span>}
              <span>Project</span>
              <span>Progress Note</span>
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
                  className="grid grid-cols-4 border-b border-x border-gray-200 text-gray-800 items-center text-sm p-2 hover:bg-gray-50 transition break-words"
                >
                  <span>{startIndex + index + 1}</span>
                  {currentUser?.role === "admin" && (
                    <span className="truncate">{item.employeeName}</span>
                  )}
                  <span className="truncate pr-2">{item.projectName}</span>
                  <span className="whitespace-pre-wrap">{item.note}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- PAGINATION SECTION --- */}
        <div className="flex flex-row items-center justify-between p-2">
          <ShowDataNumber
            start={totalItems === 0 ? 0 : startIndex + 1}
            end={Math.min(startIndex + itemsPerPage, totalItems)}
            total={totalItems}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={() =>
              setPageNo((p) => Math.max(p - 1, 1))
            }
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
