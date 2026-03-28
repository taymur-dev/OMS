import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";
import { RiUserFill, RiInboxArchiveLine } from "react-icons/ri";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { InputField } from "../../Components/InputFields/InputField";
import { OptionField } from "../../Components/InputFields/OptionField";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

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
  email: string;
  task: string;
  startDate: string;
  endDate: string;
  deadline: string;
};

interface ProcessReportsProps {
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

export const ProcessReports = ({
  externalSearch,
  externalPageSize,
}: ProcessReportsProps) => {
  const dispatch = useAppDispatch();
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;
  const userId = currentUser?.userId;
  const isAdmin = currentUser?.role === "admin";

  const currentDate = new Date().toLocaleDateString("sv-SE");

  const [reportData, setReportData] = useState({
    startDate: currentDate,
    endDate: currentDate,
    employeeId: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: currentDate,
    endDate: currentDate,
    employeeId: "",
  });

  const [allTasks, setAllTasks] = useState<PROCESST[]>([]);
  const [pageNo, setPageNo] = useState(1);

  const [businessVar, setBusinessVar] = useState<BusinessVarType | null>(null);

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

  const handleSearch = () => {
    setAppliedFilters({
      startDate: reportData.startDate,
      endDate: reportData.endDate,
      employeeId: reportData.employeeId,
    });
    setPageNo(1);
  };

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

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
        const search = externalSearch.toLowerCase();
        return (
          item.task?.toLowerCase().includes(search) ||
          item.employeeName?.toLowerCase().includes(search)
        );
      });
  }, [allTasks, appliedFilters, externalSearch]);

  const totalItems = filteredTasks.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedData = useMemo(() => {
    return filteredTasks.slice(startIndex, startIndex + externalPageSize);
  }, [filteredTasks, externalPageSize, startIndex]);

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
    @page { size: A4 portrait; margin: 10mm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; color: #333; }
    .print-header { text-align: center; margin-bottom: 10px; }
    
    /* Line height and icon alignment */
    .business-info { line-height: 1.2; margin-bottom: 10px; color: #555; font-size: 9pt; }
    .info-item { display: inline-flex; align-items: center; margin: 0 10px; }
    .info-icon { width: 12px; height: 12px; margin-right: 5px; fill: #666; }
    
    .report-meta { text-align: left; margin-bottom: 5px; font-size: 9pt; }
    table { width: 100%; border-collapse: collapse; margin-top: 5px; }
    th, td { border: 1px solid #333; padding: 4px 8px; text-align: left; }
    th { background-color: #f2f2f2; font-weight: bold; }
  `;

    const tableRows = filteredTasks
      .map(
        (item, index) => `
    <tr>
      <td style="width: 40px;">${index + 1}</td>
      ${isAdmin ? `<td>${item.employeeName}</td>` : ""}
      <td>${item.task}</td>
      <td>${item.startDate.slice(0, 10)}</td>
      <td>${item.endDate.slice(0, 10)}</td>
      <td>${item.deadline?.slice(0, 10) || "-"}</td>
    </tr>
  `,
      )
      .join("");

    const printWindow = window.open("", "_blank");

    // SVG Icons to match Sales Report
    const addressIcon = `
    <svg class="info-icon" viewBox="0 0 24 24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
    </svg>`;
    const phoneIcon = `<svg class="info-icon" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`;

    printWindow?.document.write(`
    <html>
      <head>
        <title>Process Report</title>
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
          <h3 style="margin: 0;">Process Report</h3>
        </div>

        <div class="report-meta" style="margin-top: 10px; font-size: 13px;">
          <strong>From:</strong> ${appliedFilters.startDate} &nbsp;&nbsp;
          <strong>To:</strong> ${appliedFilters.endDate}
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50px;">Sr#</th>
              ${isAdmin ? "<th>Employee</th>" : ""}
              <th>Task Description</th>
              <th style="width: 90px;">Start Date</th>
              <th style="width: 90px;">End Date</th>
              <th style="width: 90px;">Deadline</th>
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

  useEffect(() => {
    document.title = "(OMS) PROCESS REPORTS";
    getProcessReports();
    fetchBusinessVariable();
  }, [getProcessReports, fetchBusinessVariable]);

  const handleEmailReport = async () => {
    try {
      if (!filteredTasks.length) {
        toast.error("No data available to send");
        return;
      }

      const columns = [
        { label: "Sr#", key: "__index" },
        ...(isAdmin ? [{ label: "Employee", key: "employeeName" }] : []),
        { label: "Task", key: "task" },
        { label: "Start Date", key: "startDate" },
        { label: "End Date", key: "endDate" },
        { label: "Deadline", key: "deadline" },
      ];

      let emailToSend: string | undefined;

      // ✅ CASE 1: Admin selected an employee
      if (isAdmin && reportData.employeeId) {
        const selectedEmployee = filteredTasks.find(
          (t) => t.employee_id === Number(reportData.employeeId),
        );

        emailToSend = selectedEmployee?.email;
      }

      // ✅ CASE 2: Non-admin OR fallback → current user email
      if (!emailToSend) {
        emailToSend = currentUser?.email;
      }

      if (!emailToSend) {
        toast.error("No email found for selected employee");
        return;
      }

      await axios.post(
        `${BASE_URL}/api/admin/send-report`,
        {
          email: emailToSend,
          reportData: filteredTasks,
          business: businessVar,
          columns,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Task report sent successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send task report");
    }
  };
  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      {/* --- TOP FILTER SECTION --- */}
      <div className="p-3 bg-gray-50/50 border-b border-gray-100">
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
            {isAdmin && (
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
              className="bg-slate-700 text-white px-6 py-3 rounded-lg shadow-sm flex-1 flex items-center justify-center whitespace-nowrap transition-all"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Search
            </button>
            <button
              onClick={printDiv}
              className="bg-blue-400 text-white px-6 py-3 rounded-lg shadow-sm flex-1 flex items-center justify-center whitespace-nowrap transition-all"
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2" />
              Print
            </button>

            {isAdmin && (
              <button
                onClick={handleEmailReport}
                disabled={filteredTasks.length === 0}
                className="bg-blue-800 text-white px-6 py-3 rounded-lg shadow-sm flex-1 flex items-center justify-center whitespace-nowrap transition-all"
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Email Report
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="overflow-auto px-3 sm:px-0 mt-2">
        <div className="min-w-[1000px]">
          <div className="px-0.5 pt-0.5">
            <div
              className={`grid ${
                isAdmin
                  ? "grid-cols-[60px_1fr_2fr_1fr_1fr_1fr]"
                  : "grid-cols-[60px_2fr_1fr_1fr_1fr]"
              } bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm`}
            >
              <span className="text-left">Sr#</span>
              {isAdmin && <span className="text-left">Employee</span>}
              <span className="text-left">Task Description</span>
              <span className="text-left">Start Date</span>
              <span className="text-left">End Date</span>
              <span className="text-left">Deadline</span>
            </div>
          </div>

          <div className="px-0.5 sm:px-1 py-2">
            {paginatedData.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2" id="myDiv">
                {paginatedData.map((item, index) => (
                  <div
                    key={item.id}
                    className={`grid ${
                      isAdmin
                        ? "grid-cols-[60px_1fr_2fr_1fr_1fr_1fr]"
                        : "grid-cols-[60px_2fr_1fr_1fr_1fr]"
                    } items-center px-3 py-1 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm`}
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {isAdmin && (
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                          <RiUserFill size={16} />
                        </div>
                        <span className="truncate text-gray-800">
                          {item.employeeName}
                        </span>
                      </div>
                    )}

                    <div className="text-gray-600 truncate font-medium">
                      {item.task}
                    </div>

                    <div className="text-gray-600 truncate">
                      {item.startDate.slice(0, 10)}
                    </div>

                    <div className="text-gray-600 truncate">
                      {item.endDate.slice(0, 10)}
                    </div>

                    <div className="text-gray-600 truncate font-semibold">
                      {item.deadline?.slice(0, 10)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- PAGINATION SECTION --- */}
      <div className="flex flex-row items-center justify-between p-2 mt-auto border-t border-gray-100 bg-white">
        <ShowDataNumber
          start={totalItems === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + externalPageSize, totalItems)}
          total={totalItems}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() => {
            const totalPages = Math.ceil(totalItems / externalPageSize);
            if (pageNo < totalPages) setPageNo((p) => p + 1);
          }}
        />
      </div>
    </div>
  );
};
