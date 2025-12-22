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
};

export const MarkAttendance = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateSate);

  const token = currentUser?.token;
  const userId = currentUser?.userId;

  const [showTime, setShowTime] = useState("");
  const [attendanceTime, setAttendanceTime] = useState<AttendanceT | null>(
    null
  );

  const OFFICE_START_HOUR = 9;
  const OFFICE_END_HOUR = 18;
  const ABSENT_HOUR = 12;

  const getAttendanceStatus = (
    clockIn: string | null,
    clockOut: string | null
  ) => {
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
      setAttendanceTime(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    document.title = "(OMS) ATTENDANCE";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Users"));
    }, 1000);
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

  return (
    <div className="w-full mx-auto p-6">
      <TableTitle tileName="Attendance" activeFile="Attendance Page" />

      <div className="max-w-full mx-auto bg-white shadow-lg border-t-4 border-indigo-500 rounded-lg p-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center space-x-3">
            <FaUserShield className="text-green-500 text-3xl" />
            <span className="text-2xl font-semibold text-gray-900">
              {currentUser?.name ?? "Guest"}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <FaClock className="text-gray-700 text-3xl" />
            <span className="font-bold text-2xl text-gray-700">{showTime}</span>
          </div>
        </div>

        <div className="mt-6 p-5 bg-gray-50 rounded-lg text-center">
          {!attendanceTime?.clockOut ? (
            <div className="flex items-center justify-center space-x-2 text-lg font-semibold text-gray-800">
              {attendanceTime?.clockIn ? (
                <>
                  <FaCheckCircle className="text-green-500 text-xl" />
                  <span>
                    Your attendance is marked at: {attendanceTime.clockIn} (
                    {getAttendanceStatus(
                      attendanceTime.clockIn,
                      attendanceTime.clockOut
                    )}
                    )
                  </span>
                </>
              ) : (
                <>
                  <FaExclamationTriangle className="text-yellow-500 text-xl" />
                  <span>
                    Please mark your attendance (
                    {getAttendanceStatus(attendanceTime?.clockIn || null, null)}
                    )
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-4 text-gray-700 p-4 bg-gray-100 rounded-lg">
              <span className="font-semibold">Clock In</span>
              <span className="font-semibold">Clock Out</span>
              <span className="font-semibold">Working Hours</span>
              <span className="font-semibold">Date</span>
              <span className="font-semibold">Status</span>

              <span className="text-green-600">{attendanceTime?.clockIn}</span>
              <span className="text-red-600">{attendanceTime?.clockOut}</span>
              <span className="text-blue-600">
                {attendanceTime?.workingHours}
              </span>
              <span className="text-gray-800">
                {attendanceTime?.date.slice(0, 10)}
              </span>
              <span className="text-purple-600">
                {getAttendanceStatus(
                  attendanceTime.clockIn,
                  attendanceTime.clockOut
                )}
              </span>
            </div>
          )}
        </div>

        <button
          className="mt-6 w-full bg-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg 
            hover:bg-indigo-600 transition duration-300 ease-in-out transform 
            active:scale-95 text-lg font-semibold"
          onClick={() => handleMarkAttendance(userId)}
        >
          {attendanceTime?.clockIn ? "🔴 Clock Out" : "🟢 Clock In"}
        </button>
      </div>
    </div>
  );
};
