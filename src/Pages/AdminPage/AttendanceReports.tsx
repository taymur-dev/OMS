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
import { Footer } from "../../Components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";

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

export const AttendanceReports = () => {
  const dispatch = useAppDispatch();
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const currentDate = new Date().toLocaleDateString("sv-SE");
  const itemsPerPage = 10; // Fixed to match SalesReport logic

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
  const [searchTerm, setSearchTerm] = useState("");

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
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.attendanceStatus?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUser = appliedFilters.userId
        ? item.userId === Number(appliedFilters.userId)
        : true;

      const inDateRange =
        item.date >= appliedFilters.startDate &&
        item.date <= appliedFilters.endDate;

      return matchesSearch && matchesUser && inDateRange;
    });
  }, [attendance, searchTerm, appliedFilters]);

  /* ================= PAGINATION ================= */
  const startIndex = (pageNo - 1) * itemsPerPage;
  const paginatedData = filteredAttendance.slice(
    startIndex,
    startIndex + itemsPerPage,
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
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        <TableTitle tileName="Attendance Report" />

        <hr className="border border-b border-gray-200" />

        {/* --- FILTER SECTION --- */}
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
                /* Keeps the grid alignment even if not admin */
                <div className="hidden sm:block"></div>
              )}
            </div>

            {/* Buttons Container: Wraps and goes full width on smaller screens */}
            <div className="flex gap-2 flex-grow lg:flex-grow-0 min-w-full lg:min-w-fit">
              <button
                onClick={handleSearchClick}
                className="bg-indigo-900 text-white px-6 py-3 rounded-xl shadow flex-1 flex items-center 
              justify-center whitespace-nowrap hover:bg-indigo-800 transition"
              >
                <FontAwesomeIcon icon={faSearch} className="mr-2" />
                Search
              </button>

              <button
                onClick={printDiv}
                className="bg-blue-900 text-white px-6 py-3 rounded-xl shadow flex-1 flex items-center 
              justify-center whitespace-nowrap hover:bg-blue-800 transition"
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
          <div id="attendanceDiv" className="min-w-[800px]">
            {/* Sticky Table Header */}
            <div
              className={`grid ${
                isAdmin ? "grid-cols-7" : "grid-cols-6"
              } bg-indigo-900 text-white items-center font-semibold text-sm sticky top-0 z-10 p-2`}
            >
              <span>Sr#</span>
              <span>Date</span>
              {isAdmin && <span>User</span>}
              <span>Clock In</span>
              <span>Clock Out</span>
              <span>Hours</span>
              <span>Day</span>
            </div>

            {/* Table Body */}
            {filteredAttendance.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10 border-x border-b border-gray-200">
                No records available at the moment!
              </div>
            ) : (
              paginatedData.map((item, index) => (
                <div
                  key={item.id}
                  className={`grid ${
                    isAdmin ? "grid-cols-7" : "grid-cols-6"
                  } border-b border-x border-gray-200 text-gray-800 items-center text-sm p-2 hover:bg-gray-50 transition`}
                >
                  <span>{startIndex + index + 1}</span>
                  <span>{item.date}</span>
                  {isAdmin && <span className="truncate">{item.name}</span>}
                  <span>{item.clockIn ?? "--"}</span>
                  <span>{item.clockOut ?? "--"}</span>
                  <span>{item.workingHours ?? "--"}</span>
                  <span>{item.day ?? "--"}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- PAGINATION SECTION --- */}
        <div className="flex flex-row items-center justify-between p-2">
          <ShowDataNumber
            start={filteredAttendance.length === 0 ? 0 : startIndex + 1}
            end={Math.min(startIndex + itemsPerPage, filteredAttendance.length)}
            total={filteredAttendance.length}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={() =>
              setPageNo((p) => Math.max(p - 1, 1))
            }
            handleIncrementPageButton={() =>
              startIndex + itemsPerPage < filteredAttendance.length &&
              setPageNo((p) => p + 1)
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
