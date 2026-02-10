import loginAvatar from "../assets/Avatar.png";
import { RxHamburgerMenu } from "react-icons/rx";
import headerLogo from "../assets/technic.png";
import { CiBellOn } from "react-icons/ci";
import React, { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../redux/Hooks";
import ProfileDropdown from "./ProfileComponent/ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Content/URL";
import axios from "axios";

export interface IHeaderProps extends React.ComponentPropsWithoutRef<"div"> {
  isOpen: boolean;
  toggleSideBar: () => void;
}

export const Header = ({ isOpen, toggleSideBar }: IHeaderProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showTime, setShowTime] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleLogoClick = () => {
    const role = currentUser?.role?.toLowerCase();
    if (role === "admin") navigate("/");
    else if (role === "user") navigate("/User/dashboard");
    else navigate("/");
  };

  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;
    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getUsersLeaves`
          : `${BASE_URL}/api/user/getMyLeaves`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      setNotifications(res.data.slice(-5).reverse());
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  }, [currentUser]);

  const handleToggleViewModal = () => {
    setIsOpenModal(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setShowTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentUser) fetchNotifications();
  }, [currentUser, fetchNotifications]);

  return (
    <div className="bg-indigo-900 w-full h-16 px-4 flex items-center relative">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {!isOpen && (
            <div
              className="flex-shrink-0 hidden lg:block animate-fade-in cursor-pointer"
              onClick={handleLogoClick}
            >
              <img
                src={headerLogo}
                alt="logo"
                className="w-32 h-auto object-contain"
              />
            </div>
          )}
          <button
            onClick={toggleSideBar}
            className={`p-2 rounded-full text-white hover:bg-white/20 transition-all ${isOpen ? "ml-1" : "lg:ml-[85px]"}`}
          >
            <RxHamburgerMenu size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <span className="text-white text-[10px] md:text-xs font-medium">
            {showTime}
          </span>

          <div className="flex items-center gap-3 relative">
            <div
              className="relative flex items-center justify-center h-8 w-8 cursor-pointer"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
            >
              {notifications.length > 0 && (
                <span className="absolute inset-0 animate-ping rounded-full bg-sky-400 opacity-75"></span>
              )}
              <CiBellOn size={24} className="relative text-white" />
              {notifications.length > 0 && (
                <span
                  className="absolute top-1 right-1 h-2.5 w-3.0 rounded-full bg-black border-2 
                border-indigo-900 flex items-center justify-center text-[10px] text-white font-bold"
                >
                  {notifications.length}
                </span>
              )}
              {isNotifOpen && (
                <NotificationDropdown
                  notifications={notifications}
                  onClose={() => setIsNotifOpen(false)}
                />
              )}
            </div>

            {/* User Info */}
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
