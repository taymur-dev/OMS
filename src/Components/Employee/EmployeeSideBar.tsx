import { AccordionItem } from "../Accordion/AccordionItem";
import { SideBarButton } from "../SideBarComponent/SideBarButton";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  setIsOpen?: (open: boolean) => void;
};

type TActivButton =
  | "Dashboard" | "Attendance" | "Projects" | "Progress" | "Todo"
  | "Payroll" | "Leave" | "Salary" | "Dynamic" | "Reports";

export const EmployeeSideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const [activeBtns, setActiveBtns] = useState<TActivButton | "">("");
  const [isHoverable, setIsHoverable] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false); 

  const { pathname } = useLocation();

  useEffect(() => {
    const checkModal = () => {
      const hasModalClass = document.body.classList.contains("modal-open");
      const isScrollLocked = document.body.style.overflow === "hidden";
      setIsBlurred(hasModalClass || isScrollLocked);
    };

    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class", "style"] });
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

  useEffect(() => {
    setActiveBtns("Dashboard");
  }, []);

  const SubLink = ({ to, label, badge }: { to: string; label: string; badge?: number; }) => {
    const isActive = pathname === to;
    return (
      <Link
        to={to}
        onClick={() => window.innerWidth < 768 && setIsOpen?.(false)}
        className={`flex justify-between items-center w-full px-4 py-2 mb-1 rounded-md text-sm font-bold transition-all duration-200 ${
          isActive ? "bg-white text-indigo-900" : "bg-transparent text-black font-normal"
        }`}
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
          
          ${isBlurred ? "blur-sm pointer-events-none scale-[0.99]" : "blur-0 pointer-events-auto"}

          ${isOpen ? "w-64 translate-x-0 visible" : "w-0 -translate-x-full invisible md:visible"}
          
          md:relative md:translate-x-0 md:shadow-lg md:visible
          ${isOpen ? "md:w-20" : "md:w-64"}
        `}
      >
        <nav className="flex-1 px-3 space-y-1">
          <Link to="/User/dashboard" className="block">
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

          <Link to="/users/markAttendance" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<PiFingerprintDuotone size={20} />}
              title="Attendance"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => toggleButtonActive("Attendance")}
              activeBtns={activeBtns}
              activeBtn="Attendance"
            />
          </Link>

          <Link to="/users/todo" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<LuListTodo size={20} />}
              title="Todo's"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => toggleButtonActive("Todo")}
              activeBtns={activeBtns}
              activeBtn="Todo"
            />
          </Link>

          <SideBarButton
            isOpen={isOpen}
            icon={<CiCreditCard1 size={20} />}
            title="Payroll"
            arrowIcon={<BiArrowBack />}
            handlerClick={() => toggleButtonActive("Payroll")}
            activeBtns={activeBtns}
            activeBtn="Payroll"
          />
          {activeBtns === "Payroll" && (
            <AccordionItem isOpen={isOpen}>
              <div className="flex flex-col">
                <SubLink to="/user/overTime" label="Over Time" />
                <SubLink to="/user/advanceSalary" label="Advance Salary" />
                <SubLink to="/user/applyLoan" label="Apply Loan" />
              </div>
            </AccordionItem>
          )}

          <Link to="/users/assignedprojects" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<GoProjectRoadmap size={20} />}
              title="Assigned Projects"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => toggleButtonActive("Projects")}
              activeBtns={activeBtns}
              activeBtn="Projects"
            />
          </Link>

          <Link to="/users/leaveRequests" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<FaUserSlash size={20} />}
              title="Apply Leave"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => toggleButtonActive("Leave")}
              activeBtns={activeBtns}
              activeBtn="Leave"
            />
          </Link>

          <Link to="/user/salarydetail" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<FaMoneyCheck size={20} />}
              title="Salary"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => toggleButtonActive("Salary")}
              activeBtns={activeBtns}
              activeBtn="Salary"
            />
          </Link>

          <Link to="/users/progress" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<GiProgression size={20} />}
              title="Progress"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => toggleButtonActive("Progress")}
              activeBtns={activeBtns}
              activeBtn="Progress"
            />
          </Link>

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
                <SubLink to="/user/promotion" label="Promotion Request" />
                <SubLink to="/user/resignation" label="Resignation Request" />
                <SubLink to="/user/rejoin" label="Rejoin Request" />
              </div>
            </AccordionItem>
          )}

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
                <SubLink to="/users/progressReports" label="Progress Report" />
                <SubLink to="/users/attendanceReports" label="Attendance Report" />
                <SubLink to="/users/taskReports" label="Task Report" />
              </div>
            </AccordionItem>
          )}
        </nav>
      </div>

      {/* Mobile Overlay */}
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