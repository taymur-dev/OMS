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

interface ProcessReportsProps {
  externalSearch: string;
  externalPageSize: number;
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

  const isAdmin = currentUser?.role === "admin";
  const [allTasks, setAllTasks] = useState<PROCESST[]>([]);
  const [pageNo, setPageNo] = useState(1);

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
      @page { size: A4 portrait; }
      body { font-family: Arial, sans-serif; font-size: 11pt; color: #000; }
      .print-container { width: 100%; padding: 0; }
      .print-header { text-align: center; }
      .print-header h1 { font-size: 25pt; font-weight: bold; }
      .print-header h2 { font-size: 20pt; font-normal: normal; }
      table { width: 100%; border-collapse: collapse; border: 2px solid #000; }
      thead th, tbody td { border: 2px solid #000; font-size: 10pt; text-align: left; padding: 5px; }
    `;
    const content = document.getElementById("myDiv")?.outerHTML || "";
    document.body.innerHTML = `<div class="print-container">${content}</div>`;
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(printStyles));
    document.head.appendChild(style);
    window.print();
    location.reload();
  };

  useEffect(() => {
    document.title = "(OMS) PROCESS REPORTS";
    getProcessReports();
  }, [getProcessReports]);

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
              {isAdmin && <span className="text-left">User</span>}
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
                    } items-center px-3 py-2 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm`}
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
