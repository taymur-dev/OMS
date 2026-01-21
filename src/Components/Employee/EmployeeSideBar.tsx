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
  | "Dashboard"
  | "Attendance"
  | "Projects"
  | "Performance"
  | "Payroll"
  | "Leave"
  | "Salary"
  | "Dynamic"
  | "Reports";

export const EmployeeSideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const [activeBtns, setActiveBtns] = useState<TActivButton | "">("");
  const { pathname } = useLocation();

  const toggleButtonActive = (activeBtn: TActivButton) => {
    setActiveBtns((prev) => (prev === activeBtn ? "" : activeBtn));
  };

  useEffect(() => {
    setActiveBtns("Dashboard");
  }, []);

  const SubLink = ({ to, label }: { to: string; label: string }) => (
    <Link
      to={to}
      onClick={() => window.innerWidth < 768 && setIsOpen?.(false)}
      className={`my-button flex justify-between items-center w-full px-4 py-2 text-sm transition-colors rounded-md mb-1
        ${pathname === to ? "bg-indigo-100 text-indigo-900 font-semibold" : "text-gray-600 hover:bg-gray-100"}
      `}
    >
      <span>{label}</span>
    </Link>
  );

  return (
    <>
      <div
        className={`
          fixed inset-y-0 left-0 z-50 bg-white shadow-2xl transition-all duration-300 ease-in-out
    flex flex-col py-4 overflow-y-auto overflow-x-hidden
    w-64 flex-shrink-0
          ${isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"}
          md:relative md:translate-x-0 md:shadow-lg
          ${isOpen ? "md:w-20" : "md:w-64"}
        `}
      >
        <nav className="flex-1 px-3 space-y-1">
          {/* Dashboard */}
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

          {/* Attendance */}
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

          {/* Performance/Todo */}
          <Link to="/users/todo" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<LuListTodo size={20} />}
              title="Todo's"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => toggleButtonActive("Performance")}
              activeBtns={activeBtns}
              activeBtn="Performance"
            />
          </Link>

          {/* Payroll Section */}
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
              <div className="flex flex-col border-gray">
                <SubLink to="/user/overTime" label="Over Time" />
                <SubLink to="/user/advanceSalary" label="Advance Salary" />
                <SubLink to="/user/applyLoan" label="Apply Loan" />
              </div>
            </AccordionItem>
          )}

          {/* Projects */}
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

          {/* Leave */}
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

          {/* Salary */}
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

          {/* Progress */}
          <Link to="/users/progress" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<GiProgression size={20} />}
              title="Progress"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => toggleButtonActive("Performance")}
              activeBtns={activeBtns}
              activeBtn="Performance"
            />
          </Link>

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
              <div className="flex flex-col border-gray">
                <SubLink to="/user/promotion" label="Promotion Request" />
                <SubLink to="/user/resignation" label="Resignation Request" />
                <SubLink to="/user/rejoin" label="Rejoin Request" />
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
              <div className="flex flex-col border-gray">
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
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen?.(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};