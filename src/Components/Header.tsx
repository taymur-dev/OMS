import loginAvatar from "../assets/Avatar.png";
import { RxHamburgerMenu } from "react-icons/rx";
import headerLogo from "../assets/technic.png";
import { CiBellOn } from "react-icons/ci";
import React, { useState, useEffect } from "react"; // Added useEffect for cleaner timer
import { useAppSelector } from "../redux/Hooks";
import ProfileDropdown from "./ProfileComponent/ProfileDropdown";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

export interface IHeaderProps extends React.ComponentPropsWithoutRef<"div"> {
  isOpen: boolean;
  toggleSideBar: () => void;
}

export const Header = ({ isOpen, toggleSideBar }: IHeaderProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showTime, setShowTime] = useState("");

  const handleLogoClick = () => {
  const role = currentUser?.role?.toLowerCase(); 

  if (role === "admin") {
    navigate("/");
  } else if (role === "user") {
    navigate("/User/dashboard");
  } else {
    console.log("Current role is:", currentUser?.role); 
    navigate("/"); 
  }
};

  const handleToggleViewModal = () => {
    setIsOpenModal(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const getTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setShowTime(getTime);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-indigo-900 w-full h-16 px-4 flex items-center relative">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {!isOpen && (
            /* Logo Container */
            <div
              className="flex-shrink-0 hidden lg:block animate-fade-in cursor-pointer"
              onClick={handleLogoClick}
            >
              <img
                src={headerLogo}
                alt="logo"
                className="w-32 h-auto object-contain hover:opacity-80 transition-opacity"
              />
            </div>
          )}

          <button
            onClick={toggleSideBar}
            className={`p-2 rounded-full shadow-md hover:bg-white/20 text-white transition-all duration-300
               flex items-center justify-center 
      ${isOpen ? "ml-1" : "lg:ml-[85px]"}`}
          >
            <RxHamburgerMenu size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <span className="text-white text-[10px] md:text-xs font-medium whitespace-nowrap">
            {showTime}
          </span>

          <div className="flex items-center gap-3">
            <span className="relative flex items-center justify-center h-8 w-8">
              {currentUser && (
                <span className="absolute inset-0 animate-ping rounded-full bg-sky-400 opacity-75"></span>
              )}
              <CiBellOn
                size={24}
                className="relative text-white cursor-pointer"
                title="Notification"
              />
              {currentUser && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-sky-500 border-2 border-indigo-900"></span>
              )}
            </span>

            <div className="hidden sm:block text-right">
              <p className="text-white text-xs font-bold leading-none">
                {currentUser?.name}
              </p>
              <h4 className="text-white text-[10px] opacity-80 mt-1">
                {currentUser?.role}
              </h4>
            </div>

            <img
              onClick={() => handleToggleViewModal()}
              src={loginAvatar || currentUser?.image}
              alt="user profile"
              className="h-10 w-10 rounded-full object-cover cursor-pointer active:scale-95 
              transition duration-200 border-2 border-white/20"
            />
          </div>
        </div>
      </div>

      {isOpenModal && (
        <ProfileDropdown
          isOpenModal={true}
          setIsOpenModal={() => setIsOpenModal(false)}
        />
      )}
    </div>
  );
};
