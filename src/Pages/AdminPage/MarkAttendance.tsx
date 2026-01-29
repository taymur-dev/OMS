import { useEffect, useState, useCallback } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  FaClock,
  FaUserShield,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSignInAlt,
  FaSignOutAlt,
  FaHourglassHalf,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { Loader } from "../../Components/LoaderComponent/Loader";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
import { toast } from "react-toastify";
import { Footer } from "../../Components/Footer";

type AttendanceT = {
  clockIn: string | null;
  clockOut: string | null;
  workingHours: string;
  date: string;
  attendanceStatus?: string;
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "In Office":
      case "Present":
        return "bg-green-100 text-green-700 border-green-200";
      case "Late":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Half Leave":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Short Leave":
        return "bg-pink-100 text-pink-700 border-pink-200";
      case "Absent":
        return "bg-red-100 text-red-700 border-red-200";
      case "Holiday 🎉":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(status)}`}
    >
      {status}
    </span>
  );
};

export const MarkAttendance = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);

  const token = currentUser?.token;
  const userId = currentUser?.userId;

  const [showTime, setShowTime] = useState("");
  const [attendanceTime, setAttendanceTime] = useState<AttendanceT | null>(
    null,
  );

  const OFFICE_START_HOUR = 9;
  const ABSENT_HOUR = 12;

  const getAttendanceStatus = (
    clockIn: string | null,
    _clockOut: string | null,
    attendanceStatus?: string,
  ) => {
    if (attendanceStatus && attendanceStatus !== "Present") {
      if (attendanceStatus === "Holiday") return "Holiday 🎉";
      return attendanceStatus;
    }

    const now = new Date();

    if (!clockIn) {
      if (now.getHours() >= ABSENT_HOUR) return "Absent";
      return "Not Marked";
    }

    const [clockInHour, clockInMinute] = clockIn.split(":").map(Number);
    const clockInDate = new Date();
    clockInDate.setHours(clockInHour, clockInMinute, 0, 0);
    const officeStartDate = new Date();
    officeStartDate.setHours(OFFICE_START_HOUR, 0, 0, 0);

    return clockInDate > officeStartDate ? "Late" : "In Office";
  };

  const getAttendance = useCallback(
    async (id: string | undefined) => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/admin/getAttendance/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setAttendanceTime(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    [token],
  );

  const handleMarkAttendance = async (id: string | undefined) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/markAttendance/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(res.data.message);
      getAttendance(id);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.info(axiosError?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    document.title = "(OMS) ATTENDANCE";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("Users")), 1000);
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getAttendance(userId);
  }, [getAttendance, userId]);

  if (loader) return <Loader />;

  const isHoliday = attendanceTime?.attendanceStatus === "Holiday";

  const currentStatus = getAttendanceStatus(
    attendanceTime?.clockIn || null,
    attendanceTime?.clockOut || null,
    attendanceTime?.attendanceStatus,
  );

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray-100 overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        <TableTitle tileName="Attendance" />
        <hr className="border border-b border-gray-200" />

        <div className="p-4">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            <div className="flex items-center space-x-3">
              <FaUserShield className="text-green-500 text-2xl" />
              <span className="text-lg font-semibold text-gray-800">
                {currentUser?.name}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <FaClock className="text-gray-700 text-xl" />
              <span className="font-bold text-lg text-indigo-900">
                {showTime}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-auto px-4 flex-grow">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
            {isHoliday ? (
              <div className="py-10 flex flex-col items-center gap-4">
                <StatusBadge status="Holiday 🎉" />
                <span className="text-green-600 text-xl font-semibold">
                  Today is a Holiday
                </span>
              </div>
            ) : !attendanceTime?.clockOut ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-10 text-lg font-semibold">
                {attendanceTime?.clockIn ? (
                  <>
                    <FaCheckCircle className="text-green-500 text-4xl" />
                    <span className="text-gray-800">
                      Clocked in at {attendanceTime.clockIn}
                    </span>
                    <StatusBadge status={currentStatus} />
                  </>
                ) : (
                  <>
                    <FaExclamationTriangle className="text-yellow-500 text-4xl" />
                    <span className="text-gray-600">
                      Please mark attendance
                    </span>
                    <StatusBadge status={currentStatus} />
                  </>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto my-4">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-5 bg-indigo-900 text-white items-center font-semibold text-sm p-2 rounded-t-md">
                    <span className="flex items-center justify-center gap-2">
                      <FaSignInAlt className="text-blue-300" /> Clock In
                    </span>
                    <span className="flex items-center justify-center gap-2">
                      <FaSignOutAlt className="text-orange-300" /> Clock Out
                    </span>
                    <span className="flex items-center justify-center gap-2">
                      <FaHourglassHalf className="text-green-300" /> Working
                      Hours
                    </span>
                    <span className="flex items-center justify-center gap-2">
                      <FaCalendarAlt className="text-purple-300" /> Date
                    </span>
                    <span className="flex items-center gap-2 justify-center">
                      <FaInfoCircle className="text-indigo-200" /> Status
                    </span>
                  </div>
                  <div className="grid grid-cols-5 border-b border-x border-gray-200 text-gray-800 items-center text-sm p-3 bg-white">
                    <span>{attendanceTime.clockIn}</span>
                    <span>{attendanceTime.clockOut}</span>
                    <span>{attendanceTime.workingHours}</span>
                    <span>
                      {new Date(attendanceTime.date)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(/ /g, "-")}
                    </span>
                    <div className="flex justify-center">
                      <StatusBadge status={currentStatus} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 max-w-md mx-auto">
              <button
                disabled={isHoliday}
                className={`w-full px-6 py-3 rounded-lg text-lg font-semibold transition-all active:scale-95
              ${
                isHoliday
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-indigo-900 hover:bg-indigo-800 text-white shadow-md"
              }`}
                onClick={() => handleMarkAttendance(userId)}
              >
                {attendanceTime?.clockIn && !attendanceTime?.clockOut
                  ? "🔴 Clock Out"
                  : "🟢 Clock In"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-gray-200">
          <Footer />
        </div>
      </div>
    </div>
  );
};
