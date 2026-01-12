import { useEffect, useState, useCallback, useMemo } from "react";
import axios, { AxiosError } from "axios";
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

  const [reportData, setReportData] = useState({
    startDate: currentDate,
    endDate: currentDate,
    userId: "",
  });
  const [attendance, setAttendance] = useState<AttendanceT[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= FETCH ATTENDANCE ================= */
  const getAttendanceReport = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
      const url = isAdmin
        ? `${BASE_URL}/api/admin/getAllAttendances`
        : `${BASE_URL}/api/user/getMyAttendances`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Normalize dates to YYYY-MM-DD
      const normalizedData = Array.isArray(res.data)
        ? res.data.map((item: AttendanceT) => ({
            ...item,
            date: new Date(item.date).toLocaleDateString("sv-SE"),
          }))
        : [];

      setAttendance(normalizedData);
    } catch (error) {
      console.error("Failed to load attendance report", error);
      setAttendance([]);
    }
  }, [token, currentUser, isAdmin]);

  /* ================= FETCH USERS ================= */
  const getUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const activeUsers = (res.data.users || []).filter(
        (u: UserType) => u.loginStatus === "Y"
      );
      setUsers(activeUsers);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error(axiosError?.response?.data?.message || error);
      setUsers([]);
    }
  }, [token]);

  /* ================= FILTER ================= */
  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) => {
      const itemDate = item.date;

      const inDateRange =
        (!reportData.startDate || itemDate >= reportData.startDate) &&
        (!reportData.endDate || itemDate <= reportData.endDate);

      const matchesUser = reportData.userId
        ? item.userId === Number(reportData.userId)
        : true;

      const matchesSearch =
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.attendanceStatus
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.day?.toLowerCase().includes(searchTerm.toLowerCase());

      return inDateRange && matchesUser && matchesSearch;
    });
  }, [attendance, reportData, searchTerm]);

  /* ================= PAGINATION ================= */
  const totalItems = filteredAttendance.length;
  const startIndex = (pageNo - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedData = filteredAttendance.slice(startIndex, endIndex);

  /* ================= HANDLERS ================= */
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
    const content = document.getElementById("attendanceDiv")?.outerHTML || "";
    document.body.innerHTML = `
      <div class="print-container">
        <div class="print-header">
          <h1>Office Management System</h1>
          <h2>Attendance Report</h2>
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

  /* ================= EFFECTS ================= */
  useEffect(() => {
    document.title = "(OMS) ATTENDANCE REPORTS";
    dispatch(navigationStart());
    getAttendanceReport();
    if (isAdmin) getUsers();

    setTimeout(() => dispatch(navigationSuccess("ATTENDANCE REPORTS")), 800);
  }, [dispatch, getAttendanceReport, getUsers, isAdmin]);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Attendance Report" activeFile="Attendance Report" />

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
                <option key={num}>{num}</option>
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

      <div className="max-h-[58vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white overflow-hidden flex flex-col">
        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div className="flex flex-1 py-1 gap-1 items-center justify-center">
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

            {isAdmin && (
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
            )}

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

        <div
          id="attendanceDiv"
          className="w-full max-h-[28.4rem] overflow-y-auto mx-auto"
        >
          <div
            className="grid grid-cols-7 bg-gray-200 text-gray-900 font-semibold border border-gray-600 
        text-sm sticky top-0 z-10 p-[7px]"
          >
            <span>Sr#</span>
            <span>Date</span>
            <span>User</span>
            <span>Clock In</span>
            <span>Clock Out</span>
            <span>Hours</span>
            <span>Day</span>
          </div>

          {paginatedData.length === 0 ? (
            <div className="text-center p-4 text-gray-700">
              No attendance records found.
            </div>
          ) : (
            paginatedData.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-7 border border-gray-600 text-gray-800 hover:bg-gray-100 transition
               duration-200 text-sm items-center justify-center p-[5px]"
              >
                <span>{startIndex + index + 1}</span>
                <span>{item.date}</span>
                <span>{item.name}</span>
                <span>{item.clockIn ?? "--"}</span>
                <span>{item.clockOut ?? "--"}</span>
                <span>{item.workingHours ?? "--"}</span>
                <span>{item.day ?? "--"}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber
          start={startIndex + 1}
          end={endIndex}
          total={totalItems}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() =>
            endIndex < totalItems && setPageNo((p) => p + 1)
          }
        />
      </div>

      <div className="flex items-center justify-center mt-4">
        <button
          onClick={printDiv}
          className="bg-green-500 text-white py-2 px-4 rounded font-semibold hover:cursor-pointer"
        >
          Download
        </button>
      </div>
    </div>
  );
};
