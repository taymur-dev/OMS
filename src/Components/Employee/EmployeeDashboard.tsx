import { FaTasks, FaUserAltSlash } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Card from "../DetailCards/Card";
import { BiUser } from "react-icons/bi";
import { CiViewList } from "react-icons/ci";
import { FcLeave } from "react-icons/fc";
import { SlNote } from "react-icons/sl";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../Content/URL";

import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../LoaderComponent/Loader";
import axios from "axios";

export const EmployeeDashboard = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;
  const userId = currentUser?.userId;

  const [cardsData, setCardsData] = useState([
    {
      titleName: "Working Days",
      totalUser: "TotalUser",
      totalNumber: 0,
      icon: <FaComputer />,
      style: "bg-indigo-500",
    },
    {
      titleName: "Holidays of Month",
      totalUser: "TotalProjects",
      totalNumber: 0,
      icon: <FcLeave />,
      style: "bg-red-500",
    },
    {
      titleName: "Presents",
      totalUser: "TotalProjects",
      totalNumber: 0,
      icon: <BiUser />,
      style: "bg-blue-500",
    },
    {
      titleName: "Absent/Leave",
      totalUser: "TotalTodo's",
      totalNumber: 0,
      icon: <FaUserAltSlash />,
      style: "bg-orange-400",
    },
    {
      titleName: "Total Todo",
      totalUser: "TotalTodo's",
      totalNumber: 0,
      icon: <CiViewList />,
      style: "bg-fuchsia-500",
    },
    {
      titleName: "Total Progress",
      totalUser: "TotalTodo's",
      totalNumber: 0,
      icon: <SlNote />,
      style: "bg-cyan-600",
    },
  ]);

  useEffect(() => {
    document.title = "(OMS) EMPLOYEE DASHBOARD";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("EMPLOYEE DASHBOARD"));
    }, 1000);

    const fetchDashboardData = async () => {
      if (!token || !userId) return;
      try {
        // Fetch all counts for this user
        const [attendanceRes, todoRes, progressRes, holidayRes] =
          await Promise.all([
            axios.get(`${BASE_URL}/api/user/getMyAttendances/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BASE_URL}/api/user/getTodo/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BASE_URL}/api/user/getMyProgress/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BASE_URL}/api/user/getMyHolidays/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        const attendanceData = attendanceRes.data; // { presents: 10, absents: 2, workingDays: 22 }
        const todoData = todoRes.data; // { totalTodos: 5 }
        const progressData = progressRes.data; // { totalProgress: 8 }
        const holidayData = holidayRes.data; // { holidays: 2 }

        setCardsData((prev) =>
          prev.map((card) => {
            switch (card.titleName) {
              case "Working Days":
                return { ...card, totalNumber: attendanceData.workingDays ?? 0 };
              case "Holidays of Month":
                return { ...card, totalNumber: holidayData.holidays ?? 0 };
              case "Presents":
                return { ...card, totalNumber: attendanceData.presents ?? 0 };
              case "Absent/Leave":
                return { ...card, totalNumber: attendanceData.absents ?? 0 };
              case "Total Todo":
                return { ...card, totalNumber: todoData.totalTodos ?? 0 };
              case "Total Progress":
                return { ...card, totalNumber: progressData.totalProgress ?? 0 };
              default:
                return card;
            }
          })
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [dispatch, token, userId]);

  if (loader) return <Loader />;

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 text-gray-700 p-4">
        <div className="bg-white rounded-xl shadow-md w-full h-80">
          <div className="bg-indigo-900 text-white rounded-t-xl px-4 py-3 font-semibold text-lg">
            Todo's
          </div>
          <div className="p-4 border-b flex justify-between items-center text-sm font-semibold">
            <div className="flex items-center gap-1">
              <FaTasks />
              Tasks
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt />
              Deadline
            </div>
          </div>
          <div className="p-4 text-center text-indigo-900 text-sm font-medium hover:underline cursor-pointer">
            <Link to={"/users/todo"}>For More</Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md h-80 w-full">
          <div className="bg-indigo-900 text-white rounded-t-xl px-4 py-3 font-semibold text-lg">
            Project's
          </div>
          <div className="p-4 border-b flex justify-between items-center text-sm font-semibold">
            <div className="flex items-center gap-1">
              <FaTasks />
              Projects
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt />
              Project Assigned Date
            </div>
          </div>
          <div className="px-4 py-2 flex justify-between border-b text-sm text-gray-700">
            <span>Office Management System</span>
            <span>05-Apr-25</span>
          </div>
          <div className="px-4 py-2 flex justify-between text-sm text-gray-700">
            <span>Learning and Excercise</span>
            <span>05-Apr-25</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 m-4">
        {cardsData.map((card, index) => (
          <div key={index} className="flex-1 min-w-[200px] max-w-[300px] h-40">
            <Card
              titleName={card.titleName}
              totalUser={card.totalUser}
              totalNumber={card.totalNumber}
              icon={card.icon}
              style={card.style}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
