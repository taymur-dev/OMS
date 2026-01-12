import { AccordionItem } from "./Accordion/AccordionItem";
import { SideBarButton } from "./SideBarComponent/SideBarButton";
import { BiArrowBack } from "react-icons/bi";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaUserFriends } from "react-icons/fa";
import { PiFingerprintDuotone } from "react-icons/pi";
import { GoProjectRoadmap } from "react-icons/go";
import { LuListTodo } from "react-icons/lu";
import { CiCalculator2, CiCreditCard1 } from "react-icons/ci";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { AiOutlineFieldTime } from "react-icons/ai";
import { CgCalculator } from "react-icons/cg";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { RiUserCommunityLine } from "react-icons/ri";
import { useAppSelector } from "../redux/Hooks";
import { BASE_URL } from "../Content/URL";
import axios from "axios";
type SideBarProps = {
  isOpen: boolean;
};
type TActivButton =
  | "Dashboard"
  | "People"
  | "Attendance"
  | "Employee"
  | "AssignProjects"
  | "Performance"
  | "Sale"
  | "manageExpense"
  | "Chat"
  | "payroll"
  | "Assets Management"
  | "Recuritment"
  | "Dynamic"
  | "Accounts"
  | "Reports"
  | "configureTime";
export const SideBar = ({ isOpen }: SideBarProps) => {
  const [activeBtns, setActiveBtns] = useState<TActivButton | "">("");

  const [allTodos, setAllTodos] = useState([]);

  const { currentUser } = useAppSelector((state) => state?.officeState);

  const token = currentUser?.token;

  const navigate = useNavigate();

  const { pathname } = useLocation();

  console.log(activeBtns);

  const toggleButtonActive = (activeBtn: TActivButton) => {
    setActiveBtns((prev) => (prev === activeBtn ? "" : activeBtn));
  };

  const getAllTodos = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getTodos`, {
        headers: {
          Authorization: `Bearre: ${token}`,
        },
      });
      setAllTodos(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    setActiveBtns("Dashboard"); // default selected button
    navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllTodos();
  }, [getAllTodos]);

  return (
    <div
      className={`${
        isOpen ? "w-16" : "w-52"
      } bg-white overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out
  flex flex-col items-center py-4 shadow-lg`}
    >
      {!isOpen ? (
        <Link
          to={"/"}
          onClick={() => setActiveBtns("Dashboard")}
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer text-gray-900  hover:bg-indigo-500 hover:text-white transition border-b m-1  w-40 ${
            activeBtns === "Dashboard" && "bg-indigo-500 text-white"
          } `}
        >
          <MdOutlineDashboard size={20} />
          <p className="text-xs">Dashboard</p>
        </Link>
      ) : (
        <div
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer hover:bg-indigo-500 border-b  transition m-1  text-gray-900  `}
        >
          <MdOutlineDashboard size={20} />
        </div>
      )}
      <SideBarButton
        isOpen={isOpen}
        icon={<FaUserFriends size={20} />}
        title={"People"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("People")}
        activeBtns={activeBtns}
        activeBtn="People"
      />
      <div>
        {activeBtns === "People" && (
          <AccordionItem isOpen={isOpen}>
            <div className="flex flex-col items-start justify-start">
              <Link
                className={`my-button ${
                  pathname === "/users" && "bg-indigo-200"
                } `}
                to={"/users"}
              >
                User
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/customers" && "bg-indigo-200"
                } `}
                to={"/customers"}
              >
                Customer
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/supplier" && "bg-indigo-200"
                } `}
                to={"/supplier"}
              >
                Suppliers
              </Link>
            </div>
          </AccordionItem>
        )}
      </div>
      <SideBarButton
        isOpen={isOpen}
        icon={<PiFingerprintDuotone size={20} />}
        title={"Attendance"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("Attendance")}
        activeBtns={activeBtns}
        activeBtn="Attendance"
      />
      <div>
        {activeBtns === "Attendance" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button ${
                  pathname === "/markAttendance" && "bg-indigo-200"
                } `}
                to={"/markAttendance"}
              >
                Mark Attendance
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/usersAttendance" && "bg-indigo-200"
                } `}
                to={"/usersAttendance"}
              >
                User Attendance
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/leaveRequests" && "bg-indigo-200"
                } `}
                to={"/leaveRequests"}
              >
                Leave Request
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/holidays" && "bg-indigo-200"
                } `}
                to={"/holidays"}
              >
                Configure Holidays
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>
      <SideBarButton
        isOpen={isOpen}
        icon={<FaUser size={20} />}
        title={"Employee"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("Employee")}
        activeBtns={activeBtns}
        activeBtn="Employee"
      />
      <div>
        {activeBtns === "Employee" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button ${
                  pathname === "/employeeLifeline" && "bg-indigo-200"
                } `}
                to={"/employeeLifeline"}
              >
                Employee Lifeline
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/employeeWithdraw" && "bg-indigo-200"
                } `}
                to={"/employeeWithdraw"}
              >
                Employee Withdraw
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>
      <SideBarButton
        isOpen={isOpen}
        icon={<GoProjectRoadmap size={20} />}
        title={"Assign Project"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("AssignProjects")}
        activeBtns={activeBtns}
        activeBtn="AssignProjects"
      />
      <div>
        {activeBtns === "AssignProjects" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button ${
                  pathname === "/projects" && "bg-indigo-200"
                } `}
                to={"/projects"}
              >
                Projects
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/projectCatogries" && "bg-indigo-200"
                } `}
                to={"/projectCatogries"}
              >
                Project Categories
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/assignprojects" && "bg-indigo-200"
                } `}
                to={"/assignprojects"}
              >
                Assign Project
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>
      <SideBarButton
        isOpen={isOpen}
        icon={<LuListTodo size={20} />}
        title={"Performance"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("Performance")}
        activeBtns={activeBtns}
        activeBtn="Performance"
      />
      <div>
        {activeBtns === "Performance" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button flex items-center justify-between ${
                  pathname === "/todo" && "bg-indigo-200"
                } `}
                to={"/todo"}
              >
                <span className=""> Todo </span>{" "}
                {allTodos.length > 0 ? (
                  <span className="text-left font-bold text-gray-800 bg-indigo-500 rounded p-1">
                    {allTodos.length}
                  </span>
                ) : null}
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/progress" && "bg-indigo-200"
                } `}
                to={"/progress"}
              >
                Progress
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>
      <SideBarButton
        isOpen={isOpen}
        icon={<CiCalculator2 size={20} />}
        title={"Sales"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("Sale")}
        activeBtns={activeBtns}
        activeBtn="Sale"
      />
      <div>
        {activeBtns === "Sale" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button ${
                  pathname === "/sales" && "bg-indigo-200"
                } `}
                to={"/sales"}
              >
                Sales
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/quotations" && "bg-indigo-200"
                } `}
                to={"/quotations"}
              >
                Quotation
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/payments" && "bg-indigo-200"
                } `}
                to={"/payments"}
              >
                Payment
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>
      <SideBarButton
        isOpen={isOpen}
        icon={<LiaProjectDiagramSolid size={20} />}
        title={"Manage Expense"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("manageExpense")}
        activeBtns={activeBtns}
        activeBtn="manageExpense"
      />
      <div className="">
        {activeBtns === "manageExpense" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button ${
                  pathname === "/expenses" && "bg-indigo-200"
                } `}
                to={"/expenses"}
              >
                Expense
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/expensesCatogries" && "bg-indigo-200"
                } `}
                to={"/expensesCatogries"}
              >
                Expense Category
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>

      <SideBarButton
        isOpen={isOpen}
        icon={<CiCreditCard1 size={20} />}
        title={"Payroll"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("payroll")}
        activeBtns={activeBtns}
        activeBtn="payroll"
      />
      <div>
        {activeBtns === "payroll" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button ${
                  pathname === "/calendar" && "bg-indigo-200"
                } `}
                to={"/calendar"}
              >
                Calendar
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/salaryCycle" && "bg-indigo-200"
                } `}
                to={"/salaryCycle"}
              >
                Salary Cycle
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/overTime" && "bg-indigo-200"
                } `}
                to={"/overTime"}
              >
                Over Time
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/advanceSalary" && "bg-indigo-200"
                } `}
                to={"/advanceSalary"}
              >
                Advance Salary
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/applyLoan" && "bg-indigo-200"
                } `}
                to={"/applyLoan"}
              >
                Apply Loan
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/configEmployeeSalaries" && "bg-indigo-200"
                } `}
                to={"/configEmployeeSalaries"}
              >
                Config Employee Salaries
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>

      <SideBarButton
        isOpen={isOpen}
        icon={<CiCreditCard1 size={20} />}
        title={"Assets Mangement"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("Assets Management")}
        activeBtns={activeBtns}
        activeBtn="Assets Management"
      />
      <div>
        {activeBtns === "Assets Management" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button ${
                  pathname === "/assetsCategory" && "bg-indigo-200"
                } `}
                to={"/assetsCategory"}
              >
                Asset Category
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/assets" && "bg-indigo-200"
                } `}
                to={"/assets"}
              >
                Assets
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>

      <SideBarButton
        isOpen={isOpen}
        icon={<HiOutlinePencilSquare size={20} />}
        title={"Recuritment"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("Recuritment")}
        activeBtns={activeBtns}
        activeBtn="Recuritment"
      />

      <div>
        {activeBtns === "Recuritment" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button ${
                  pathname === "/applicants" && "bg-indigo-200"
                } `}
                to={"/applicants"}
              >
                Applicants
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/job" && "bg-indigo-200"
                } `}
                to={"/job"}
              >
                Jobs
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>

      {/* <SideBarButton
        isOpen={isOpen}
        icon={<AiOutlineFieldTime size={20} />}
        title={"Configure Time"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("configureTime")}
        activeBtns={activeBtns}
        activeBtn="configure"
      />
      <div>
        {activeBtns === "configureTime" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button ${
                  pathname === "/configTime" && "bg-indigo-200"
                } `}
                to={"/configTime"}
              >
                Config Time
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div> */}
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
                  pathname === "/promotion" && "bg-indigo-200"
                } `}
                to={"/promotion"}
              >
                Promotion Request
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/resignation" && "bg-indigo-200"
                } `}
                to={"/resignation"}
              >
                Resignation Request
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/rejoin" && "bg-indigo-200"
                } `}
                to={"/rejoin"}
              >
                Rejoin Request
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>

      <SideBarButton
        isOpen={isOpen}
        icon={<CgCalculator size={20} />}
        title={"Accounts"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("Accounts")}
        activeBtns={activeBtns}
        activeBtn="Accounts"
      />
      <div>
        {activeBtns === "Accounts" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button ${
                  pathname === "/employeeAccount" && "bg-indigo-200"
                } `}
                to={"/employeeAccount"}
              >
                Employee Account
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/customerAccount" && "bg-indigo-200"
                } `}
                to={"/customerAccount"}
              >
                Customer Account
              </Link>

              <Link
                className={`my-button ${
                  pathname === "/supplierAccount" && "bg-indigo-200"
                } `}
                to={"/supplierAccount"}
              >
                Supplier Account
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
                  pathname === "/salesReports" && "bg-indigo-200"
                } `}
                to={"/salesReports"}
              >
                Sale Report
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/progressReports" && "bg-indigo-200"
                } `}
                to={"/progressReports"}
              >
                Progress Report
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/attendanceReports" && "bg-indigo-200"
                } `}
                to={"/attendanceReports"}
              >
                Attendance Report
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/taskReports" && "bg-indigo-200"
                } `}
                to={"/taskReports"}
              >
                Task Report
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/paymentReports" && "bg-indigo-200"
                } `}
                to={"/paymentReports"}
              >
                Payment Report
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/expenseReports" && "bg-indigo-200"
                } `}
                to={"/expenseReports"}
              >
                Expense Report
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>

      <SideBarButton
        isOpen={isOpen}
        icon={<AiOutlineFieldTime size={20} />}
        title={"Configure Time"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("configureTime")}
        activeBtns={activeBtns}
        activeBtn="configure"
      />
      <div>
        {activeBtns === "configureTime" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button ${
                  pathname === "/configTime" && "bg-indigo-200"
                } `}
                to={"/configTime"}
              >
                Config Time
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>
    </div>
  );
};
