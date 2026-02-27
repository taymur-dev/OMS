import React from "react";
import { RxCross1 } from "react-icons/rx";

type TitleProps = {
  children: React.ReactNode;
  setModal: () => void;
  className?: string; 
};

export const Title = ({ children, setModal, className = "" }: TitleProps) => {
  return (
    <div className={className}>
     
      <div className="flex items-center justify-between py-3 p-4 text-black font-sans">
        <span className="font-semibold text-lg md:text-2xl">{children}</span>
        <span className="hover:cursor-pointer">
          <RxCross1 size={22} onClick={() => setModal()} title="Close" />
        </span>
      </div>
      <div className="border-b border-gray-300 "></div>
    </div>
  );
};
