import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type ButtonProps = {
  title: string;
  icon: React.ReactNode;
  arrowIcon?: React.ReactNode;
  isOpen: boolean;
  handlerClick: () => void;
  activeBtn: string;
  activeBtns: string;
  className?: string;
};

export const SideBarButton = ({
  title,
  icon,
  arrowIcon,
  isOpen,
  handlerClick,
  activeBtns,
  activeBtn,
  className, // <-- now we'll use it
}: ButtonProps) => {
  return (
    <div
      onClick={handlerClick}
      className={`flex items-center ${
        isOpen ? "justify-center" : ""
      } gap-2 p-2 rounded cursor-pointer text-gray-900 hover:bg-indigo-500 hover:text-white 
 transition no-underline border-b m-2 ${
   activeBtns === activeBtn ? "bg-indigo-500 text-white" : ""
 } ${className ?? ""}`}
    >
      <span>{icon}</span>
      {isOpen ? "" : <span className="w-24 text-xs">{title}</span>}
      {!isOpen && arrowIcon && (
        <span>
          {activeBtns === activeBtn ? (
            <FaChevronUp size={10} />
          ) : (
            <FaChevronDown size={10} />
          )}
        </span>
      )}
    </div>
  );
};
