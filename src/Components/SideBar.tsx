import { SideBarButton } from "./SideBarComponent/SideBarButton";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserFriends, FaUserCog } from "react-icons/fa";
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

type SideBarProps = {
  isOpen: boolean;
  setIsOpen?: (open: boolean) => void;
};

type TActivButton =
  | "Dashboard"
  | "People"
  | "Attendance"
  | "Human Resources"
  | "Projects"
  | "Performance"
  | "Sales"
  | "Expenses"
  | "Chat"
  | "Payroll"
  | "Assets Management"
  | "Talent Acquisition"
  | "Dynamic"
  | "Accounts"
  | "Reports"
  | "Configuration";

export const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
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

          <Link to="/people" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<FaUserFriends size={20} />}
              title="People"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("People");
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="People"
            />
          </Link>

          {/* Attendance */}

          <Link to="/attendance" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<PiFingerprintDuotone size={20} />}
              title="Attendance"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("Attendance");
                // Add this line:
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="Attendance"
            />
          </Link>

          {/* Human Resources */}

          <Link to="/human-resources" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<FaUserCog size={20} />}
              title="Human Resources"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("Human Resources");
                // Add this line:
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="Human Resources"
            />
          </Link>

          {/* Recruitment */}
          <Link to="/talent-acquisition" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<HiOutlinePencilSquare size={20} />}
              title="Talent Acquisition"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("Talent Acquisition");
                // Add this line:
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="Talent Acquisition"
            />
          </Link>

          {/* Projects */}
          <Link to="/projects" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<GoProjectRoadmap size={20} />}
              title="Projects"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("Projects");
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="Projects"
            />
          </Link>

          {/* Performance */}
          <Link to="/performance" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<LuListTodo size={20} />}
              title="Performance"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("Performance");
                // Add this line:
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="Performance"
            />
          </Link>

          {/* Sale */}
          <Link to="/sales" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<CiCalculator2 size={20} />}
              title="Sales"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("Sales");
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="Sales"
            />
          </Link>

          {/* Manage Expense */}
          <Link to="/expenses" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<LiaProjectDiagramSolid size={20} />}
              title="Expenses"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("Expenses");
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="Expenses"
            />
          </Link>

          {/* Payroll */}
          <Link to="/payroll" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<CiCreditCard1 size={20} />}
              title="Payroll"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("Payroll");
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="Payroll"
            />
          </Link>

          {/* Assets */}
          <Link to="/assets" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<CiCreditCard1 size={20} />}
              title="Assets"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("Assets Management");
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="Assets"
            />
          </Link>

          {/* Dynamic */}
          <Link to="/dynamics" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<RiUserCommunityLine size={20} />}
              title="Dynamics"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("Dynamic");
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="Dynamics"
            />
          </Link>

          {/* Accounts */}
          <Link to="/accounts" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<CgCalculator size={20} />}
              title="Accounts"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("Accounts");
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="Accounts"
            />
          </Link>

          {/* Reports */}
          {/* <SideBarButton
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
          )} */}

          <Link to="/reports" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<HiOutlineDocumentReport size={20} />}
              title="Reports"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("Reports");
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="Reports"
            />
          </Link>

          {/* Configure Time */}

          <Link to="/configuration" className="block">
            <SideBarButton
              isOpen={isOpen}
              icon={<AiOutlineFieldTime size={20} />}
              title="Configuration"
              arrowIcon={<BiArrowBack />}
              handlerClick={() => {
                toggleButtonActive("Configuration");
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              activeBtns={activeBtns}
              activeBtn="Configuration"
            />
          </Link>
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
