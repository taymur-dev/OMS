import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CiViewList } from "react-icons/ci";
import { FaTasks, FaUserSlash, FaCalendarCheck } from "react-icons/fa";
import { FaLaptopCode, FaArrowRightLong } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
import { RiFileList3Fill, RiExternalLinkLine } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

import Card from "../DetailCards/Card";
import { Footer } from "../../Components/Footer";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { BASE_URL } from "../../Content/URL";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

type DashboardDataT = {
  workingDays: number;
  presents: number;
  absents: number;
  holidays: number;
  totalTodos: number;
  totalProgress: number;
};

interface TodoItem {
  task: string;
  deadline: string;
  subText?: string;
}

interface Project {
  id: string | number;
  projectName: string;
  date: string;
  priority?: "High" | "Medium" | "Low";
  assignedBy?: string;
}

interface AttendanceTrend {
  month: string;
  percentage: number;
}

interface AttendanceRecord {
  date: string;
  attendanceStatus: string;
}

const CARD_CONFIG = [
  {
    key: "workingDays",
    titleName: "Working Days",
    icon: <FaLaptopCode size={24} className="text-indigo-600" />,
    path: "/user/reports",
  },
  {
    key: "holidays",
    titleName: "Holidays",
    icon: <FaCalendarCheck size={24} className="text-yellow-500" />,
    path: "/user/reports",
  },
  {
    key: "presents",
    titleName: "Presents",
    icon: <HiUserGroup size={24} className="text-green-600" />,
    path: "/user/reports",
  },
  {
    key: "absents",
    titleName: "Absent/Leave",
    icon: <FaUserSlash size={24} className="text-orange-500" />,
    path: "/users/leaveRequests",
  },
  {
    key: "totalTodos",
    titleName: "Todos",
    icon: <RiFileList3Fill size={24} className="text-fuchsia-600" />,
    path: "/users/todo",
  },
  {
    key: "totalProgress",
    titleName: "Progress",
    icon: <AiFillEdit size={24} className="text-cyan-600" />,
    path: "/users/progress",
  },
];

export const EmployeeDashboard = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.officeState);
  const navigate = useNavigate();

  const token = currentUser?.token;
  const userId = currentUser?.userId;

  const [dashboardData, setDashboardData] = useState<DashboardDataT>({
    workingDays: 0,
    presents: 0,
    absents: 0,
    holidays: 0,
    totalTodos: 0,
    totalProgress: 0,
  });

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [attendanceTrendData, setAttendanceTrendData] = useState<
    AttendanceTrend[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Define fetchAttendanceTrend using useCallback so it can be used in other hooks
  const fetchAttendanceTrend = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/getMyAttendances`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: AttendanceRecord[] = res.data || [];
      const monthlyMap: Record<string, { total: number; present: number }> = {};

      data.forEach((item) => {
        const date = new Date(item.date);
        const month = date.toLocaleString("default", { month: "short" });

        if (!monthlyMap[month]) {
          monthlyMap[month] = { total: 0, present: 0 };
        }
        monthlyMap[month].total += 1;
        if (item.attendanceStatus === "Present") {
          monthlyMap[month].present += 1;
        }
      });

      const formatted = Object.keys(monthlyMap).map((month) => ({
        month,
        percentage: Math.round(
          (monthlyMap[month].present / monthlyMap[month].total) * 100,
        ),
      }));

      setAttendanceTrendData(formatted);
    } catch (error) {
      console.error("Attendance Trend Error", error);
    }
  }, [token]);

  useEffect(() => {
    document.title = "(OMS) EMPLOYEE DASHBOARD";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("EMPLOYEE DASHBOARD")), 800);
  }, [dispatch]);

  useEffect(() => {
    if (!token || !userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [dashRes, todoRes, projRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/user/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/user/getTodo/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/user/getMyAssignProjects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDashboardData(dashRes.data);
        setTodos(todoRes.data || []);
        setProjects(projRes.data || []);

        // Now calling the memoized function
        await fetchAttendanceTrend();
      } catch (error) {
        console.error("Dashboard Load Error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userId, fetchAttendanceTrend]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full overflow-y-auto">
      <div className="flex-grow px-2 md:p-8 space-y-8 mx-auto w-full">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {CARD_CONFIG.map((card) => (
            <div
              key={card.key}
              onClick={() => card.path && navigate(card.path)}
              className="group cursor-pointer"
            >
              <Card
                titleName={card.titleName}
                totalNumber={dashboardData[card.key as keyof DashboardDataT]}
                footer={card.icon}
              />
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex flex-col mb-6">
            <h3 className="text-gray-900 text-lg font-bold tracking-tight">
              Monthly Attendance Trend
            </h3>
            <p className="text-sm text-gray-500">
              Average attendance percentage over the last 12 months
            </p>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={attendanceTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorPercentage"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  // Update this section:
                  formatter={(value: ValueType | undefined) => {
                    const numericValue = typeof value === "number" ? value : 0;
                    return [`${numericValue}%`, "Attendance"] as [
                      string,
                      string,
                    ];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPercentage)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Todo List Card */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-full min-h-[400px] overflow-hidden">
            <div className="bg-blue-50/50 px-8 py-3 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <CiViewList size={26} className="text-blue-400" />
                <h3 className="text-gray-900 text-lg tracking-tight">
                  Todo List
                </h3>
              </div>
              {!loading && (
                <span className="bg-blue-200 text-black text-xs font-bold px-3 py-1 rounded-full">
                  {todos.length}
                </span>
              )}
            </div>
            <div className="px-8 py-4 flex-grow">
              <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                <span>Task Name</span>
                <span>Deadline</span>
              </div>
              {loading ? (
                <div className="space-y-2 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-50 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {todos.slice(-5).map((todo, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2"
                    >
                      <p className="text-gray-900 font-bold text-sm">
                        {todo.task}
                      </p>
                      <span className="text-xs font-bold text-gray-500">
                        {todo.deadline}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4">
              <button
                onClick={() => navigate("/users/todo")}
                className="w-full bg-blue-400 text-white py-3 rounded-full font-bold flex items-center justify-center gap-3"
              >
                View More Info <FaArrowRightLong />
              </button>
            </div>
          </div>

          {/* Projects Card */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-full min-h-[400px] overflow-hidden">
            <div className="bg-blue-50/50 px-8 py-3 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FaTasks size={22} className="text-blue-400" />
                <h3 className="text-gray-900 text-lg tracking-tight">
                  Assigned Projects
                </h3>
              </div>
              {!loading && (
                <span className="bg-blue-200 text-black text-xs font-bold px-3 py-1 rounded-full">
                  {projects.length}
                </span>
              )}
            </div>
            <div className="px-8 py-4 flex-grow">
              <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                <span>Project Name</span>
                <span>Date</span>
              </div>
              {loading ? (
                <div className="space-y-2 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-gray-50 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {projects.slice(0, 5).map((proj, i) => (
                    <div
                      key={proj.id || i}
                      className="flex justify-between items-center py-2"
                    >
                      <p className="text-gray-900 font-bold text-sm">
                        {proj.projectName}
                      </p>
                      <p className="text-gray-500 font-bold text-xs">
                        {new Date(proj.date).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4">
              <button
                onClick={() => navigate("/users/assignedprojects")}
                className="w-full bg-blue-400 text-white py-3 rounded-full font-bold flex items-center justify-center gap-3"
              >
                Project Details <RiExternalLinkLine size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
