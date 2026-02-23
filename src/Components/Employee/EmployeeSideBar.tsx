import { SideBarButton } from "../SideBarComponent/SideBarButton";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  | "Assigned Projects"
  | "Progress"
  | "Todo"
  | "Payroll"
  | "Leave"
  | "Salary"
  | "Dynamic"
  | "Reports";

export const EmployeeSideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const [activeBtns, setActiveBtns] = useState<TActivButton | "">("");
  const [isHoverable, setIsHoverable] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const checkModal = () => {
      const hasModalClass = document.body.classList.contains("modal-open");
      const isScrollLocked = document.body.style.overflow === "hidden";
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
    setIsHoverable(isOpen);
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

  // Centralized click handler
  const handleItemClick = (btn: TActivButton, hasSubmenu: boolean = false) => {
    setActiveBtns((prev) => (prev === btn ? "" : btn));

    // Close sidebar on mobile if it's a direct link (no submenu)
    if (!hasSubmenu && window.innerWidth < 768) {
      setIsOpen?.(false);
    }
  };

  useEffect(() => {
    setActiveBtns("Dashboard");
  }, []);

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
              handlerClick={() => handleItemClick("Dashboard")}
              activeBtns={activeBtns}
              activeBtn="Dashboard"
            />
          </Link>

          <Link to="/users/attendance" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<PiFingerprintDuotone size={20} />}
              title="Attendance"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => handleItemClick("Attendance")}
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
              handlerClick={() => handleItemClick("Todo")}
              activeBtns={activeBtns}
              activeBtn="Todo"
            />
          </Link>

          <Link to="/users/progress" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<GiProgression size={20} />}
              title="Progress"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => handleItemClick("Progress")}
              activeBtns={activeBtns}
              activeBtn="Progress"
            />
          </Link>

          <Link to="/users/assignedprojects" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<GoProjectRoadmap size={20} />}
              title="Assigned Projects"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => handleItemClick("Assigned Projects")}
              activeBtns={activeBtns}
              activeBtn="Assigned Projects"
            />
          </Link>

          <Link to="/users/leaveRequests" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<FaUserSlash size={20} />}
              title="Apply Leave"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => handleItemClick("Leave")}
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
              handlerClick={() => handleItemClick("Salary")}
              activeBtns={activeBtns}
              activeBtn="Salary"
            />
          </Link>

          <Link to="/user/payroll" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<CiCreditCard1 size={20} />}
              title="Payroll"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => handleItemClick("Payroll")}
              activeBtns={activeBtns}
              activeBtn="Payroll"
            />
          </Link>

          <Link to="/user/dynamics" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<RiUserCommunityLine size={20} />}
              title="Dynamics"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => handleItemClick("Dynamic")}
              activeBtns={activeBtns}
              activeBtn="Dynamics"
            />
          </Link>

          <Link to="/user/reports" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<HiOutlineDocumentReport size={20} />}
              title="Reports"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => handleItemClick("Reports")}
              activeBtns={activeBtns}
              activeBtn="Reports"
            />
          </Link>
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
