import { AccordionItem } from "../Accordion/AccordionItem";
import { SideBarButton } from "../SideBarComponent/SideBarButton";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoneyCheck, FaUserSlash } from "react-icons/fa";
import { PiFingerprintDuotone } from "react-icons/pi";
import { GoProjectRoadmap } from "react-icons/go";
import { LuListTodo } from "react-icons/lu";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
import { RiUserCommunityLine } from "react-icons/ri";
import { CiCreditCard1 } from "react-icons/ci";
type SideBarProps = {
  isOpen: boolean;
};
type TActivButton =
  | "Dashboard"
  | "Mark"
  | "AssignedProjects"
  | "Progress"
  | "Todo"
  | "Dynamic"
  | "Payroll"
  | "Salary"
  | "Apply Leave"
  | "Reports";
export const EmployeeSideBar = ({ isOpen }: SideBarProps) => {
  const [activeBtns, setActiveBtns] = useState<TActivButton | "">("");

  const navigate = useNavigate();

  const { pathname } = useLocation();

  console.log(activeBtns);

  const toggleButtonActive = (activeBtn: TActivButton) => {
    setActiveBtns((prev) => (prev === activeBtn ? "" : activeBtn));
  };

  useEffect(() => {
    if (!isOpen) setActiveBtns("");
    setActiveBtns("Dashboard");
    navigate("/User/dashboard");
  }, [isOpen]);

  return (
    <div
      className={`
    ${isOpen ? "w-20" : "w-55"}
    bg-white
    transition-all duration-300 ease-in-out
    flex flex-col items-center py-4
    shadow-lg
    sticky top-0 h-screen
    overflow-y-hidden
  `}
    >
      {!isOpen ? (
        <Link
          to={"/User/dashBoard"}
          onClick={() => setActiveBtns("Dashboard")}
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer text-gray-900  hover:bg-indigo-900 hover:text-white transition border-b m-1  w-40 ${
            activeBtns === "Dashboard" && "bg-indigo-900 text-white"
          } `}
        >
          <MdOutlineDashboard size={20} />
          <p className="text-xs">Dashboard</p>
        </Link>
      ) : (
        <div
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer hover:bg-indigo-900 border-b  transition m-1  `}
        >
          <MdOutlineDashboard size={20} />
        </div>
      )}

      {!isOpen ? (
        <Link
          to={"/users/markAttendance"}
          onClick={() => setActiveBtns("Mark")}
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer text-gray-900  hover:bg-indigo-900 hover:text-white transition border-b m-1  w-40 ${
            activeBtns === "Mark" && "bg-indigo-900 text-white"
          } `}
        >
          <PiFingerprintDuotone size={20} />
          <p className="text-xs">Mark Attendance</p>
        </Link>
      ) : (
        <div
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer hover:bg-indigo-900 border-b  transition m-1  text-gray-900  `}
        >
          <PiFingerprintDuotone size={20} />
        </div>
      )}

      {!isOpen ? (
        <Link
          to={"/users/todo"}
          onClick={() => setActiveBtns("Todo")}
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer text-gray-900  hover:bg-indigo-900 hover:text-white transition border-b m-1  w-40 ${
            activeBtns === "Todo" && "bg-indigo-900 text-white"
          } `}
        >
          <LuListTodo size={20} />
          <p className="text-xs">Todo's</p>
        </Link>
      ) : (
        <div
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer hover:bg-indigo-900 border-b  transition m-1`}
        >
          <LuListTodo size={20} />
        </div>
      )}

      <SideBarButton
        isOpen={isOpen}
        icon={<CiCreditCard1 size={20} />}
        title={"Payroll"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("Payroll")}
        activeBtns={activeBtns}
        activeBtn="Payroll"
      />
      <div>
        {activeBtns === "Payroll" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button ${
                  pathname === "/user/overTime" && "bg-indigo-200"
                } `}
                to={"/user/overTime"}
              >
                Over Time
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/user/advanceSalary" && "bg-indigo-200"
                } `}
                to={"/user/advanceSalary"}
              >
                Advance Salary
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/user/applyLoan" && "bg-indigo-200"
                } `}
                to={"/user/applyLoan"}
              >
                Apply Loan
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>

      {!isOpen ? (
        <Link
          to={"/users/assignedprojects"}
          onClick={() => setActiveBtns("AssignedProjects")}
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer text-gray-900  hover:bg-indigo-900 hover:text-white transition border-b m-1  w-40 ${
            activeBtns === "AssignedProjects" && "bg-indigo-900 text-white"
          } `}
        >
          <GoProjectRoadmap size={20} />
          <p className="text-xs">Assigned Projects</p>
        </Link>
      ) : (
        <div
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer hover:bg-indigo-900 border-b  transition m-1  text-gray-900  `}
        >
          <GoProjectRoadmap size={20} />
        </div>
      )}

      {!isOpen ? (
        <Link
          to={"/users/leaveRequests"}
          onClick={() => setActiveBtns("Apply Leave")}
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer text-gray-900  hover:bg-indigo-900 hover:text-white transition border-b m-1  w-40 ${
            activeBtns === "Apply Leave" && "bg-indigo-900 text-white"
          } `}
        >
          <FaUserSlash size={20} />
          <p className="text-xs">Apply Leave</p>
        </Link>
      ) : (
        <div
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer hover:bg-indigo-900 border-b  transition m-1  text-gray-900  `}
        >
          <FaUserSlash size={20} />
        </div>
      )}

      {!isOpen ? (
        <Link
          to={"/user/salarydetail"}
          onClick={() => setActiveBtns("Salary")}
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer text-gray-900  hover:bg-indigo-900 hover:text-white transition border-b m-1  w-40 ${
            activeBtns === "Salary" && "bg-indigo-900 text-white"
          } `}
        >
          <FaMoneyCheck size={20} />
          <p className="text-xs">Salary</p>
        </Link>
      ) : (
        <div
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer hover:bg-indigo-900 border-b  transition m-1  text-gray-900  `}
        >
          <FaMoneyCheck size={20} />
        </div>
      )}

      {!isOpen ? (
        <Link
          to={"/users/progress"}
          onClick={() => setActiveBtns("Progress")}
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer text-gray-900  hover:bg-indigo-900 hover:text-white transition border-b m-1  w-40 ${
            activeBtns === "Progress" && "bg-indigo-900 text-white"
          } `}
        >
          <GiProgression size={20} />
          <p className="text-xs">Progress</p>
        </Link>
      ) : (
        <div
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer hover:bg-indigo-900 border-b  transition m-1`}
        >
          <GiProgression size={20} />
        </div>
      )}

      <SideBarButton
        isOpen={isOpen}
        icon={<RiUserCommunityLine size={20} />}
        title={"Dynamic"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("Dynamic")}
        activeBtns={activeBtns}
        activeBtn="Dynamic"
      />

      <div>
        {activeBtns === "Dynamic" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button ${
                  pathname === "/user/promotion" && "bg-indigo-200"
                } `}
                to={"/user/promotion"}
              >
                Promotion Request
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/user/resignation" && "bg-indigo-200"
                } `}
                to={"/user/resignation"}
              >
                Resignation Request
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/user/rejoin" && "bg-indigo-200"
                } `}
                to={"/user/rejoin"}
              >
                Rejoin Request
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>

      <SideBarButton
        isOpen={isOpen}
        icon={<HiOutlineDocumentReport size={20} />}
        title={"Reports"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("Reports")}
        activeBtns={activeBtns}
        activeBtn="Reports"
      />
      <div
        className={`${
          activeBtns === "Reports" && "transition-all duration-300 ease-in-out"
        }`}
      >
        {activeBtns === "Reports" && (
          <AccordionItem isOpen={isOpen}>
            <ul
              className={`flex flex-col list-disc  ${
                activeBtns === "Reports"
              } && "transition-all duration-300  ease-in-out"`}
            >
              <Link
                className={`my-button ${
                  pathname === "/progressReports" && "bg-indigo-200"
                } `}
                to={"/users/progressReports"}
              >
                Progress Report
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/attendanceReports" && "bg-indigo-200"
                } `}
                to={"/users/attendanceReports"}
              >
                Attendance Report
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/taskReports" && "bg-indigo-200"
                } `}
                to={"/users/taskReports"}
              >
                Task Report
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>
    </div>
  );
};
