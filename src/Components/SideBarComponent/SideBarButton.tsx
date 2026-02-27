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

  return (
    <button
      onClick={handlerClick}
      className={`
        w-full flex items-center px-3 py-2.5 my-1 rounded-lg transition-all duration-300 group
        ${isActive ? "bg-blue-400 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-indigo-900"}
      `}
    >
      <div className="flex items-center justify-center min-w-[24px] transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <div
        className={`
          flex items-center justify-between flex-1 ml-3 transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? "md:opacity-0 md:max-w-0" : "opacity-100 max-w-xs"}
        `}
      >
        <span className="text-sm font-medium whitespace-nowrap">{title}</span>

        {arrowIcon && (
          <span
            className={`
              ml-2 transition-transform duration-300 text-gray-500
              ${isActive ? "-rotate-90" : "rotate-0"}
            `}
          >
            {arrowIcon}
          </span>
        )}
      </div>
    </button>
  );
};
