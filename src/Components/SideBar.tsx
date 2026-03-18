import { SideBarButton } from "./SideBarComponent/SideBarButton";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/Hooks";
import { FaUserFriends, FaUserCog } from "react-icons/fa";
import { PiFingerprintDuotone } from "react-icons/pi";
import { GoProjectRoadmap } from "react-icons/go";
import { LuListTodo } from "react-icons/lu";
import { CiCalculator2, CiCreditCard1, CiVault } from "react-icons/ci";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { AiOutlineFieldTime } from "react-icons/ai";
import { CgCalculator } from "react-icons/cg";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { RiUserCommunityLine } from "react-icons/ri";
import { HiOutlineUsers } from "react-icons/hi2";

type SideBarProps = {
  isOpen: boolean;
  setIsOpen?: (open: boolean) => void;
};

type TActivButton =
  | "Dashboard" | "People" | "Attendance" | "Human Resources" | "Projects"
  | "Performance" | "Sales" | "Expenses" | "Payroll" | "Assets"
  | "Talent Acquisition" | "Dynamics" | "Accounts" | "Reports"
  | "Users Management" | "Configuration";

export const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const { currentUser, permissions } = useAppSelector((state) => state.officeState);
  const [activeBtns, setActiveBtns] = useState<TActivButton | "">("");
  const [isBlurred, setIsBlurred] = useState(false);

  // Modal detection logic
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

  // ALTERNATED HOVER LOGIC:
  // If the sidebar is closed (mini), hovering over it opens it.
  const handleMouseEnter = () => {
    if (window.innerWidth >= 768 && !isOpen) {
      setIsOpen?.(true);
    }
  };

  // If the sidebar was opened via hover, leaving it closes it.
  const handleMouseLeave = () => {
    if (window.innerWidth >= 768 && isOpen) {
      setIsOpen?.(false);
    }
  };

  const toggleButtonActive = (activeBtn: TActivButton) => {
    setActiveBtns((prev) => (prev === activeBtn ? "" : activeBtn));
  };

  useEffect(() => {
    setActiveBtns("Dashboard");
  }, []);

  const hasAccess = (moduleName: string) => {
    if (currentUser?.role === "admin") return true;
    return permissions?.includes(moduleName);
  };

  // Configuration for menu items to keep the JSX clean
  const menuItems = [
    { title: "Dashboard", path: "/", icon: <MdOutlineDashboard size={20} />, access: "Dashboard" },
    { title: "People", path: "/people", icon: <FaUserFriends size={20} />, access: "People" },
    { title: "Attendance", path: "/attendance", icon: <PiFingerprintDuotone size={20} />, access: "Attendance" },
    { title: "Human Resources", path: "/human-resources", icon: <FaUserCog size={20} />, access: "Human Resources" },
    { title: "Talent Acquisition", path: "/talent-acquisition", icon: <HiOutlinePencilSquare size={20} />, access: "Talent Acquisition" },
    { title: "Projects", path: "/projects", icon: <GoProjectRoadmap size={20} />, access: "Projects" },
    { title: "Performance", path: "/performance", icon: <LuListTodo size={20} />, access: "Performance" },
    { title: "Sales", path: "/sales", icon: <CiCalculator2 size={20} />, access: "Sales" },
    { title: "Expenses", path: "/expenses", icon: <LiaProjectDiagramSolid size={20} />, access: "Expenses" },
    { title: "Payroll", path: "/payroll", icon: <CiCreditCard1 size={20} />, access: "Payroll" },
    { title: "Assets", path: "/assets", icon: <CiVault size={20} />, access: "Assets" },
    { title: "Dynamics", path: "/dynamics", icon: <RiUserCommunityLine size={20} />, access: "Dynamics" },
    { title: "Accounts", path: "/accounts", icon: <CgCalculator size={20} />, access: "Accounts" },
    { title: "Reports", path: "/reports", icon: <HiOutlineDocumentReport size={20} />, access: "Reports" },
    { title: "Users Management", path: "/users-management", icon: <HiOutlineUsers size={20} />, access: "Users Management" },
    { title: "Configuration", path: "/configuration", icon: <AiOutlineFieldTime size={20} />, access: "Configuration" },
  ];

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          fixed inset-y-0 left-0 bg-white shadow-2xl transition-all duration-300 ease-in-out
          flex flex-col overflow-y-auto overflow-x-hidden flex-shrink-0
          z-50 md:z-30
          
          /* Blur Logic */
          ${isBlurred ? "blur-sm pointer-events-none scale-[0.99]" : "blur-0 pointer-events-auto"}

          /* MOBILE Behavior */
          ${isOpen ? "w-64 translate-x-0 visible" : "w-0 -translate-x-full invisible md:visible"}
          
          /* DESKTOP Behavior (MODIFIED) */
          md:relative md:translate-x-0 md:shadow-lg md:visible
          ${isOpen ? "md:w-64" : "md:w-20"} 
        `}
      >
        <nav className="flex-1 px-3 space-y-1 mt-4">
          {menuItems.map((item) => (
            item.access === "Dashboard" || hasAccess(item.access) ? (
              <Link key={item.title} to={item.path} className="block">
                <SideBarButton
                  isOpen={isOpen}
                  icon={item.icon}
                  title={item.title}
                  arrowIcon={<BiArrowBack />}
                  handlerClick={() => {
                    toggleButtonActive(item.title as TActivButton);
                    if (window.innerWidth < 768) setIsOpen?.(false);
                  }}
                  activeBtns={activeBtns}
                  activeBtn={item.title as TActivButton}
                />
              </Link>
            ) : null
          ))}
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is expanded */}
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