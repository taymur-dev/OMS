import Avatar from "../assets/vector.png";
import { RxHamburgerMenu } from "react-icons/rx";
import headerLogo from "../assets/techmen.png";
import { CiBellOn } from "react-icons/ci";
import React, { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../redux/Hooks";
import ProfileDropdown from "./ProfileComponent/ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Content/URL";
import axios from "axios";

export interface IHeaderProps extends React.ComponentPropsWithoutRef<"div"> {
  toggleSideBar: () => void;
  isOpen: boolean;
}

export const Header = ({ toggleSideBar, isOpen }: IHeaderProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const [isOpenModal, setIsOpenModal] = useState(false);
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
    if (currentUser) fetchNotifications();
  }, [currentUser, fetchNotifications]);

  return (
    <div className="bg-white w-full h-16 px-2 sm:px-4 flex shadow-md z-40 items-center relative">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1 sm:gap-10">
          {/* Logo Section */}
          <div
            className="flex items-center w-[180px] flex-shrink-0 cursor-pointer"
            onClick={handleLogoClick}
          >
            <img
              src={headerLogo}
              alt="logo"
              className="h-12 sm:h-14 w-auto object-contain"
            />
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleSideBar}
            className="text-blue-400 hover:bg-gray-100 rounded-full transition-colors flex items-center 
            justify-center w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <RxHamburgerMenu
              size={26}
              className={`transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
            />
          </button>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* Notification Bell */}
            <div
              className="relative flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 cursor-pointer
               hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
            >
              {notifications.length > 0 && (
                <>
                  <span className="absolute inset-0 animate-ping rounded-full bg-sky-400 opacity-75"></span>
                  <span
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 flex 
                  items-center justify-center text-[8px] sm:text-[10px] text-white font-bold z-10"
                  >
                    {notifications.length > 5 ? "5+" : notifications.length}
                  </span>
                </>
              )}
              <CiBellOn
                size={18}
                className="sm:w-5 sm:h-5 relative text-gray-700"
              />
              {isNotifOpen && (
                <NotificationDropdown
                  notifications={notifications}
                  onClose={() => setIsNotifOpen(false)}
                />
              )}
            </div>

            {/* User Info */}
            <div className="hidden xs:block text-right min-w-[70px] sm:min-w-[90px] md:min-w-[100px]">
              <p className="text-blue-500 text-xs sm:text-sm font-semibold leading-none truncate">
                {currentUser?.name || "User"}
              </p>
              <p className="text-gray-500 text-[10px] sm:text-xs capitalize truncate mt-0.5">
                {currentUser?.role || "Role"}
              </p>
            </div>

            {/* User Avatar */}
            <img
              onClick={() => handleToggleViewModal()}
              src={Avatar || currentUser?.image}
              alt={currentUser?.name || "User profile"}
              className="h-8 w-8 sm:h-9 sm:w-10 rounded-full object-cover cursor-pointer active:scale-95
                 transition duration-200 border-2 border-gray-200 hover:border-blue-400"
            />
          </div>
        </div>

        {isOpenModal && (
          <div className="absolute top-9 right-4 z-50">
            <ProfileDropdown
              isOpenModal={true}
              setIsOpenModal={() => setIsOpenModal(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
