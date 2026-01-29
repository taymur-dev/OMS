import { AccordionItem } from "./Accordion/AccordionItem";
import { SideBarButton } from "./SideBarComponent/SideBarButton";
import { BiArrowBack } from "react-icons/bi";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  setIsOpen?: (open: boolean) => void;
};

type TActivButton =
  | "Dashboard"
  | "People"
  | "Attendance"
  | "Employee"
  | "Projects"
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
  | "Configuration";

export const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const [activeBtns, setActiveBtns] = useState<TActivButton | "">("");
  const [allTodos, setAllTodos] = useState([]);
  const [isHoverable, setIsHoverable] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false); // State for modal detection

  const { currentUser } = useAppSelector((state) => state?.officeState);
  const token = currentUser?.token;
  const { pathname } = useLocation();

  // Detect if any modal is open by observing the body tag
  useEffect(() => {
    const checkModal = () => {
      const hasModalClass = document.body.classList.contains("modal-open");
      const isScrollLocked = document.body.style.overflow === "hidden";
      // Logic: If body is locked or has modal class, blur the sidebar
      setIsBlurred(hasModalClass || isScrollLocked);
    };

    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsHoverable(true);
    } else {
      setIsHoverable(false);
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768 && isOpen && isHoverable) {
      setIsOpen?.(false);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768 && !isOpen && isHoverable) {
      setIsOpen?.(true);
    }
  };

  const toggleButtonActive = (activeBtn: TActivButton) => {
    setActiveBtns((prev) => (prev === activeBtn ? "" : activeBtn));
  };

  const getAllTodos = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getTodos`, {
        headers: { Authorization: `Bearer: ${token}` },
      });
      setAllTodos(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    setActiveBtns("Dashboard");
  }, []);

  useEffect(() => {
    getAllTodos();
  }, [getAllTodos]);

  const SubLink = ({
    to,
    label,
    badge,
  }: {
    to: string;
    label: string;
    badge?: number;
  }) => {
    const isActive = pathname === to;
    return (
      <Link
        to={to}
        onClick={() => window.innerWidth < 768 && setIsOpen?.(false)}
        className={`
          flex justify-between items-center w-full px-4 py-2 mb-1 rounded-md text-sm font-bold transition-all duration-200
          ${isActive ? "bg-white text-indigo-900 text-bold" : "bg-transparent text-black font-normal"}
        `}
      >
        <span>{label}</span>
        {badge !== undefined && badge > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-900 text-white">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          fixed inset-y-0 left-0 bg-white shadow-2xl transition-all duration-300 ease-in-out
          flex flex-col py-4 overflow-y-auto overflow-x-hidden flex-shrink-0
          z-50 md:z-30
          
          /* Blur Logic */
          ${isBlurred ? "blur-sm pointer-events-none scale-[0.99]" : "blur-0 pointer-events-auto"}

          /* MOBILE Behavior */
          ${isOpen ? "w-64 translate-x-0 visible" : "w-0 -translate-x-full invisible md:visible"}
          
          /* DESKTOP Behavior */
          md:relative md:translate-x-0 md:shadow-lg md:visible
          ${isOpen ? "md:w-20" : "md:w-64"}
        `}
      >
        <nav className="flex-1 px-3 space-y-1">
          <Link to="/" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<MdOutlineDashboard size={20} />}
              title="Dashboard"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("Dashboard");
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="Dashboard"
            />
          </Link>

          {/* People */}
          <SideBarButton
            isOpen={isOpen}
            icon={<FaUserFriends size={20} />}
            title="People"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("People")}
            activeBtns={activeBtns}
            activeBtn="People"
          />
          {activeBtns === "People" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/users" label="Users" />
                <SubLink to="/customers" label="Customers" />
                <SubLink to="/supplier" label="Suppliers" />
              </div>
            </AccordionItem>
          )}

          {/* Attendance */}
          <SideBarButton
            isOpen={isOpen}
            icon={<PiFingerprintDuotone size={20} />}
            title="Attendance"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("Attendance")}
            activeBtns={activeBtns}
            activeBtn="Attendance"
          />
          {activeBtns === "Attendance" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/markAttendance" label="Mark Attendance" />
                <SubLink to="/usersAttendance" label="User Attendance" />
                <SubLink to="/leaveRequests" label="Leave Request" />
              </div>
            </AccordionItem>
          )}

          {/* Employee */}
          <SideBarButton
            isOpen={isOpen}
            icon={<FaUser size={20} />}
            title="Employee"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("Employee")}
            activeBtns={activeBtns}
            activeBtn="Employee"
          />
          {activeBtns === "Employee" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/employeeLifeline" label="Employee Lifeline" />
                <SubLink to="/employeeWithdraw" label="Employee Withdraw" />
              </div>
            </AccordionItem>
          )}

          {/* Projects */}
          <SideBarButton
            isOpen={isOpen}
            icon={<GoProjectRoadmap size={20} />}
            title="Projects"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("Projects")}
            activeBtns={activeBtns}
            activeBtn="Projects"
          />
          {activeBtns === "Projects" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/projectCatogries" label="Project Categories" />
                <SubLink to="/projects" label="Projects List" />
                <SubLink to="/assignprojects" label="Assign Project" />
              </div>
            </AccordionItem>
          )}

          {/* Performance */}
          <SideBarButton
            isOpen={isOpen}
            icon={<LuListTodo size={20} />}
            title="Performance"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("Performance")}
            activeBtns={activeBtns}
            activeBtn="Performance"
          />
          {activeBtns === "Performance" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/todo" label="Todo" badge={allTodos.length} />
                <SubLink to="/progress" label="Progress" />
              </div>
            </AccordionItem>
          )}

          {/* Sale */}
          <SideBarButton
            isOpen={isOpen}
            icon={<CiCalculator2 size={20} />}
            title="Sales"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("Sale")}
            activeBtns={activeBtns}
            activeBtn="Sale"
          />
          {activeBtns === "Sale" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/sales" label="Sales" />
                <SubLink to="/quotations" label="Quotation" />
                <SubLink to="/payments" label="Payment" />
              </div>
            </AccordionItem>
          )}

          {/* Manage Expense */}
          <SideBarButton
            isOpen={isOpen}
            icon={<LiaProjectDiagramSolid size={20} />}
            title="Expenses"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("manageExpense")}
            activeBtns={activeBtns}
            activeBtn="manageExpense"
          />
          {activeBtns === "manageExpense" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/expensesCatogries" label="Expense Category" />
                <SubLink to="/expenses" label="Expense" />
              </div>
            </AccordionItem>
          )}

          {/* Payroll */}
          <SideBarButton
            isOpen={isOpen}
            icon={<CiCreditCard1 size={20} />}
            title="Payroll"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("payroll")}
            activeBtns={activeBtns}
            activeBtn="payroll"
          />
          {activeBtns === "payroll" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/calendar" label="Calendar" />
                <SubLink to="/salaryCycle" label="Salary Cycle" />
                <SubLink to="/overTime" label="Over Time" />
                <SubLink to="/advanceSalary" label="Advance Salary" />
                <SubLink to="/applyLoan" label="Apply Loan" />
                <SubLink to="/configEmployeeSalaries" label="Config Salaries" />
              </div>
            </AccordionItem>
          )}

          {/* Assets */}
          <SideBarButton
            isOpen={isOpen}
            icon={<CiCreditCard1 size={20} />}
            title="Assets"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("Assets Management")}
            activeBtns={activeBtns}
            activeBtn="Assets Management"
          />
          {activeBtns === "Assets Management" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/assetsCategory" label="Asset Category" />
                <SubLink to="/assets" label="Assets" />
              </div>
            </AccordionItem>
          )}

          {/* Recruitment */}
          <SideBarButton
            isOpen={isOpen}
            icon={<HiOutlinePencilSquare size={20} />}
            title="Recruitment"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("Recuritment")}
            activeBtns={activeBtns}
            activeBtn="Recuritment"
          />
          {activeBtns === "Recuritment" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/applicants" label="Applicants" />
                <SubLink to="/job" label="Jobs" />
              </div>
            </AccordionItem>
          )}

          {/* Dynamic */}
          <SideBarButton
            isOpen={isOpen}
            icon={<RiUserCommunityLine size={20} />}
            title="Dynamic"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("Dynamic")}
            activeBtns={activeBtns}
            activeBtn="Dynamic"
          />
          {activeBtns === "Dynamic" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/promotion" label="Promotion" />
                <SubLink to="/resignation" label="Resignation" />
                <SubLink to="/rejoin" label="Rejoin" />
              </div>
            </AccordionItem>
          )}

          {/* Accounts */}
          <SideBarButton
            isOpen={isOpen}
            icon={<CgCalculator size={20} />}
            title="Accounts"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("Accounts")}
            activeBtns={activeBtns}
            activeBtn="Accounts"
          />
          {activeBtns === "Accounts" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/employeeAccount" label="Employee Account" />
                <SubLink to="/customerAccount" label="Customer Account" />
                <SubLink to="/supplierAccount" label="Supplier Account" />
              </div>
            </AccordionItem>
          )}

          {/* Reports */}
          <SideBarButton
            isOpen={isOpen}
            icon={<HiOutlineDocumentReport size={20} />}
            title="Reports"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("Reports")}
            activeBtns={activeBtns}
            activeBtn="Reports"
          />
          {activeBtns === "Reports" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/salesReports" label="Sale Report" />
                <SubLink to="/progressReports" label="Progress Report" />
                <SubLink to="/attendanceReports" label="Attendance Report" />
                <SubLink to="/taskReports" label="Task Report" />
                <SubLink to="/paymentReports" label="Payment Report" />
                <SubLink to="/expenseReports" label="Expense Report" />
              </div>
            </AccordionItem>
          )}

          {/* Configure Time */}
          <SideBarButton
            isOpen={isOpen}
            icon={<AiOutlineFieldTime size={20} />}
            title="Configuration"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("Configuration")}
            activeBtns={activeBtns}
            activeBtn="Configuration"
          />
          {activeBtns === "Configuration" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/attendanceRules" label="Attendance Rules" />
                <SubLink to="/holidays" label="Configure Holidays" />
              </div>
            </AccordionItem>
          )}
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsOpen?.(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};
