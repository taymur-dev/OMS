import loginAvatar from "../assets/Avatar.png";
import { RxHamburgerMenu } from "react-icons/rx";
import headerLogo from "../assets/technic.png";
// import { BsThreeDotsVertical } from "react-icons/bs";
import { CiBellOn } from "react-icons/ci";
import React, { useState } from "react";
import { useAppSelector } from "../redux/Hooks";
import ProfileDropdown from "./ProfileComponent/ProfileDropdown";

export interface IHeaderProps extends React.ComponentPropsWithoutRef<"div"> {
  isOpen: boolean;
  toggleSideBar: () => void;
}

export const Header = ({ isOpen, toggleSideBar }: IHeaderProps) => {
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [showTime, setShowTime] = useState("");

  

  const handleToggleViewModal = () => {
    setIsOpenModal(true);
  };
  setInterval(() => {
    const getTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    setShowTime(getTime);
  }, 1000);

  // return (
  //   <div className="bg-indigo-900 max-w-full h-14 px-2 pt-1.5 relative  w-full">
  //     <div className="flex items-center justify-between ">
  //       <div className="flex gap-2 items-center ml-2 w-48  ">
  //         {!isOpen && (
  //           <div className="w-full">
  //             <img src={headerLogo} alt="logo" className="w-32 h-11" />
  //           </div>
  //         )}

  //         {/* Toggle Button */}
  //         <button
  //           onClick={toggleSideBar}
  //           className="p-2 rounded-full shadow-md hover:bg-gray-200 hover:text-indigo-900
  //           text-white transition-all duration-300 mt-2 flex"
  //         >
  //           {isOpen ? <RxHamburgerMenu /> : <BsThreeDotsVertical />}
  //         </button>
  //       </div>

  //       <div className="flex items-center justify-center gap-2">
  //         <span className="text-white text-xs">{showTime}</span>
  //         <span className="relative flex items-center justify-center size-6">
  //           {/* Ping Animation */}
  //           {currentUser && (
  //             <span className="absolute size-full animate-ping rounded-full bg-sky-400 opacity-75 "></span>
  //           )}

  //           {/* Notification Bell */}
  //           <CiBellOn
  //             size={25}
  //             className="relative text-white hover:cursor-pointer"
  //             title="Notification"
  //           />

  //           {/* Small Indicator Badge */}
  //           {currentUser && (
  //             <span className="absolute top-0 right-0 size-3 rounded-full bg-sky-500 border-2 border-white hover:cursor-pointer"></span>
  //           )}
  //         </span>

  //         <div className="text-xs text-white mx-0.5">
  //           <p className="">{currentUser?.name}</p>
  //           <h4 className="">{currentUser?.role}</h4>
  //         </div>
  //         <img
  //           onClick={() => handleToggleViewModal()}
  //           src={loginAvatar || currentUser?.image}
  //           alt="login"
  //           className="w-11 hover:cursor-pointer  active:scale-95 active:translate-y-1 transition duration-200"
  //         />
  //       </div>
  //     </div>
  //     {isOpenModal && (
  //       <ProfileDropdown
  //         isOpenModal={true}
  //         setIsOpenModal={() => setIsOpenModal(false)}
  //       />
  //     )}
  //   </div>
  // );

  return (
    <div className="bg-indigo-900 w-full h-16 px-4 flex items-center relative">
      <div className="flex items-center justify-between w-full">
        {/* LEFT SECTION: Logo & Toggle */}
       {/* LEFT SECTION: Logo & Toggle */}
<div className="flex items-center gap-2">
  
  {/* 1. Toggle Button - Ab ye hamesha pehle rahega ya position adjust karega */}
  

  {/* 2. Logo - Sirf tab dikhega jab sidebar collapse (isOpen: false) ho */}
  {!isOpen && (
    <div className="flex-shrink-0 hidden lg:block animate-fade-in">
      <img
        src={headerLogo}
        alt="logo"
        className="w-32 h-auto object-contain"
      />
    </div>
  )}

  <button
    onClick={toggleSideBar}
    className={`p-2 rounded-full shadow-md hover:bg-white/20 text-white transition-all duration-300 flex items-center justify-center 
      ${isOpen ? "ml-1" : "lg:ml-[85px]"}`} 
      
  >
    <RxHamburgerMenu size={20} />
  </button>
</div>

        {/* RIGHT SECTION: Time, Notifications, Avatar */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Time - Hidden on very small screens to save space, or kept if preferred */}
          <span className="text-white text-[10px] md:text-xs font-medium whitespace-nowrap">
            {showTime}
          </span>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
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

            {/* User Info - Hidden on mobile, shown on Tablet/Desktop */}
            <div className="hidden sm:block text-right">
              <p className="text-white text-xs font-bold leading-none">
                {currentUser?.name}
              </p>
              <h4 className="text-white text-[10px] opacity-80 uppercase mt-1">
                {currentUser?.role}
              </h4>
            </div>

            {/* Avatar */}
            <img
              onClick={() => handleToggleViewModal()}
              src={loginAvatar || currentUser?.image}
              alt="user profile"
              className="h-10 w-10 rounded-full object-cover cursor-pointer active:scale-95 transition duration-200 border-2 border-white/20"
            />
          </div>
        </div>
      </div>

      {/* Dropdown Modal */}
      {isOpenModal && (
        <ProfileDropdown
          isOpenModal={true}
          setIsOpenModal={() => setIsOpenModal(false)}
        />
      )}
    </div>
  );
};
