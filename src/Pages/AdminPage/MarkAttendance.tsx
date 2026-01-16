import { useEffect, useState, useCallback } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  FaClock,
  FaUserShield,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Loader } from "../../Components/LoaderComponent/Loader";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
import { toast } from "react-toastify";

type AttendanceT = {
  clockIn: string | null;
  clockOut: string | null;
  workingHours: string;
  date: string;
  attendanceStatus?: string;
};

export const MarkAttendance = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);

  const token = currentUser?.token;
  const userId = currentUser?.userId;

  const [showTime, setShowTime] = useState("");
  const [attendanceTime, setAttendanceTime] = useState<AttendanceT | null>(null);

  const OFFICE_START_HOUR = 9;
  const OFFICE_END_HOUR = 18;
  const ABSENT_HOUR = 12;

  const getAttendanceStatus = (
    clockIn: string | null,
    clockOut: string | null,
    attendanceStatus?: string
  ) => {
    if (attendanceStatus === "Holiday") return "Holiday 🎉";

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

    let status = clockInDate > officeStartDate ? "Late" : "In Office";

    if (clockOut) {
      const [clockOutHour, clockOutMinute] = clockOut.split(":").map(Number);
      const clockOutDate = new Date();
      clockOutDate.setHours(clockOutHour, clockOutMinute, 0, 0);

      const officeEndDate = new Date();
      officeEndDate.setHours(OFFICE_END_HOUR, 0, 0, 0);

      if (clockOutDate < officeEndDate) status = "Half Leave";
    }

    return status;
  };

  const getAttendance = useCallback(
    async (id: string | undefined) => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/admin/getAttendance/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAttendanceTime(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    [token]
  );

  const handleMarkAttendance = async (id: string | undefined) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/markAttendance/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      getAttendance(id);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.info(
        axiosError?.response?.data?.message || "Something went wrong"
      );
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
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getAttendance(userId);
  }, [getAttendance, userId]);

  if (loader) return <Loader />;

  const isHoliday = attendanceTime?.attendanceStatus === "Holiday";

  return (
    <div className="w-full mx-auto p-6">
      <TableTitle tileName="Attendance" activeFile="Attendance Page" />

      <div className="bg-white shadow-lg border-t-4 border-indigo-900 rounded-lg p-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center space-x-3">
            <FaUserShield className="text-green-500 text-3xl" />
            <span className="text-2xl font-semibold">
              {currentUser?.name}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <FaClock className="text-gray-700 text-3xl" />
            <span className="font-bold text-2xl">{showTime}</span>
          </div>
        </div>

        <div className="mt-6 p-5 bg-gray-50 rounded-lg text-center">
          {isHoliday ? (
            <span className="text-green-600 text-xl font-semibold">
              🎉 Today is a Holiday
            </span>
          ) : !attendanceTime?.clockOut ? (
            <div className="flex items-center justify-center space-x-2 text-lg font-semibold">
              {attendanceTime?.clockIn ? (
                <>
                  <FaCheckCircle className="text-green-500" />
                  <span>
                    Clocked in at {attendanceTime.clockIn} (
                    {getAttendanceStatus(
                      attendanceTime.clockIn,
                      attendanceTime.clockOut,
                      attendanceTime.attendanceStatus
                    )}
                    )
                  </span>
                </>
              ) : (
                <>
                  <FaExclamationTriangle className="text-yellow-500" />
                  <span>
                    Please mark attendance (
                    {getAttendanceStatus(null, null)}
                    )
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-4 text-gray-700 bg-gray-100 p-4 rounded-lg">
              <span>Clock In</span>
              <span>Clock Out</span>
              <span>Working Hours</span>
              <span>Date</span>
              <span>Status</span>

              <span>{attendanceTime.clockIn}</span>
              <span>{attendanceTime.clockOut}</span>
              <span>{attendanceTime.workingHours}</span>
              <span>{attendanceTime.date}</span>
              <span>
                {getAttendanceStatus(
                  attendanceTime.clockIn,
                  attendanceTime.clockOut,
                  attendanceTime.attendanceStatus
                )}
              </span>
            </div>
          )}
        </div>

        <button
          disabled={isHoliday}
          className={`mt-6 w-full px-6 py-3 rounded-lg text-lg font-semibold 
            ${
              isHoliday
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-900 hover:bg-indigo-800 text-white"
            }`}
          onClick={() => handleMarkAttendance(userId)}
        >
          {attendanceTime?.clockIn ? "🔴 Clock Out" : "🟢 Clock In"}
        </button>
      </div>
    </div>
  );
};
