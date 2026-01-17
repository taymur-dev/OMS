import { useEffect, useState } from "react";
import axios from "axios";

import { FaTasks, FaUserAltSlash, FaCalendarAlt } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";
import { BiUser } from "react-icons/bi";
import { CiViewList } from "react-icons/ci";
import { FcLeave } from "react-icons/fc";
import { SlNote } from "react-icons/sl";

import Card from "../DetailCards/Card";
import { Loader } from "../LoaderComponent/Loader";

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

const CARD_CONFIG = [
  {
    key: "workingDays",
    titleName: "Working Days",
    icon: <FaComputer />,
    style: "bg-indigo-500",
  },
  {
    key: "holidays",
    titleName: "Holidays of Month",
    icon: <FcLeave />,
    style: "bg-red-500",
  },
  {
    key: "presents",
    titleName: "Presents",
    icon: <BiUser />,
    style: "bg-blue-500",
  },
  {
    key: "absents",
    titleName: "Absent / Leave",
    icon: <FaUserAltSlash />,
    style: "bg-orange-400",
  },
  {
    key: "totalTodos",
    titleName: "Total Todo",
    icon: <CiViewList />,
    style: "bg-fuchsia-500",
  },
  {
    key: "totalProgress",
    titleName: "Total Progress",
    icon: <SlNote />,
    style: "bg-cyan-600",
  },
];

export const EmployeeDashboard = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
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
        setDashboardData((prev) => ({
          ...prev,
          totalTodos: res.data.length,
        }));
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
          }
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

  if (loader) return <Loader />;

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 text-gray-700 p-4">
        <div className="bg-white rounded-xl shadow-md w-full h-120 border-2 border-indigo-900 hover:border-white overflow-auto">
          <div className="bg-indigo-900 text-white rounded-t-xl px-4 py-3 font-semibold text-lg">
            Todo's
          </div>

          <div className="p-4 border-b flex justify-between items-center text-sm font-semibold">
            <div className="flex items-center gap-1">
              <FaTasks /> Tasks
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt /> Deadline
            </div>
          </div>

          {loadingTodos ? (
  <div className="text-center py-4 text-gray-500">Loading...</div>
) : todos.length === 0 ? (
  <div className="text-center py-4 text-gray-500">No todos available</div>
) : (
  todos.slice().reverse().map((todo, index) => (
    <div
      key={index}
      className="px-4 py-2 flex justify-between border-b text-sm text-gray-700 last:border-b-0"
    >
      <span>{todo.task}</span>
      <span>{new Date(todo.deadline).toLocaleDateString("sv-SE")}</span>
    </div>
  ))
)}


        </div>

        <div className="bg-white rounded-xl shadow-md h-120 border-2 border-indigo-900 hover:border-white w-full overflow-auto">
          <div className="bg-indigo-900 text-white rounded-t-xl px-4 py-3 font-semibold text-lg">
            Project's
          </div>

          <div className="p-4 border-b flex justify-between items-center text-sm font-semibold">
            <div className="flex items-center gap-1">
              <FaTasks /> Projects
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt /> Assigned Date
            </div>
          </div>

          {loadingProjects ? (
  <div className="text-center py-4 text-gray-500">Loading...</div>
) : projects.length === 0 ? (
  <div className="px-4 py-2 text-sm text-gray-500">No projects assigned</div>
) : (
  projects.slice().reverse().map((project) => (
    <div
      key={project.id}
      className="px-4 py-2 flex justify-between border-b text-sm text-gray-700 last:border-b-0"
    >
      <span>{project.projectName}</span>
      <span>{new Date(project.date).toLocaleDateString("sv-SE")}</span>
    </div>
  ))
)}


          
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-4 m-4">
        {CARD_CONFIG.map((card) => (
          <div
            key={card.key}
            className="flex-1 min-w-[200px] max-w-[300px] h-40"
          >
            <Card
              titleName={card.titleName}
              totalUser=""
              totalNumber={dashboardData[card.key as keyof DashboardDataT]}
              icon={card.icon}
              style={card.style}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
