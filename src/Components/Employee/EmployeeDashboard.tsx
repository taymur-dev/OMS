import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CiViewList } from "react-icons/ci";
import { FaTasks, FaUserSlash, FaCalendarCheck } from "react-icons/fa";
import { FaLaptopCode, FaArrowRightLong } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
import { RiFileList3Fill, RiExternalLinkLine } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";

import Card from "../DetailCards/Card";
import { Footer } from "../../Components/Footer";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { BASE_URL } from "../../Content/URL";

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

const CARD_CONFIG = [
  {
    key: "workingDays",
    titleName: "Working Days",
    icon: <FaLaptopCode className="text-indigo-600" />,
    path: "/user/reports",
  },
  {
    key: "holidays",
    titleName: "Holidays",
    icon: <FaCalendarCheck className="text-yellow-500" />,
    path: "/user/reports",
  },
  {
    key: "presents",
    titleName: "Presents",
    icon: <HiUserGroup className="text-green-600" />,
    path: "/user/reports",
  },
  {
    key: "absents",
    titleName: "Absent/Leave",
    icon: <FaUserSlash className="text-orange-500" />,
    path: "/users/leaveRequests",
  },
  {
    key: "totalTodos",
    titleName: "Todos",
    icon: <RiFileList3Fill className="text-fuchsia-600" />,
    path: "/users/todo",
  },
  {
    key: "totalProgress",
    titleName: "Progress",
    icon: <AiFillEdit className="text-cyan-600" />,
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
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("Dashboard Load Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, userId]);

  return (
    <div className="flex flex-col min-h-screen  bg-gray-50 w-full overflow-y-auto">
      <div className="flex-grow px-2 md:p-8 space-y-8 mx-auto w-full">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
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
                icon={card.icon}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-full min-h-[450px] overflow-hidden">
            <div className="bg-blue-50/50 px-8 py-5 pb-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className=" rounded-xl text-indigo-900">
                  <CiViewList size={28} className="font-bold" />
                </div>
                <h3 className="text-gray-900 font-extrabold text-xl tracking-tight">
                  Todo List
                </h3>
              </div>
              {!loading && (
                <span className="bg-blue-200 text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                  {todos.length}
                </span>
              )}
            </div>

            <div className="px-8 py-6  flex-grow">
              <div className="flex justify-between text-[11px] font-bold  text-gray-400 uppercase tracking-widest mb-4">
                <span>Task Name</span>
                <span>Deadline</span>
              </div>

              {loading ? (
                <div className="flex flex-col gap-2 animate-pulse mt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-50 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {todos.slice(0, 4).map((todo, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-3"
                    >
                      <div>
                        <p className="text-gray-900 font-bold text-base">
                          {todo.task}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-bold tracking-tight ${i === 0 ? "text-gray-500" : "text-gray-500"}`}
                      >
                        {todo.deadline}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6">
              <button
                onClick={() => navigate("/users/todo")}
                className="w-full bg-blue-400 text-white py-4 rounded-full font-bold flex items-center
                 justify-center gap-3 transition-all shadow-lg shadow-indigo-100"
              >
                View More Info <FaArrowRightLong />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-full min-h-[450px] overflow-hidden">
            <div className="bg-blue-50/50 px-8 py-5 pb-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="rounded-xl text-indigo-900">
                  <FaTasks size={24} />
                </div>
                <h3 className="text-gray-900 font-extrabold text-xl tracking-tight">
                  Assigned Projects
                </h3>
              </div>
              {!loading && (
                <span className="bg-blue-200 text-black text-xs font-bold px-4 py-1.5 rounded-full">
                  {projects.length}
                </span>
              )}
            </div>

            <div className="px-8 py-6 flex-grow">
              <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                <span>Project Name</span>
                <span>Assigned Date</span>
              </div>

              {loading ? (
                <div className="flex flex-col gap-4 animate-pulse mt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-50 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {projects.slice(0, 3).map((proj, i) => (
                    <div
                      key={proj.id || i}
                      className="flex justify-between items-center py-3"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-gray-900 font-bold text-base">
                            {proj.projectName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 font-bold text-sm">
                          {new Date(proj.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6">
              <button
                onClick={() => navigate("/users/assignedprojects")}
                className="w-full bg-blue-400 text-white py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-100"
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
