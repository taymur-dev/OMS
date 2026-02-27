import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { InputField } from "../../Components/InputFields/InputField";
import { OptionField } from "../../Components/InputFields/OptionField";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";
import { RiInboxArchiveLine } from "react-icons/ri";

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

interface ProgressReportsProps {
  externalSearch: string;
  externalPageSize: number;
}

export const ProgressReports = ({
  externalSearch,
  externalPageSize,
}: ProgressReportsProps) => {
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

  // Filter states
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: currentDate,
    endDate: currentDate,
    employeeId: "",
  });

  const [allProgress, setAllProgress] = useState<ALLPROGRESST[]>([]);
  const [pageNo, setPageNo] = useState(1);

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

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

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
        item.employeeName
          ?.toLowerCase()
          .includes(externalSearch.toLowerCase()) ||
        item.projectName
          ?.toLowerCase()
          .includes(externalSearch.toLowerCase()) ||
        item.note?.toLowerCase().includes(externalSearch.toLowerCase());

      return inDateRange && matchesEmployee && matchesSearch;
    });
  }, [allProgress, appliedFilters, externalSearch]);

  const totalItems = filteredProgress.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedData = filteredProgress.slice(
    startIndex,
    startIndex + externalPageSize,
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
      .print-header h2 { font-size: 20pt; font-normal; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { border: 1px solid #000; padding: 8px; text-align: left; }
      @media print { .no-print { display: none; } }
    `;
    const content = document.getElementById("myDiv")?.innerHTML || "";
    const printWindow = window.open("", "_blank");
    printWindow?.document.write(
      `<html><head><style>${printStyles}</style></head><body>${content}</body></html>`,
    );
    printWindow?.document.close();
    printWindow?.print();
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      {/* --- TOP FILTERS --- */}
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <div className="flex flex-wrap items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow">
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
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <button
              onClick={handleSearch}
              className="bg-slate-700 text-white px-6 py-3 rounded-lg shadow flex-1 lg:flex-none flex items-center justify-center transition"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" /> Search
            </button>
            <button
              onClick={printDiv}
              className="bg-blue-400 text-white px-6 py-3 rounded-lg shadow flex-1 lg:flex-none flex items-center justify-center transition"
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2" /> Print
            </button>
          </div>
        </div>
      </div>

      {/* --- TABLE AREA --- */}
      <div className="overflow-auto px-3 sm:px-0 flex-grow">
        <div className="min-w-[1000px]">
          <div className="px-0.5 pt-0.5">
            {/* Aligned with UsersDetails grid logic */}
            <div className="grid grid-cols-[60px_1fr_1fr_3fr] bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm">
              <span className="text-left">Sr#</span>
              <span className="text-left">Employee</span>
              <span className="text-left">Project</span>
              <span className="text-left">Progress Note</span>
            </div>
          </div>

          <div className="px-0.5 sm:px-1 py-2" id="myDiv">
            {paginatedData.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
                <p className="text-sm">
                  Try adjusting your date range or search term.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedData.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[60px_1fr_1fr_3fr] items-center px-3 py-2 gap-3 text-sm bg-white border 
                    border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Icons removed to match UsersDetails clean text style */}
                    <div className="truncate text-gray-800">
                      {item.employeeName}
                    </div>

                    <div className="text-gray-700 font-medium truncate">
                      {item.projectName}
                    </div>

                    <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                      {item.note}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- PAGINATION --- */}
      <div className="flex flex-row items-center justify-between p-2 border-t border-gray-100">
        <ShowDataNumber
          start={totalItems === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + externalPageSize, totalItems)}
          total={totalItems}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() =>
            startIndex + externalPageSize < totalItems &&
            setPageNo((p) => p + 1)
          }
        />
      </div>
    </div>
  );
};
