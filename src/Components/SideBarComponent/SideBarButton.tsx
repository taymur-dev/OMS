import React from "react";

type SideBarButtonProps = {
  isOpen: boolean;
  icon: React.ReactNode;
  title: string;
  activeBtns: string;
  activeBtn: string;
  handlerClick: () => void;
  arrowIcon?: React.ReactNode;
};

export const SideBarButton = ({
  isOpen,
  icon,
  title,
  activeBtns,
  activeBtn,
  handlerClick,
  arrowIcon,
}: SideBarButtonProps) => {
  const isActive = activeBtns === activeBtn;

 
  const getBgClass = () => {
    if (isActive) {
      return isOpen ? "bg-blue-400 text-white" : "bg-white text-blue-400";
    }
    return "text-gray-600 hover:bg-blue-50 hover:text-blue-400";
  };

  return (
    <button
      onClick={handlerClick}
      className={`
        w-full flex items-center px-3 py-2 rounded-lg transition-all duration-300 group
        ${getBgClass()}
      `}
    >
      {/* Icon Wrapper: Yahan color handle hoga */}
      <div 
        className={`
          flex items-center justify-center min-w-[24px] transition-transform duration-300 group-hover:scale-110
          ${isActive && !isOpen ? "text-blue-400" : ""}
        `}
      >
        {icon}
      </div>

      <div
        className={`
          flex items-center justify-between flex-1 ml-3 transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? "opacity-100 max-w-xs" : "opacity-0 max-w-0 pointer-events-none"}
        `}
      >
        <span className="text-sm font-medium whitespace-nowrap">{title}</span>

        {arrowIcon && (
          <span
            className={`
              ml-2 transition-transform duration-300 text-gray-300
              ${isActive ? "-rotate-90" : "rotate-0"}
              ${isActive && isOpen ? "text-white" : "text-gray-300"}
            `}
          >
            {arrowIcon}
          </span>
        )}
      </div>
    </button>
  );
};
