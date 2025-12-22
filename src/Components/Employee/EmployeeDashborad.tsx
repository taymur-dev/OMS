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
import { useEffect } from "react";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../LoaderComponent/Loader";

export const EmployeeDashborad = () => {
  const { loader } = useAppSelector((state) => state.NavigateSate);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = "(OMS) EMPLOYEE DASHBOARD";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("EMPLOYEE DASHBOARD"));
    }, 1000);
  }, [dispatch]);

  if (loader) return <Loader />;
  return (
    <div className="w-full">
      <div className="flex  flex-col  md:flex-row gap-4 text-gray-700 p-4 ">
        {/* Todo Card */}
        <div className="bg-white rounded-xl shadow-md w-full h-80 ">
          <div className="bg-indigo-500 text-white rounded-t-xl px-4 py-3 font-semibold text-lg">
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
          <div className="p-4 text-center text-blue-500 text-sm font-medium hover:underline cursor-pointer">
            <Link to={"/users/todo"}>For More</Link>
          </div>
        </div>

        {/* Projects Card */}
        <div className="bg-white rounded-xl shadow-md h-80 w-full">
          <div className="bg-indigo-500 text-white rounded-t-xl px-4 py-3 font-semibold text-lg">
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
      <div className="flex items-center justify-between m-4 ">
        <Card
          titleName="Working Days"
          totalUser="TotalUser"
          totalNumber={2}
          icon={<FaComputer />}
          style="bg-indigo-500 "
        />
        <Card
          titleName="Holidays of Month"
          totalUser="TotalProjects"
          totalNumber={3}
          icon={<FcLeave />}
          style="bg-red-500  "
        />
        <Card
          titleName="Presents"
          totalUser="TotalProjects"
          totalNumber={20}
          icon={<BiUser />}
          style="bg-blue-500 "
        />
        <Card
          titleName="Absent/Leave"
          totalUser="TotalTodo's"
          totalNumber={2}
          icon={<FaUserAltSlash />}
          style="bg-orange-400 "
        />
        <Card
          titleName="Total Todo"
          totalUser="TotalTodo's"
          totalNumber={5}
          icon={<CiViewList />}
          style="bg-fuchsia-500 "
        />
        <Card
          titleName="Total Progress"
          totalUser="TotalTodo's"
          totalNumber={20}
          icon={<SlNote />}
          style="bg-cyan-600 "
        />
      </div>
    </div>
  );
};
