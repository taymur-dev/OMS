import { useEffect, useState } from "react";
import axios from "axios";
import { FaTasks, FaUserAltSlash } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";
import { BiUser } from "react-icons/bi";
import { CiViewList } from "react-icons/ci";
import { FcLeave } from "react-icons/fc";
import { SlNote } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../Components/Footer";

import Card from "../DetailCards/Card";
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
}

interface Project {
  id: string | number;
  projectName: string;
  date: string;
}

interface CardConfigItem {
  key: string;
  titleName: string;
  icon?: React.ReactNode;
  style: string;
  path?: string;
}

const CARD_CONFIG: CardConfigItem[] = [
  {
    key: "workingDays",
    titleName: "Working Days",
    icon: <FaComputer />,
    style: "bg-indigo-900",
    path: "/users/attendanceReports",
  },
  {
    key: "holidays",
    titleName: "Holidays",
    icon: <FcLeave />,
    style: "bg-red-500",
    path: "/users/attendanceReports",
  },
  {
    key: "presents",
    titleName: "Presents",
    icon: <BiUser />,
    style: "bg-blue-500",
    path: "/users/attendanceReports",
  },
  {
    key: "absents",
    titleName: "Absent / Leave",
    icon: <FaUserAltSlash />,
    style: "bg-orange-400",
    path: "/users/leaveRequests",
  },
  {
    key: "totalTodos",
    titleName: "Total Todo",
    icon: <CiViewList />,
    style: "bg-fuchsia-500",
    path: "/users/todo",
  },
  {
    key: "totalProgress",
    titleName: "Progress",
    icon: <SlNote />,
    style: "bg-cyan-600",
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
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    document.title = "(OMS) EMPLOYEE DASHBOARD";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("EMPLOYEE DASHBOARD")), 800);
  }, [dispatch]);

  useEffect(() => {
    if (!token) return;
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(res.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };
    fetchDashboardData();
  }, [token]);

  useEffect(() => {
    if (!token || !userId) return;
    const fetchTodos = async () => {
      setLoadingTodos(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/user/getTodo/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(res.data);
        setDashboardData((prev) => ({ ...prev, totalTodos: res.data.length }));
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoadingTodos(false);
      }
    };
    fetchTodos();
  }, [token, userId]);

  useEffect(() => {
    if (!token || !userId) return;
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/user/getMyAssignProjects`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setProjects(res.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, [token, userId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full overflow-y-auto">
      <div className="flex-grow p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {CARD_CONFIG.map((card) => (
            <div
              key={card.key}
              onClick={() => {
                if (card.path) {
                  navigate(card.path);
                }
              }}
              className={`transition-all duration-200 ${card.path ? "hover:scale-105 cursor-pointer" : ""}`}
            >
              <Card
                titleName={card.titleName}
                totalUser=""
                totalNumber={dashboardData[card.key as keyof DashboardDataT]}
                icon={card.icon}
                style={`${card.style} shadow-md rounded-xl text-white`}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-900 px-5 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2 text-lg">
                <CiViewList className="text-xl" /> Todo List
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-600 text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-3">Task</th>
                    <th className="px-6 py-3 text-right">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingTodos ? (
                    <tr>
                      <td colSpan={2} className="p-8 text-center text-gray-400">
                        Loading tasks...
                      </td>
                    </tr>
                  ) : todos.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="p-8 text-center text-gray-400">
                        No pending tasks
                      </td>
                    </tr>
                  ) : (
                    todos.map((todo, i) => (
                      <tr
                        key={i}
                        className="hover:bg-indigo-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                          {todo.task}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-right font-mono">
                          {new Date(todo.deadline)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                            .replace(/ /g, "-")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Projects List Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-900 px-5 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2 text-lg">
                <FaTasks className="text-lg" /> Assigned Projects
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-600 text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-3">Project Name</th>
                    <th className="px-6 py-3 text-right">Assigned Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingProjects ? (
                    <tr>
                      <td colSpan={2} className="p-8 text-center text-gray-400">
                        Loading projects...
                      </td>
                    </tr>
                  ) : projects.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="p-8 text-center text-gray-400">
                        No assigned projects
                      </td>
                    </tr>
                  ) : (
                    projects.map((project) => (
                      <tr
                        key={project.id}
                        className="hover:bg-indigo-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                          {project.projectName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-right font-mono">
                          {new Date(project.date)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                            .replace(/ /g, "-")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
