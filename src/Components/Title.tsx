import React from "react";
import { RxCross1 } from "react-icons/rx";

type TitleProps = {
  children: React.ReactNode;
  setModal: () => void;
  className?: string; // Added to the component below
};

export const Title = ({ children, setModal, className = "" }: TitleProps) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between py-3 text-white font-sans">
        {/* text-lg on mobile, text-2xl on medium screens and up */}
        <span className="font-semibold text-lg md:text-2xl">
          {children}
        </span>
        <span className="hover:cursor-pointer">
          <RxCross1 size={22} onClick={() => setModal()} title="Close" />
        </span>
      </div>
      <div className="border-b mx-1 border-gray-300"></div>
    </div>
  );
};