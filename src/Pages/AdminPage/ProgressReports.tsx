import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
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
import { BASE_URL } from "../../Content/URL";

const itemsPerPageOptions = [10, 25, 50];

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

  const currentDate = new Date().toISOString().split("T")[0];

  const [reportData, setReportData] = useState({
    startDate: currentDate,
    endDate: currentDate,
    employeeId: "",
  });

  const [allProgress, setAllProgress] = useState<ALLPROGRESST[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const getProgressReport = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
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
      setAllProgress([]);
    }
  }, [token, currentUser]);

  const employeeOptions = useMemo(() => {
    const map = new Map<number, string>();
    allProgress.forEach((p) => map.set(p.employee_id, p.employeeName));

    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      label: name,
      value: id,
    }));
  }, [allProgress]);

  const filteredProgress = allProgress.filter((item) => {
    const itemDate = item.date.slice(0, 10);

    const inDateRange =
      itemDate >= reportData.startDate && itemDate <= reportData.endDate;

    const matchesEmployee = reportData.employeeId
      ? item.employee_id === Number(reportData.employeeId)
      : true;

    const matchesSearch =
      item.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.note?.toLowerCase().includes(searchTerm.toLowerCase());

    return inDateRange && matchesEmployee && matchesSearch;
  });

  const totalItems = filteredProgress.length;
  const startIndex = (pageNo - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedData = filteredProgress.slice(startIndex, endIndex);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
    setPageNo(1);
  };

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
          <h2>Progress Report</h2>
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
    document.title = "(OMS) PROGRESS REPORTS";
    dispatch(navigationStart());
    getProgressReport();

    setTimeout(() => {
      dispatch(navigationSuccess("PROGRESS REPORTS"));
    }, 800);
  }, [dispatch, getProgressReport]);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Progress Report" activeFile="Progress Report" />

      <div className="flex items-center justify-between text-gray-800 py-2 mx-2">
        <div>
          <span>Show</span>
          <span className="bg-gray-200 rounded mx-1 p-1">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setPageNo(1);
              }}
            >
              {itemsPerPageOptions.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </span>
          <span>entries</span>
        </div>

        <TableInputField
          searchTerm={searchTerm}
          setSearchTerm={(term) => {
            setSearchTerm(term);
            setPageNo(1);
          }}
        />
      </div>

      {/* Card */}
      <div
        className="max-h-[58vh] h-full shadow-lg border-t-2 rounded 
      border-indigo-500 bg-white overflow-hidden flex flex-col"
      >
        {/* Filters */}
        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div className="flex flex-1 py-1 gap-1 items-center justify-center">
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

            {currentUser?.role === "admin" && (
              <OptionField
                labelName="Employee"
                name="employeeId"
                value={reportData.employeeId}
                optionData={employeeOptions}
                inital="Select Employee"
                handlerChange={handleChange}
              />
            )}

            {/* Date Preview (right aligned like SalesReports) */}
            <div className="w-full flex justify-end mt-4">
              <div className="text-gray-800 flex items-center py-2 font-semibold">
                <span className="mr-1">From</span>
                <span className="text-red-500 mr-1">
                  {reportData.startDate}
                </span>
                <span className="mr-1">To</span>
                <span className="text-red-500">{reportData.endDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          id="myDiv"
          className="w-full max-h-[28.4rem] overflow-y-auto mx-auto"
        >
          <div
            className="grid grid-cols-4 bg-gray-200 text-gray-900 font-semibold 
          border border-gray-600 text-sm sticky top-0 z-10 p-[7px]"
          >
            <span>Sr#</span>
            <span>Employee</span>
            <span>Project</span>
            <span>Progress</span>
          </div>

          {paginatedData.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-4 border border-gray-600 
            text-gray-800 hover:bg-gray-100 transition duration-200 
            text-sm items-center justify-center p-[5px]"
            >
              <span>{startIndex + index + 1}</span>
              <span>{item.employeeName}</span>
              <span>{item.projectName}</span>
              <span className="break-words">{item.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <ShowDataNumber
          start={startIndex + 1}
          end={Math.min(endIndex, totalItems)}
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

      {/* Download */}
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={printDiv}
          className="bg-green-500 text-white py-2 px-4 rounded 
        font-semibold hover:cursor-pointer"
        >
          Download
        </button>
      </div>
    </div>
  );
};
