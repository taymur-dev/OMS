import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";
import { RiInboxArchiveLine } from "react-icons/ri";

type UserType = {
  id: number;
  name: string;
  loginStatus: string;
};

type AttendanceT = {
  id: number;
  userId: number;
  name: string;
  date: string;
  clockIn: string;
  clockOut: string;
  workingHours: string;
  day: string;
  attendanceStatus: string;
};

interface AttendanceReportsProps {
  externalSearch: string;
  externalPageSize: number;
}

export const AttendanceReports = ({
  externalSearch,
  externalPageSize,
}: AttendanceReportsProps) => {
  const dispatch = useAppDispatch();
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const currentDate = new Date().toLocaleDateString("sv-SE");

  const [reportData, setReportData] = useState({
    startDate: currentDate,
    endDate: currentDate,
    userId: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: currentDate,
    endDate: currentDate,
    userId: "",
  });

  const [attendance, setAttendance] = useState<AttendanceT[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [pageNo, setPageNo] = useState(1);

  /* ================= FETCH DATA ================= */
  const getAttendanceReport = useCallback(async () => {
    if (!token || !currentUser) return;
    try {
      const url = isAdmin
        ? `${BASE_URL}/api/admin/getAllAttendances`
        : `${BASE_URL}/api/user/getMyAttendances`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const normalizedData = Array.isArray(res.data)
        ? res.data.map((item: AttendanceT) => ({
            ...item,
            date: new Date(item.date).toLocaleDateString("sv-SE"),
          }))
        : [];

      setAttendance(normalizedData);
    } catch (error) {
      console.error("Failed to load attendance report", error);
    }
  }, [token, currentUser, isAdmin]);

  const getUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const activeUsers = (res.data.users || []).filter(
        (u: UserType) => u.loginStatus === "Y",
      );
      setUsers(activeUsers);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  /* ================= FILTER LOGIC ================= */
  const handleSearchClick = () => {
    setAppliedFilters({
      startDate: reportData.startDate,
      endDate: reportData.endDate,
      userId: reportData.userId,
    });
    setPageNo(1);
  };

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(externalSearch.toLowerCase()) ||
        item.attendanceStatus
          ?.toLowerCase()
          .includes(externalSearch.toLowerCase());

      const matchesUser = appliedFilters.userId
        ? item.userId === Number(appliedFilters.userId)
        : true;

      const inDateRange =
        item.date >= appliedFilters.startDate &&
        item.date <= appliedFilters.endDate;

      return matchesSearch && matchesUser && inDateRange;
    });
  }, [attendance, externalSearch, appliedFilters]);

  /* ================= PAGINATION ================= */
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedData = filteredAttendance.slice(
    startIndex,
    startIndex + externalPageSize,
  );

  /* ================= HANDLERS ================= */
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
    const content = document.getElementById("attendanceDiv")?.outerHTML || "";
    document.body.innerHTML = `
      <div class="print-container">
        <div class="print-header">
          <h1>Office Management System</h1>
          <h2>Attendance Report</h2>
        </div>
        <div class="date-range">
          <strong>From: ${appliedFilters.startDate}</strong>
          <strong>To: ${appliedFilters.endDate}</strong>
        </div>
        ${content}
      </div>
    `;
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(printStyles));
    document.head.appendChild(style);
    window.print();
    location.reload();
  };

  useEffect(() => {
    document.title = "(OMS) ATTENDANCE REPORTS";
    dispatch(navigationStart());
    getAttendanceReport();
    if (isAdmin) getUsers();
    setTimeout(() => dispatch(navigationSuccess("ATTENDANCE REPORTS")), 800);
  }, [dispatch, getAttendanceReport, getUsers, isAdmin]);

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      {/* --- FILTER SECTION --- */}
      <div className="p-3 bg-white border-b border-gray-100">
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
            {isAdmin ? (
              <OptionField
                labelName="User"
                name="userId"
                value={reportData.userId}
                optionData={users.map((u) => ({
                  id: u.id,
                  label: u.name,
                  value: u.id,
                }))}
                inital="Select User"
                handlerChange={handleChange}
              />
            ) : (
              <div className="hidden sm:block"></div>
            )}
          </div>

          <div className="flex gap-2 flex-grow lg:flex-grow-0 min-w-full lg:min-w-fit">
            <button
              onClick={handleSearchClick}
              className="bg-slate-700 text-white px-6 py-3 rounded-lg shadow flex-1 flex items-center 
            justify-center whitespace-nowrap  transition"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Fetch Report
            </button>
            <button
              onClick={printDiv}
              className="bg-blue-400 text-white px-6 py-3 rounded-lg shadow flex-1 flex items-center
             justify-center whitespace-nowrap transition"
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* --- TABLE AREA --- */}
      <div className="overflow-auto px-3 sm:px-0 mt-2">
        <div className="min-w-[1000px]">
          {/* Header Row */}
          <div className="px-0.5 pt-0.5">
            <div
              className={`grid ${
                isAdmin
                  ? "grid-cols-[60px_1.5fr_1.5fr_1fr_1fr_1fr_1fr]"
                  : "grid-cols-[60px_1.5fr_1fr_1fr_1fr_1fr]"
              } bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm`}
            >
              <span className="text-left">Sr#</span>
              <span className="text-left">Date & Day</span>
              {isAdmin && <span className="text-left">User Name</span>}
              <span className="text-left">Clock In</span>
              <span className="text-left">Clock Out</span>
              <span className="text-left">Working Hours</span>
              <span className="text-right pr-4">Status</span>
            </div>
          </div>

          {/* Body Rows */}
          <div id="attendanceDiv" className="px-0.5 sm:px-1 py-2">
            {filteredAttendance.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No records available!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedData.map((item, index) => (
                  <div
                    key={item.id}
                    className={`grid ${
                      isAdmin
                        ? "grid-cols-[60px_1.5fr_1.5fr_1fr_1fr_1fr_1fr]"
                        : "grid-cols-[60px_1.5fr_1fr_1fr_1fr_1fr]"
                    } items-center px-3 py-2 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm`}
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    <div className="flex flex-col min-w-0">
                      <span className=" text-gray-800">
                        {item.date}
                      </span>
                      <span className="text-xs text-gray-400">{item.day}</span>
                    </div>

                    {isAdmin && (
                      <span className="font-medium text-gray-800 truncate">
                        {item.name}
                      </span>
                    )}

                    <div className="text-gray-600">
                      {item.clockIn || "--:--"}
                    </div>

                    <div className="text-gray-600">
                      {item.clockOut || "--:--"}
                    </div>

                    <div className="text-gray-600 font-medium">
                      {item.workingHours || "0h 0m"}
                    </div>

                    <div className="text-right pr-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          item.attendanceStatus === "Present"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.attendanceStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- PAGINATION SECTION --- */}
      <div className="flex flex-row items-center justify-between p-2 mt-auto border-t border-gray-100">
        <ShowDataNumber
          start={filteredAttendance.length === 0 ? 0 : startIndex + 1}
          end={Math.min(
            startIndex + externalPageSize,
            filteredAttendance.length,
          )}
          total={filteredAttendance.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() =>
            startIndex + externalPageSize < filteredAttendance.length &&
            setPageNo((p) => p + 1)
          }
        />
      </div>
    </div>
  );
};
